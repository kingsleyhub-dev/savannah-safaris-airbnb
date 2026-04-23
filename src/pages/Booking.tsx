import { useMemo, useState } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { images, property } from "@/data/site";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Tag, Users, Plane, Car, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";
import { useAuth } from "@/admin/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const addOns = [
  { id: "airport", label: "Airport pickup (JKIA)", price: 35, icon: Plane },
  { id: "joel", label: "Joel's Nissan + driver (per day)", price: 80, icon: Car },
  { id: "tour", label: "City tour with guide", price: 60, icon: MapPin },
];

const Booking = () => {
  const { get } = useSiteContent();
  const { user } = useAuth();
  const h = (k: string, fb: string) => get("booking", "hero", k, fb);
  const s = (k: string, fb: string) => get("booking", "summary", k, fb);
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  // Prefill guest details from the signed-in user's profile
  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data?.full_name) setFullName(data.full_name);
    })();
  }, [user]);

  const nights = useMemo(() => {
    if (!range?.from || !range?.to) return 0;
    return Math.max(0, Math.round((+range.to - +range.from) / 86400000));
  }, [range]);

  const subtotal = nights * property.pricePerNight;
  const addonTotal = selected.reduce((s, id) => s + (addOns.find((a) => a.id === id)?.price ?? 0), 0);
  const cleaning = nights > 0 ? 25 : 0;
  const discountAmt = Math.round(subtotal * (discount / 100));
  const total = subtotal + addonTotal + cleaning - discountAmt;

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === "SAVANNAH10") {
      setDiscount(10);
      toast.success("Promo applied — 10% off your stay");
    } else {
      setDiscount(0);
      toast.error("Invalid promo code");
    }
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nights === 0) return toast.error("Please select your dates");
    if (!user) return toast.error("Please sign in to confirm your booking");
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      return toast.error("Please fill in your name, email, and phone");
    }

    setSaving(true);
    // Persist the booking. RLS ensures user_id must match auth.uid().
    const { error } = await supabase.from("bookings").insert([{
      user_id: user.id,
      guest_name: fullName.trim(),
      guest_email: email.trim(),
      guest_phone: phone.trim(),
      guest_country: country.trim() || null,
      check_in: range!.from!.toISOString().slice(0, 10),
      check_out: range!.to!.toISOString().slice(0, 10),
      guests,
      nights,
      add_ons: selected.map((id) => addOns.find((a) => a.id === id)).filter(Boolean) as any,
      promo_code: promo.trim() || null,
      discount_percent: discount,
      subtotal_cents: subtotal * 100,
      cleaning_cents: cleaning * 100,
      addons_cents: addonTotal * 100,
      discount_cents: discountAmt * 100,
      total_cents: total * 100,
      status: "confirmed",
    }]);
    setSaving(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
    toast.success("Booking confirmed!");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <>
        <PageHero eyebrow="Confirmed" title="Your stay is reserved" image={resolveImage(h("image", ""), images.view)} />
        <section className="section-padding">
          <div className="container-luxe max-w-2xl text-center space-y-6">
            <div className="size-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-10" />
            </div>
            <h2 className="font-display text-3xl font-bold">Thank you!</h2>
            <p className="text-muted-foreground text-lg">
              Your reservation is saved. View it any time from <Link to="/my-bookings" className="text-primary underline">My Bookings</Link>.
            </p>
            <Card className="text-left p-6 space-y-2">
              <p><span className="text-muted-foreground">Dates:</span> {range?.from?.toLocaleDateString()} – {range?.to?.toLocaleDateString()}</p>
              <p><span className="text-muted-foreground">Guests:</span> {guests}</p>
              <p><span className="text-muted-foreground">Total:</span> ${total}</p>
            </Card>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild variant="hero" size="lg"><Link to="/my-bookings">View my bookings</Link></Button>
              <Button onClick={() => { setSubmitted(false); setRange(undefined); }} variant="outline" size="lg">
                Make another booking
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={h("eyebrow", "Book direct")}
        title={h("title", "Reserve your stay")}
        subtitle={h("subtitle", "Best-rate guarantee · Instant confirmation")}
        image={resolveImage(h("image", ""), images.view)}
      />

      <section className="section-padding">
        <div className="container-luxe grid lg:grid-cols-3 gap-8">
          <form onSubmit={confirm} className="lg:col-span-2 space-y-8">
            <Card className="p-6 md:p-8 space-y-6">
              <h3 className="font-display text-2xl font-bold">1. Choose your dates</h3>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
                  disabled={{ before: new Date() }}
                  className="mx-auto"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Users className="size-4" /> Guests</Label>
                  <Input type="number" min={1} max={property.guests} value={guests} onChange={(e) => setGuests(+e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Tag className="size-4" /> Promo code</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Try SAVANNAH10" value={promo} onChange={(e) => setPromo(e.target.value)} />
                    <Button type="button" variant="outline" onClick={applyPromo}>Apply</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8 space-y-6">
              <h3 className="font-display text-2xl font-bold">2. Add extras</h3>
              <div className="space-y-3">
                {addOns.map((a) => {
                  const Icon = a.icon;
                  const checked = selected.includes(a.id);
                  return (
                    <label key={a.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-smooth ${checked ? "border-primary bg-secondary/40" : "border-border hover:border-primary/40"}`}>
                      <Checkbox checked={checked} onCheckedChange={(v) => setSelected((s) => v ? [...s, a.id] : s.filter((x) => x !== a.id))} />
                      <Icon className="size-5 text-primary" />
                      <span className="flex-1 font-medium">{a.label}</span>
                      <span className="text-primary font-semibold">+${a.price}</span>
                    </label>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 md:p-8 space-y-6">
              <h3 className="font-display text-2xl font-bold">3. Your details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full name</Label><Input required placeholder="Jane Doe" /></div>
                <div className="space-y-2"><Label>Email</Label><Input required type="email" placeholder="jane@example.com" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input required type="tel" placeholder="+254..." /></div>
                <div className="space-y-2"><Label>Country</Label><Input placeholder="United Kingdom" /></div>
              </div>
            </Card>
          </form>

          <aside className="lg:sticky lg:top-28 self-start">
            <Card className="overflow-hidden shadow-elegant">
              <img src={resolveImage(s("image", ""), images.bedroom)} alt="" className="w-full aspect-[4/3] object-cover" />
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-display text-xl font-bold">{property.name}</h4>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                </div>
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between"><span>${property.pricePerNight} × {nights || 0} nights</span><span>${subtotal}</span></div>
                  <div className="flex justify-between"><span>Cleaning fee</span><span>${cleaning}</span></div>
                  {addonTotal > 0 && <div className="flex justify-between"><span>Add-ons</span><span>${addonTotal}</span></div>}
                  {discountAmt > 0 && <div className="flex justify-between text-primary"><span>Promo ({discount}%)</span><span>-${discountAmt}</span></div>}
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-border pt-4">
                  <span>Total</span><span>${total}</span>
                </div>
                <Button onClick={confirm as any} variant="hero" size="lg" className="w-full">
                  Confirm Booking
                </Button>
                <p className="text-xs text-muted-foreground text-center">Secure checkout · 30% deposit option available</p>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Booking;