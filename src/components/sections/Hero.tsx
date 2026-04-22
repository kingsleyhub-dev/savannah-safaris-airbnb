import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { images } from "@/data/site";

export const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={images.hero} alt="Luxury Nairobi apartment with city view" className="w-full h-full object-cover animate-ken-burns" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
    </div>

    <div className="relative container-luxe pt-28 sm:pt-32 pb-16 sm:pb-20 text-primary-foreground w-full">
      <div className="max-w-3xl space-y-6 sm:space-y-8 animate-fade-up">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em]">
          <span className="size-1.5 rounded-full bg-accent animate-pulse" />
          Now Booking · Kilimani, Nairobi
        </span>

        <h1 className="font-display font-bold fluid-h1 text-balance">
          Exclusive 2-Bedroom <span className="italic font-light text-accent">luxury stay</span> in the heart of Nairobi
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
          City views, comfort, security and seamless direct booking. Minutes from Nairobi City Centre and the National Park.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild variant="gold" size="xl">
            <Link to="/booking">Book Now <ArrowRight className="size-4" /></Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/property">View Rooms</Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/services">Explore Amenities</Link>
          </Button>
        </div>

        <div className="flex items-center gap-6 pt-6 text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="size-4 fill-accent text-accent" />)}
            <span className="ml-2 font-medium">4.96</span>
          </div>
          <span className="text-primary-foreground/70">200+ verified guest reviews</span>
        </div>
      </div>
    </div>

    <div className="absolute bottom-8 inset-x-0 flex justify-center animate-fade-in" style={{ animationDelay: "1s" }}>
      <div className="flex flex-col items-center gap-2 text-primary-foreground/70 text-xs uppercase tracking-[0.3em]">
        <span>Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-primary-foreground/70 to-transparent" />
      </div>
    </div>
  </section>
);