import { Link } from "react-router-dom";
import { images } from "@/data/site";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

const tiles = [
  { src: images.bedroom, label: "Bedroom Suite", className: "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2" },
  { src: images.kitchen, label: "Kitchen" },
  { src: images.dining, label: "Dining" },
  { src: images.view, label: "City View" },
  { src: images.bathroom, label: "Bath" },
];

export const GalleryPreview = () => {
  const { get } = useSiteContent();
  const g = (k: string, fb: string) => get("home", "gallery_preview", k, fb);
  return (
  <section className="section-padding">
    <div className="container-luxe">
      <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
        <div className="max-w-xl space-y-3">
          <span className="eyebrow">{g("eyebrow", "— Gallery")}</span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">{g("title", "A look inside")}</h2>
        </div>
        <Link to="/gallery" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-smooth">
          {g("cta", "View full gallery")} <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 auto-rows-[220px] sm:grid-cols-2 sm:gap-4 sm:auto-rows-[180px] lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-fr lg:min-h-[36rem]">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${t.className ?? ""}`}
          >
            <img src={t.src} alt={t.label} loading="lazy" className="w-full h-full object-cover transition-elegant group-hover:scale-110" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 via-transparent to-transparent p-4 opacity-100 transition-smooth group-hover:opacity-100 sm:p-6 lg:opacity-0">
              <span className="text-lg font-display text-primary-foreground sm:text-xl">{t.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};