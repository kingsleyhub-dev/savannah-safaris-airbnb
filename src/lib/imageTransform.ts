/**
 * Builds an optimized Supabase Storage image URL using the transform API.
 * - Auto-converts to WebP when the browser supports it
 * - Resizes server-side so the browser downloads only what it renders
 * - Falls back to the original URL for non-Supabase URLs (e.g. bundled assets)
 */
export type ImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number; // 20–100
  resize?: "cover" | "contain" | "fill";
};

const SUPABASE_RENDER_PATH = "/storage/v1/object/public/";
const SUPABASE_RENDER_TRANSFORM_PATH = "/storage/v1/render/image/public/";

export function optimizeImage(url: string | null | undefined, opts: ImageTransformOptions = {}): string {
  if (!url) return "";
  // Only transform Supabase-hosted public URLs
  if (!url.includes(SUPABASE_RENDER_PATH)) return url;

  const { width, height, quality = 75, resize = "cover" } = opts;
  const transformed = url.replace(SUPABASE_RENDER_PATH, SUPABASE_RENDER_TRANSFORM_PATH);

  const params = new URLSearchParams();
  if (width) params.set("width", String(width));
  if (height) params.set("height", String(height));
  params.set("quality", String(quality));
  params.set("resize", resize);
  // Supabase auto-serves WebP when the client supports it via the Accept header

  return `${transformed}?${params.toString()}`;
}

/** Long-cache header for new uploads (1 year, immutable). */
export const LONG_CACHE_CONTROL = "31536000";
