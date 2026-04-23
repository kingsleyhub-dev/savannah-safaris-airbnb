import { PageHero } from "@/components/sections/PageHero";
import { images, nearbyPlaces } from "@/data/site";
import * as Icons from "lucide-react";
import { ShieldCheck, Car, Plane } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";

const reasons = [
  { icon: ShieldCheck, title: "Safe & secure", desc: "Gated compound, 24/7 manned security and CCTV." },
  { icon: Car, title: "Easy to navigate", desc: "Walkable streets, easy ride-share access, free parking on site." },
  { icon: Plane, title: "Great connectivity", desc: "35 min to JKIA, 10 min to CBD, 25 min to the National Park." },
];

const Location = () => {
  const { get } = useSiteContent();
  const h = (k: string, fb: string) => get("location", "hero", k, fb);
  const r = (k: string, fb: string) => get("location", "reasons", k, fb);
  return (
  <>
    <PageHero
      eyebrow={h("eyebrow", "Discover Nairobi")}
      title={h("title", "A prime address in Kilimani")}
      subtitle={h("subtitle", "At the meeting point of city energy and natural escape.")}
      image={resolveImage(h("image", ""), images.view)}
    />

    <section className="section-padding">
      <div className="container-luxe space-y-10 sm:space-y-12">
        <div className="overflow-hidden rounded-2xl border border-border shadow-elegant aspect-[4/3] sm:aspect-[16/9]">
          <iframe title="Map" src="https://www.google.com/maps?q=Kilimani,Nairobi&output=embed" width="100%" height="100%" loading="lazy" style={{ border: 0 }} />
        </div>

        <div>
          <h2 className="mb-8 text-center font-display text-3xl font-bold sm:mb-10 sm:text-4xl">Things to do nearby</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyPlaces.map((p) => {
              const Icon = (Icons as any)[p.icon] ?? Icons.MapPin;
              return (
                <div key={p.name} className="bg-card border border-border rounded-2xl p-6 hover:shadow-soft transition-smooth">
                  <div className="size-12 rounded-xl gradient-forest text-primary-foreground flex items-center justify-center mb-4">
                    <Icon className="size-5" />
                  </div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.distance} away</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="section-padding bg-secondary/40">
      <div className="container-luxe">
        <div className="text-center mb-12 space-y-3">
          <span className="eyebrow">{r("eyebrow", "— Why guests love it")}</span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{r("title", "Why guests love this location")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reasons.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="size-14 rounded-full gradient-gold mx-auto flex items-center justify-center mb-5">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
              <p className="text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <CTA />
  </>
  );
};

export default Location;