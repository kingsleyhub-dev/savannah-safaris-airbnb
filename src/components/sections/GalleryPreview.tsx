import { Link } from "react-router-dom";
import { images } from "@/data/site";
import { ArrowRight } from "lucide-react";

const tiles = [
  { src: images.bedroom, label: "Bedroom Suite", className: "lg:col-span-2 lg:row-span-2" },
  { src: images.kitchen, label: "Kitchen" },
  { src: images.dining, label: "Dining" },
  { src: images.view, label: "City View" },
  { src: images.bathroom, label: "Bath" },
];

export const GalleryPreview = () => (
  <section className="section-padding">
    <div className="container-luxe">
      <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
        <div className="space-y-3 max-w-xl">
          <span className="eyebrow">— Gallery</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">A look inside</h2>
        </div>
        <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-smooth">
          View full gallery <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[180px] lg:auto-rows-auto lg:h-[600px]">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${t.className ?? ""}`}
          >
            <img src={t.src} alt={t.label} loading="lazy" className="w-full h-full object-cover transition-elegant group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
              <span className="text-primary-foreground font-display text-xl">{t.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);