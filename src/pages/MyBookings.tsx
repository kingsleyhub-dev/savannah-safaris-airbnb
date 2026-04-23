import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/admin/auth/AuthProvider";
import { PageHero } from "@/components/sections/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Loader2, MapPin } from "lucide-react";
import { images, property } from "@/data/site";
import { toast } from "sonner";

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  nights: number;
  guests: number;
  total_cents: number;
  status: string;
  created_at: string;
  guest_name: string;
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // RLS automatically scopes to this user's bookings only
      const { data, error } = await supabase
        .from("bookings")
        .select("id, check_in, check_out, nights, guests, total_cents, status, created_at, guest_name")
        .order("check_in", { ascending: false });
      if (error) toast.error("Could not load bookings");
      setBookings(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
    toast.success("Booking cancelled");
  };

  return (
    <>
      <PageHero eyebrow="Your stays" title="My Bookings" subtitle="Manage your reservations" image={images.view} />
      <section className="section-padding">
        <div className="container-luxe max-w-4xl space-y-6">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
          ) : bookings.length === 0 ? (
            <Card className="p-12 text-center space-y-4">
              <h3 className="font-display text-2xl font-bold">No bookings yet</h3>
              <p className="text-muted-foreground">Ready to plan your next stay?</p>
              <Button asChild variant="hero" size="lg"><Link to="/booking">Book Now</Link></Button>
            </Card>
          ) : (
            bookings.map((b) => (
              <Card key={b.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                <img src={images.bedroom} alt="" className="w-full md:w-48 aspect-[4/3] object-cover rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-display text-xl font-bold">{property.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="size-3.5" /> {property.location}</p>
                    </div>
                    <Badge variant={b.status === "cancelled" ? "destructive" : "default"} className="capitalize">
                      {b.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" />{fmtDate(b.check_in)} → {fmtDate(b.check_out)}</span>
                    <span className="flex items-center gap-2"><Users className="size-4 text-primary" />{b.guests} guests · {b.nights} nights</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-lg font-bold">${(b.total_cents / 100).toFixed(0)}</span>
                    {b.status !== "cancelled" && new Date(b.check_in) > new Date() && (
                      <Button variant="outline" size="sm" onClick={() => cancelBooking(b.id)}>Cancel</Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default MyBookings;
