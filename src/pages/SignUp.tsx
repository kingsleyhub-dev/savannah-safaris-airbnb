import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/admin/auth/AuthProvider";

// Validation rules — keep server & client in sync via shared schema
const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/booking";
  const message = (location.state as { message?: string } | null)?.message;

  useEffect(() => {
    if (!loading && user) navigate(from, { replace: true });
  }, [loading, user, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({ fullName, email, password });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);

    setBusy(true);
    // Sign up with email + password. Auto-confirm is enabled, so the
    // session is created immediately and onAuthStateChange picks it up.
    // emailRedirectTo is still required for any future email confirmations.
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: parsed.data.fullName },
      },
    });
    setBusy(false);

    if (error) {
      if (/already registered|user already/i.test(error.message)) {
        toast.error("An account with this email already exists. Try signing in.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    if (data.session) {
      // Auto-confirmed — user is signed in
      toast.success("Account created! Welcome.");
      navigate(from, { replace: true });
    } else {
      // Confirmation email required
      toast.success("Check your email to confirm your account.");
      navigate("/signin", { state: { from, message } });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-secondary/30 py-24 px-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="size-4" /> Back to site
        </Link>
        <Card className="p-8 shadow-elegant">
          <div className="space-y-2 text-center mb-8">
            <h1 className="font-display text-3xl font-bold">Create account</h1>
            <p className="text-sm text-muted-foreground">Join to book your perfect stay</p>
          </div>

          {message && (
            <div className="mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe" className="pl-10" disabled={busy} />
              </div>
            </div>
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
                <Input id="password" type="password" autoComplete="new-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters" className="pl-10" disabled={busy} />
              </div>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
              {busy ? <><Loader2 className="size-4 animate-spin" /> Creating account…</> : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/signin" state={{ from, message }} className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
};

export default SignUp;
