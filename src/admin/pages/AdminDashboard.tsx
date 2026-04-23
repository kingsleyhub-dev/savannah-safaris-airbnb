import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/admin/auth/AuthProvider";
import { FileText, Image as ImageIcon, Phone, Activity, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { user, roles, isAdmin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({ pages: 0, media: 0, recentEdits: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: pages }, { count: media }, { count: recentEdits }] = await Promise.all([
        supabase.from("pages").select("*", { count: "exact", head: true }),
        supabase.from("media_assets").select("*", { count: "exact", head: true }),
        supabase.from("audit_log").select("*", { count: "exact", head: true })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);
      setStats({ pages: pages ?? 0, media: media ?? 0, recentEdits: recentEdits ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Pages", value: stats.pages, icon: FileText, to: "/admin/dashboard/pages" },
    { label: "Media items", value: stats.media, icon: ImageIcon, to: "/admin/dashboard/media" },
    { label: "Edits (7d)", value: stats.recentEdits, icon: Activity, to: "/admin/dashboard" },
    { label: "Contact info", value: "Edit", icon: Phone, to: "/admin/dashboard/contact" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-1">Signed in as {user?.email}</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className={`size-12 rounded-xl grid place-items-center shrink-0 ${
            isSuperAdmin ? "bg-primary/10 text-primary"
            : isAdmin ? "bg-accent/20 text-accent-foreground"
            : "bg-destructive/10 text-destructive"
          }`}>
            {isSuperAdmin ? <ShieldCheck className="size-6" />
              : isAdmin ? <Shield className="size-6" />
              : <ShieldAlert className="size-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-display text-xl font-bold">Role verification</h2>
              <Badge variant={isAdmin ? "default" : "destructive"}>
                {isSuperAdmin ? "Super Admin Access" : isAdmin ? "Admin Access" : "No Admin Access"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              These are the roles currently assigned to your account in the database.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {roles.length > 0 ? (
                roles.map((r) => (
                  <Badge key={r} variant="secondary" className="capitalize">
                    {r.replace("_", " ")}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-muted-foreground">No roles assigned</Badge>
              )}
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${isSuperAdmin ? "bg-primary" : "bg-muted"}`} />
                <span className={isSuperAdmin ? "text-foreground" : "text-muted-foreground"}>
                  Super admin — manage user roles
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${isAdmin ? "bg-primary" : "bg-muted"}`} />
                <span className={isAdmin ? "text-foreground" : "text-muted-foreground"}>
                  Admin — edit content, media & settings
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="p-5 hover:shadow-elegant transition-smooth h-full">
              <Icon className="size-5 text-primary mb-3" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-display text-xl font-bold mb-2">Quick start</h2>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>Go to <Link to="/admin/dashboard/pages" className="text-primary underline">Pages</Link> to edit text on any section of the website.</li>
          <li>Use <Link to="/admin/dashboard/media" className="text-primary underline">Media Library</Link> to upload, replace, or delete images and videos.</li>
          <li>Update WhatsApp numbers and email in <Link to="/admin/dashboard/contact" className="text-primary underline">Contact</Link>.</li>
        </ul>
      </Card>
    </div>
  );
};

export default AdminDashboard;
