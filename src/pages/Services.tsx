import { PageHero } from "@/components/sections/PageHero";
import { images } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plane, Car, MapPin, UserCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { CTA } from "@/components/sections/CTA";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";

const services = [
  { icon: Plane, title: "Airport Transfer", desc: "Reliable JKIA pickup & drop-off in a clean, comfortable vehicle.", price: "from $35" },
  { icon: Car, title: "Car Rental", desc: "Self-drive options curated for the city or upcountry adventures.", price: "from $50/day" },
  { icon: MapPin, title: "City Recommendations", desc: "Concierge tips for dining, safari and attractions.", price: "Complimentary" },
  { icon: UserCheck, title: "Driver-on-Demand", desc: "Need a chauffeur for the day? We've got you.", price: "from $80/day" },
];

const Services = () => {
  const { get } = useSiteContent();
  const h = (k: string, fb: string) => get("services", "hero", k, fb);
  const f = (k: string, fb: string) => get("services", "featured", k, fb);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request received — Joel will be in touch within the hour.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <PageHero
        eyebrow={h("eyebrow", "Add-on services")}
        title={h("title", "Premium convenience, on request")}
        subtitle={h("subtitle", "From airport pickups to chauffeured city tours — we make travel effortless.")}
        image={resolveImage(h("image", ""), images.nissan)}
      />

      <section className="section-padding">
        <div className="container-luxe grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <Card key={s.title} className="p-6 hover:shadow-elegant transition-smooth group">
              <div className="size-12 rounded-xl gradient-forest text-primary-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <s.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.desc}</p>
              <p className="text-primary font-medium text-sm">{s.price}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding bg-secondary/40">
        <div className="container-luxe grid lg:grid-cols-2 gap-12 items-center">
          <div className="overflow-hidden rounded-2xl shadow-elegant">
            <img src={resolveImage(f("image", ""), images.nissan)} alt="Joel's Nissan with driver" className="w-full aspect-[4/3] object-cover" />
          </div>
          <div className="space-y-6">
            <span className="eyebrow">— Featured service</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
              {f("title", "Joel's Nissan with driver")}
            </h2>
            <p className="text-muted-foreground text-lg whitespace-pre-line">
              {f("body", "A premium chauffeured experience for guests who want to explore Nairobi or travel further afield in comfort and style. Joel is friendly, punctual, and knows the city inside out.")}
            </p>
            <div className="flex flex-wrap gap-2">
              {["City Trips", "Long Distance Travel", "Airport Pickup", "Safari Day Trips", "Hourly Hire"].map((tag) => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-card border border-border text-xs font-medium">{tag}</span>
              ))}
            </div>

            <Card className="p-6 mt-6">
              <h3 className="font-display text-xl font-bold mb-4">Request Joel's Nissan</h3>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Name</Label><Input required placeholder="Your name" /></div>
                  <div className="space-y-2"><Label>Phone / WhatsApp</Label><Input required placeholder="+254..." /></div>
                  <div className="space-y-2"><Label>Pickup date</Label><Input required type="date" /></div>
                  <div className="space-y-2"><Label>Trip type</Label>
                    <select className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm">
                      <option>City trip</option>
                      <option>Long distance</option>
                      <option>Airport pickup</option>
                      <option>Full day hire</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Notes</Label><Textarea placeholder="Where are you headed? Any special requests?" rows={3} /></div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Request Booking <ArrowRight className="size-4" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default Services;