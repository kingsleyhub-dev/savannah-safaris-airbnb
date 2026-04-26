import { supabase } from "@/integrations/supabase/client";

/**
 * Capture a JPEG frame from a video file (client-side) at the given time offset.
 * Returns a Blob ready for upload, or null if extraction fails.
 */
export async function captureVideoFrame(
  source: File | string,
  seekSeconds = 1,
  quality = 0.85
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      if (typeof source !== "string") URL.revokeObjectURL(video.src);
      video.removeAttribute("src");
      video.load();
    };

    video.onloadedmetadata = () => {
      const target = Math.min(Math.max(seekSeconds, 0), Math.max(0, (video.duration || 1) - 0.1));
      video.currentTime = target;
    };

    video.onseeked = () => {
      try {
        const w = video.videoWidth || 1280;
        const h = video.videoHeight || 720;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { cleanup(); resolve(null); return; }
        ctx.drawImage(video, 0, 0, w, h);
        canvas.toBlob((blob) => { cleanup(); resolve(blob); }, "image/jpeg", quality);
      } catch {
        cleanup();
        resolve(null);
      }
    };

    video.onerror = () => { cleanup(); resolve(null); };

    video.src = typeof source === "string" ? source : URL.createObjectURL(source);
  });
}

/**
 * Upload a poster blob to the media bucket and return its public URL + path.
 */
export async function uploadPoster(blob: Blob): Promise<{ url: string; path: string } | null> {
  const path = `posters/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, blob, { contentType: "image/jpeg", cacheControl: "3600" });
  if (error) return null;
  const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
  return { url: publicUrl, path };
}
