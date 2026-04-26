CREATE TABLE public.receipt_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  booking_id UUID NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.receipt_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users create own receipt downloads"
ON public.receipt_downloads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own receipt downloads"
ON public.receipt_downloads
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all receipt downloads"
ON public.receipt_downloads
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE INDEX idx_receipt_downloads_user_id ON public.receipt_downloads(user_id);
CREATE INDEX idx_receipt_downloads_booking_id ON public.receipt_downloads(booking_id);
CREATE INDEX idx_receipt_downloads_downloaded_at ON public.receipt_downloads(downloaded_at DESC);