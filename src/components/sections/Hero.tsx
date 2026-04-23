import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { images } from "@/data/site";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";
import homeHeroLogo from "@/assets/home-hero-logo-transparent.png";

export const Hero = () => {
  const { get } = useSiteContent();
  const g = (k: string, fb: string) => get("home", "hero", k, fb);
  const heroImage = resolveImage(g("image", ""), images.hero);
  return (
  <section className="relative flex min-h-screen items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroImage} alt="Luxury Nairobi apartment with city view" className="w-full h-full object-cover animate-ken-burns" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
    </div>

    {/* Centered hero column */}
    <div className="relative container-luxe w-full pb-16 pt-24 text-primary-foreground sm:pb-20 sm:pt-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-5 text-center sm:space-y-7">
        {/* Animated logo centerpiece — fixed size, gentle ambient float (no zoom/scale) */}
        <div className="hero-logo-wrap animate-hero-logo-in -mb-3 w-full flex justify-center">
          <img
            src={homeHeroLogo}
            alt="Savannah Safaris"
            className="hero-logo-float h-52 w-auto max-w-full object-contain select-none drop-shadow-[0_14px_36px_rgba(0,0,0,0.6)] sm:h-64 md:h-80 lg:h-[24rem]"
            draggable={false}
          />
        </div>

        <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.18em] backdrop-blur-md animate-fade-up [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards] sm:px-4 sm:text-xs sm:tracking-[0.25em]">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          {g("badge_text", "Now Booking · Kilimani, Nairobi")}
        </span>

        <h1 className="font-display font-bold fluid-h1 text-balance animate-fade-up [animation-delay:400ms] opacity-0 [animation-fill-mode:forwards]">
          {g("title_part1", "Exclusive 2-Bedroom")} <span className="italic font-light text-accent">{g("title_emphasis", "luxury stay")}</span> {g("title_part2", "in the heart of Nairobi")}
        </h1>

        <p className="max-w-2xl px-2 text-sm leading-relaxed text-primary-foreground/85 animate-fade-up [animation-delay:600ms] opacity-0 [animation-fill-mode:forwards] sm:px-0 sm:text-lg md:text-xl">
          {g("subtitle", "City views, comfort, security and seamless direct booking. Minutes from Nairobi City Centre and the National Park.")}
        </p>

        <div className="flex w-full flex-col justify-center gap-3 pt-2 animate-fade-up [animation-delay:800ms] opacity-0 [animation-fill-mode:forwards] sm:w-auto sm:flex-row sm:flex-wrap">
          <Button asChild variant="gold" size="xl">
            <Link to="/booking">{g("cta_book", "Book Now")} <ArrowRight className="size-4" /></Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/property">{g("cta_rooms", "View Rooms")}</Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/services">{g("cta_amenities", "Explore Amenities")}</Link>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-6 text-center text-sm animate-fade-up [animation-delay:1000ms] opacity-0 [animation-fill-mode:forwards] sm:flex-row sm:gap-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-accent text-accent" />)}
            <span className="ml-2 font-medium">{g("rating", "4.96")}</span>
          </div>
          <span className="text-primary-foreground/70">{g("reviews_text", "200+ verified guest reviews")}</span>
        </div>
      </div>
    </div>

    <div className="absolute inset-x-0 bottom-6 hidden justify-center animate-fade-in sm:flex" style={{ animationDelay: "1s" }}>
      <div className="flex flex-col items-center gap-2 text-primary-foreground/70 text-xs uppercase tracking-[0.3em]">
        <span>Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary-foreground/70 to-transparent" />
      </div>
    </div>
  </section>
  );
};