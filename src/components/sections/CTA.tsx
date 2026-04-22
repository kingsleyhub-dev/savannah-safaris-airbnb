import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => (
  <section className="section-padding">
    <div className="container-luxe">
      <div className="relative overflow-hidden rounded-3xl gradient-forest p-8 sm:p-10 md:p-20 text-primary-foreground text-center">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative space-y-6 max-w-2xl mx-auto">
          <span className="eyebrow text-accent">— Ready when you are</span>
          <h2 className="font-display fluid-h2 font-bold text-balance">
            Book direct. Stay in <span className="italic font-light text-accent">style.</span>
          </h2>
          <p className="text-base sm:text-lg text-primary-foreground/85">
            Best rates guaranteed. Instant confirmation. A premium Nairobi escape awaits.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button asChild variant="gold" size="xl">
              <Link to="/booking">Reserve Your Stay <ArrowRight className="size-4" /></Link>
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