import { supabase } from "@/integrations/supabase/client";

export const logAudit = async (
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>,
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("audit_log").insert({
    actor_id: user.id,
    actor_email: user.email,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata: metadata ?? null,
  });
};
