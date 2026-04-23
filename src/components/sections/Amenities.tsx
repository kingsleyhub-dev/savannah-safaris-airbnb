import * as Icons from "lucide-react";
import { amenities } from "@/data/site";

export const Amenities = () => (
  <section className="section-padding bg-secondary/40">
    <div className="container-luxe">
      <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center sm:mb-16">
        <span className="eyebrow">— Amenities</span>
        <h2 className="font-display text-3xl font-bold text-balance sm:text-4xl lg:text-5xl">Every comfort, considered</h2>
        <p className="text-base text-muted-foreground sm:text-lg">Thoughtfully equipped to feel like a private residence — only better.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {amenities.map((a, i) => {
          const Icon = (Icons as any)[a.icon] ?? Icons.Sparkles;
          return (
            <div
              key={a.label}
              className="group rounded-2xl border border-border bg-card p-5 transition-smooth hover:border-primary/30 hover:shadow-elegant animate-fade-up sm:p-6"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="size-12 rounded-xl gradient-forest text-primary-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-base mb-1">{a.label}</h3>
              <p className="text-xs text-muted-foreground">{a.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);