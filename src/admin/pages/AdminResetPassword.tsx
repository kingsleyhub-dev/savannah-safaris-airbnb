import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Password updated"); navigate("/admin/dashboard", { replace: true }); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-secondary to-background p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <div className="text-center mb-8 space-y-2">
          <div className="size-14 rounded-2xl gradient-forest text-primary-foreground grid place-items-center mx-auto">
            <Lock className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">Set new password</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2"><Label>New password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Confirm password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></div>
          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />} Update password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminResetPassword;
