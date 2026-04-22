import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "sonner";
import { Lock, Mail, Loader2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

const AdminLogin = () => {
  const { signIn, resetPassword, user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin/dashboard", { replace: true });
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setBusy(true);
    const { error } = await signIn(parsed.data.email, parsed.data.password);
    setBusy(false);
    if (error) toast.error(error);
    else toast.success("Welcome back");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().email().safeParse(email);
    if (!parsed.success) { toast.error("Enter a valid email"); return; }
    setBusy(true);
    const { error } = await resetPassword(email);
    setBusy(false);
    if (error) toast.error(error);
    else { toast.success("Password reset link sent. Check your inbox."); setResetMode(false); }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-secondary to-background p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <div className="text-center mb-8 space-y-2">
          <div className="size-14 rounded-2xl gradient-forest text-primary-foreground grid place-items-center mx-auto">
            <Lock className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">
            {resetMode ? "Reset your password" : "Sign in to manage your site"}
          </p>
        </div>

        <form onSubmit={resetMode ? handleReset : handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required autoComplete="email" />
            </div>
          </div>

          {!resetMode && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required autoComplete="current-password" />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />}
            {resetMode ? "Send reset link" : "Sign in"}
          </Button>

          <button type="button" onClick={() => setResetMode((v) => !v)} className="w-full text-sm text-muted-foreground hover:text-primary transition-smooth">
            {resetMode ? "← Back to sign in" : "Forgot your password?"}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
