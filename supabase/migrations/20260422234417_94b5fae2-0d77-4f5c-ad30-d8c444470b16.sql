-- Open content_fields to anonymous writes
DROP POLICY IF EXISTS "Admins manage content fields" ON public.content_fields;
CREATE POLICY "Anyone can manage content fields"
  ON public.content_fields FOR ALL
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Open sections
DROP POLICY IF EXISTS "Admins manage sections" ON public.sections;
CREATE POLICY "Anyone can manage sections"
  ON public.sections FOR ALL
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Open pages
DROP POLICY IF EXISTS "Admins manage pages" ON public.pages;
CREATE POLICY "Anyone can manage pages"
  ON public.pages FOR ALL
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Open site_settings
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Anyone can manage site settings"
  ON public.site_settings FOR ALL
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Open media_assets
DROP POLICY IF EXISTS "Admins manage media" ON public.media_assets;
CREATE POLICY "Anyone can manage media"
  ON public.media_assets FOR ALL
  TO anon, authenticated
  USING (true) WITH CHECK (true);

-- Allow audit log inserts from anyone (so admin actions still get recorded)
DROP POLICY IF EXISTS "Authenticated can insert audit log" ON public.audit_log;
CREATE POLICY "Anyone can insert audit log"
  ON public.audit_log FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Open storage bucket 'media' for public writes (uploads/deletes)
DROP POLICY IF EXISTS "Admins upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admins update media" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete media" ON storage.objects;

CREATE POLICY "Anyone can upload to media bucket"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anyone can update media bucket"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anyone can delete from media bucket"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'media');