import { images } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Plane, MapPin, Phone } from "lucide-react";

const services = [
  { icon: Plane, title: "Airport Transfers", desc: "Seamless pickup from JKIA, on time, every time." },
  { icon: Car, title: "Car Rentals", desc: "Curated fleet for self-drive or chauffeured rides." },
  { icon: MapPin, title: "City Recommendations", desc: "Hand-picked dining, safari and shopping picks." },
];

export const ServicesPreview = () => (
  <section className="relative overflow-hidden bg-foreground text-primary-foreground section-padding">
    <div className="absolute inset-0 opacity-20">
      <img src={images.nissan} alt="" className="w-full h-full object-cover" />
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/40" />

    <div className="container-luxe relative">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-6">
          <span className="eyebrow text-accent">— Premium add-ons</span>
          <h2 className="font-display text-3xl font-bold text-balance sm:text-4xl lg:text-5xl">
            Travel like royalty with <span className="italic font-light text-accent">Joel's Nissan</span>
          </h2>
          <p className="text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Need a driver for city trips or long-distance travel? Request Joel's Nissan — a premium chauffeured ride for total convenience and comfort.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Driver-on-demand", "City Trips", "Long Distance", "Airport Pickup"].map((tag) => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <Link to="/services">Request Joel's Nissan</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/services">All Services</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-smooth">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center text-primary shrink-0">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{title}</h3>
                  <p className="text-sm text-primary-foreground/70">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);