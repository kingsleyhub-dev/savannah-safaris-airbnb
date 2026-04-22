import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ShieldAlert, ArrowRight } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-secondary to-background p-4">
      <Card className="w-full max-w-md p-8 shadow-elegant">
        <div className="text-center mb-8 space-y-2">
          <div className="size-14 rounded-2xl gradient-forest text-primary-foreground grid place-items-center mx-auto">
            <Mail className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Enter your email to continue</p>
        </div>

        <form onSubmit={handleEnter} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Enter dashboard <ArrowRight className="size-4" />
          </Button>

          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <p>
              Authentication is disabled. Anyone with this URL can access the admin dashboard. Restore password sign-in for production use.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
