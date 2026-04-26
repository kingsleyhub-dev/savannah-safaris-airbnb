import { supabase } from "@/integrations/supabase/client";

export const logReceiptDownload = async (userId: string | undefined, bookingId: string | null | undefined) => {
  if (!userId || !bookingId || bookingId === "PENDING") return;

  const { error } = await (supabase.from("receipt_downloads" as any) as any).insert({
    user_id: userId,
    booking_id: bookingId,
  });

  if (error) throw error;
};