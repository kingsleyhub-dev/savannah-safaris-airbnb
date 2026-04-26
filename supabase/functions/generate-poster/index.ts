// Generates an AI-styled poster (cover frame) for a gallery video.
// Uses Lovable AI Gateway (Nano Banana 2) — no user-provided API key needed.
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Brand context — kept on the backend to avoid prompt drift from the client.
const BRAND_CONTEXT =
  "Brand: Savannah Safaris — a luxury Nairobi short-stay rental. " +
  "Palette: deep olive green (#3F4F0E), sage/lime accents, warm cream (#F1E9C4), " +
  "soft beige backgrounds, charcoal type. " +
  "Vibe: refined, calm, editorial, soft natural light, golden-hour warmth, hospitality, organic textures.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { reference_image, category, caption, filename } = await req.json();
    if (!reference_image || typeof reference_image !== "string") {
      return new Response(JSON.stringify({ error: "reference_image is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = caption || category || filename || "interior scene";
    const prompt =
      `${BRAND_CONTEXT}\n\n` +
      `Create a polished 16:9 video poster cover image inspired by the supplied reference frame. ` +
      `Subject: ${subject}. ` +
      `Re-render in the brand's editorial luxury style — soft cinematic lighting, balanced composition, ` +
      `warm cream and olive-green palette accents, subtle film grain, magazine-cover quality. ` +
      `Keep the same general scene, framing, and recognisable elements from the reference, ` +
      `but elevate colour grading and clarity. No text, no logos, no watermarks, no people added. ` +
      `Output a single high-resolution image.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: reference_image } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", aiRes.status, text);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const imageUrl =
      data?.choices?.[0]?.message?.images?.[0]?.image_url?.url ??
      data?.choices?.[0]?.message?.images?.[0]?.url ??
      null;

    if (!imageUrl) {
      console.error("No image in AI response", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "No image returned from AI" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ image: imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-poster error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
