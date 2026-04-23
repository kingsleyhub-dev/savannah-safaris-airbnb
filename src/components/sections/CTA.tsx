import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export const CTA = () => {
  const { get } = useSiteContent();
  const g = (k: string, fb: string) => get("home", "cta", k, fb);
  return (
  <section className="section-padding overflow-hidden">
    <div className="container-luxe">
      <div className="relative overflow-hidden rounded-[2rem] gradient-forest px-5 py-8 text-center text-primary-foreground sm:px-8 sm:py-10 md:px-14 md:py-16 lg:px-20 lg:py-20">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl space-y-5 sm:space-y-6">
          <span className="eyebrow text-accent">— Ready when you are</span>
          <h2 className="font-display fluid-h2 font-bold text-balance">
            {g("title", "Ready to experience Nairobi at its finest?")}
          </h2>
          <p className="text-sm text-primary-foreground/85 sm:text-lg">
            {g("subtitle", "Reserve your dates today and enjoy our best-rate guarantee.")}
          </p>
          <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row sm:flex-wrap">
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