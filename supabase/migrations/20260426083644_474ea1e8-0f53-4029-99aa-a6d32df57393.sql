ALTER TABLE public.media_assets
ADD COLUMN IF NOT EXISTS show_in_gallery boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS gallery_sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_media_assets_gallery_published
ON public.media_assets (show_in_gallery, is_published, kind, gallery_sort_order, created_at DESC);

UPDATE public.media_assets
SET published_at = COALESCE(published_at, created_at)
WHERE is_published = true AND published_at IS NULL;