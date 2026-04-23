import { images } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export const ValueProp = () => {
  const { get } = useSiteContent();
  const g = (k: string, fb: string) => get("home", "value_prop", k, fb);
  return (
  <section className="section-padding">
    <div className="container-luxe grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="relative animate-fade-up">
        <div className="absolute -top-6 -left-6 size-32 rounded-full gradient-gold blur-3xl opacity-30" />
        <img src={images.living} alt="Elegant lounge" className="relative rounded-2xl shadow-elegant w-full aspect-[4/5] object-cover" loading="lazy" />
        <div className="absolute -bottom-4 right-4 hidden max-w-xs rounded-2xl border border-border bg-card p-5 shadow-elegant md:block lg:-bottom-8 lg:-right-8 lg:p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-10 rounded-full gradient-forest" />
            <div>
              <p className="text-sm font-semibold">Superhost</p>
              <p className="text-xs text-muted-foreground">5 years hosting</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">"Hospitality crafted around you. Every detail considered."</p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.15s" }}>
        <span className="eyebrow">{g("eyebrow", "— About the property")}</span>
        <h2 className="font-display text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
          {g("title", "A boutique escape where nature meets the city.")}
        </h2>
        <p className="text-base leading-relaxed whitespace-pre-line text-muted-foreground sm:text-lg">
          {g("body", "A stunning 2-bedroom luxury apartment with city views, ample security, free parking and high-speed Wi-Fi. Centrally located, with quick access to Nairobi City Centre and Nairobi National Park.")}
        </p>
        <ul className="grid grid-cols-1 gap-3 text-sm min-[420px]:grid-cols-2">
          {["2 Bedrooms", "2 Ensuite Bathrooms", "Modern Kitchen", "Dining for 6", "Sitting Lounge", "Up to 4 Guests"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-foreground/85">
              <span className="size-1.5 rounded-full bg-accent" /> {f}
            </li>
          ))}
        </ul>
        <Button asChild variant="default" size="lg">
          <Link to="/property">Discover the Stay <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    </div>
  </section>
  );
};