import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/admin/auth/AuthProvider";

// Zod schemas — single source of truth for validation
const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Where to send the user after successful sign in.
  // Set by ProtectedGuestRoute when it redirects an unauthenticated user here.
  const from = (location.state as { from?: string } | null)?.from ?? "/booking";
  const message = (location.state as { message?: string } | null)?.message;

  // If the session loads and they're already signed in, bounce to intended destination.
  useEffect(() => {
    if (!loading && user) navigate(from, { replace: true });
  }, [loading, user, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailParsed = emailSchema.safeParse(email);
    if (!emailParsed.success) return toast.error(emailParsed.error.errors[0].message);
    const pwParsed = passwordSchema.safeParse(password);
    if (!pwParsed.success) return toast.error(pwParsed.error.errors[0].message);

    setBusy(true);
    const { error } = await signIn(emailParsed.data, pwParsed.data);
    setBusy(false);

    if (error) {
      // Map Supabase error strings to friendlier messages
      if (/invalid login credentials/i.test(error)) {
        toast.error("Wrong email or password. Please try again.");
      } else if (/email not confirmed/i.test(error)) {
        toast.error("Please confirm your email before signing in.");
      } else {
        toast.error(error);
      }
      return;
    }
    toast.success("Welcome back!");
    navigate(from, { replace: true });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-secondary/30 py-24 px-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="size-4" /> Back to site
        </Link>
        <Card className="p-8 shadow-elegant">
          <div className="space-y-2 text-center mb-8">
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your stay</p>
          </div>

          {message && (
            <div className="mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="pl-10" disabled={busy} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="password" type="password" autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="pl-10" disabled={busy} />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
              {busy ? <><Loader2 className="size-4 animate-spin" /> Signing in…</> : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" state={{ from, message }} className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
};

export default SignIn;
