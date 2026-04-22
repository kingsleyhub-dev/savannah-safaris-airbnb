import * as Icons from "lucide-react";
import { nearbyPlaces } from "@/data/site";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const LocationPreview = () => (
  <section className="section-padding">
    <div className="container-luxe grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <span className="eyebrow">— Location</span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-balance">Centrally placed, perfectly connected</h2>
        <p className="text-muted-foreground text-lg">
          Nestled in upscale Kilimani, you're minutes from the city's best dining, shopping and the gateway to Nairobi National Park.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {nearbyPlaces.map((p) => {
            const Icon = (Icons as any)[p.icon] ?? Icons.MapPin;
            return (
              <div key={p.name} className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:shadow-soft transition-smooth">
                <div className="size-10 rounded-lg bg-secondary text-primary flex items-center justify-center">
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.distance}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Link to="/location" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-smooth">
          Discover Nairobi <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-elegant aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[600px] border border-border">
        <iframe
          title="Property location"
          src="https://www.google.com/maps?q=Kilimani,Nairobi&output=embed"
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </section>
);