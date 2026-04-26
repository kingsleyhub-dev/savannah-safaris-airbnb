-- Soft delete columns
ALTER TABLE public.media_assets ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Helpful indexes for filtering
CREATE INDEX IF NOT EXISTS idx_media_assets_deleted_at ON public.media_assets (deleted_at);
CREATE INDEX IF NOT EXISTS idx_bookings_deleted_at ON public.bookings (deleted_at);

-- Replace public read policy on media_assets to exclude soft-deleted
DROP POLICY IF EXISTS "Public can read media" ON public.media_assets;
CREATE POLICY "Public can read media"
ON public.media_assets
FOR SELECT
TO public
USING (deleted_at IS NULL);

-- Replace user read policy on bookings to exclude soft-deleted
DROP POLICY IF EXISTS "Users view own bookings" ON public.bookings;
CREATE POLICY "Users view own bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND deleted_at IS NULL);