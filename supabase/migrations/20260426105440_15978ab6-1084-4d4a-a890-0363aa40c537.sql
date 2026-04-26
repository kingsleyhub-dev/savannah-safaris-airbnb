ALTER TABLE public.media_assets
ADD COLUMN gallery_category TEXT;

CREATE INDEX idx_media_assets_gallery_category ON public.media_assets(gallery_category);