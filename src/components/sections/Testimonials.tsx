import { Star, Quote } from "lucide-react";
import { testimonials } from "@/data/site";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Testimonials = () => {
  const { get } = useSiteContent();
  const g = (k: string, fb: string) => get("home", "testimonials", k, fb);
  return (
  <section className="section-padding gradient-soft">
    <div className="container-luxe">
      <div className="mx-auto mb-10 max-w-2xl space-y-4 text-center sm:mb-12">
        <span className="eyebrow">{g("eyebrow", "— Reviews")}</span>
        <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{g("title", "Loved by guests worldwide")}</h2>
      </div>

      <Carousel opts={{ loop: true, align: "start" }} className="max-w-5xl mx-auto">
        <CarouselContent>
          {testimonials.map((t) => (
            <CarouselItem key={t.name} className="md:basis-1/2">
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
                <Quote className="size-8 text-accent" />
                <p className="text-base italic leading-relaxed text-foreground/90 sm:text-lg">"{t.quote}"</p>
                <div className="flex items-center gap-1 mt-auto">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="size-4 fill-accent text-accent" />)}
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  </section>
  );
};