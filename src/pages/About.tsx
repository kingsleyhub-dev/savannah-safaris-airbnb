import { PageHero } from "@/components/sections/PageHero";
import { images } from "@/data/site";
import { CTA } from "@/components/sections/CTA";
import { Heart, Sparkles, Award } from "lucide-react";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";

const values = [
  { icon: Heart, title: "Hospitality first", desc: "We host as we'd want to be hosted — warmly, attentively, generously." },
  { icon: Sparkles, title: "Quietly luxurious", desc: "Premium materials and thoughtful design without ostentation." },
  { icon: Award, title: "Trust by design", desc: "Verified, secure, and Superhost-rated by guests around the world." },
];

const About = () => {
  const { get } = useSiteContent();
  const h = (k: string, fb: string) => get("about", "hero", k, fb);
  const p = (k: string, fb: string) => get("about", "promise", k, fb);
  const v = (k: string, fb: string) => get("about", "values", k, fb);
  return (
  <>
    <PageHero
      eyebrow={h("eyebrow", "Our story")}
      title={h("title", "Where safari elegance meets the city")}
      image={resolveImage(h("image", ""), images.living)}
    />

    <section className="section-padding">
      <div className="container-luxe grid lg:grid-cols-2 gap-12 items-center">
        <img src={resolveImage(p("image", ""), images.dining)} alt="" loading="lazy" className="rounded-2xl shadow-elegant w-full aspect-[4/5] object-cover" />
        <div className="space-y-6">
          <span className="eyebrow">{p("eyebrow", "— Our promise")}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-balance">
            {p("title", "A boutique stay built around you.")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
            {p("body1", "Savannah Safaris Airbnb was born from a simple idea: travellers to Nairobi deserve more than a generic hotel room. We curated this 2-bedroom residence to feel like a private home — calm, secure, and undeniably elegant.")}
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
            {p("body2", "From the moment you book, our team is here to make every detail effortless: airport pickups, local guidance, and a chauffeured Nissan when you need to roam. Direct booking, transparent pricing, real human care.")}
          </p>
        </div>
      </div>
    </section>

    <section className="section-padding bg-secondary/40">
      <div className="container-luxe">
        <div className="text-center mb-12 space-y-3">
          <span className="eyebrow">{v("eyebrow", "— Values")}</span>
          <h2 className="font-display text-4xl font-bold">{v("title", "What we stand for")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-8">
              <div className="size-12 rounded-xl gradient-forest text-primary-foreground flex items-center justify-center mb-4">
                <Icon className="size-5" />
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

export default About;