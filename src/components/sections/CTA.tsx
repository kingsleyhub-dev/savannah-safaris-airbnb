import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export const CTA = () => {
  const { get } = useSiteContent();
  const g = (k: string, fb: string) => get("home", "cta", k, fb);
  return (
  <section className="section-padding">
    <div className="container-luxe">
      <div className="relative overflow-hidden rounded-3xl gradient-forest p-8 sm:p-10 md:p-20 text-primary-foreground text-center">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative space-y-6 max-w-2xl mx-auto">
          <span className="eyebrow text-accent">— Ready when you are</span>
          <h2 className="font-display fluid-h2 font-bold text-balance">
            {g("title", "Ready to experience Nairobi at its finest?")}
          </h2>
          <p className="text-base sm:text-lg text-primary-foreground/85">
            {g("subtitle", "Reserve your dates today and enjoy our best-rate guarantee.")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button asChild variant="gold" size="xl">
              <Link to="/booking">{g("button_text", "Book Your Stay")} <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};