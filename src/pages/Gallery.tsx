import { PageHero } from "@/components/sections/PageHero";
import { images } from "@/data/site";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";

type Item = { src: string; cat: string; alt: string };
const allDefaults: Item[] = [
  { src: images.bedroom, cat: "Bedrooms", alt: "Master bedroom" },
  { src: images.bedroom2, cat: "Bedrooms", alt: "Second bedroom" },
  { src: images.living, cat: "Living Room", alt: "Sitting lounge" },
  { src: images.dining, cat: "Dining Area", alt: "Dining" },
  { src: images.kitchen, cat: "Kitchen", alt: "Kitchen" },
  { src: images.bathroom, cat: "Bathrooms", alt: "Bathroom" },
  { src: images.view, cat: "Views", alt: "City view" },
  { src: images.hero, cat: "Exterior", alt: "Balcony" },
  { src: images.bedroom, cat: "Bedrooms", alt: "Bedroom detail" },
  { src: images.living, cat: "Living Room", alt: "Lounge detail" },
  { src: images.kitchen, cat: "Kitchen", alt: "Kitchen detail" },
  { src: images.view, cat: "Views", alt: "Sunset" },
];
const cats = ["All", ...Array.from(new Set(allDefaults.map((i) => i.cat)))];

const Gallery = () => {
  const { get } = useSiteContent();
  const h = (k: string, fb: string) => get("gallery", "hero", k, fb);
  const all: Item[] = allDefaults.map((d, i) => ({
    ...d,
    src: resolveImage(get("gallery", "grid", `image${i + 1}`, ""), d.src),
  }));
  const [active, setActive] = useState("All");
  const [open, setOpen] = useState<string | null>(null);
  const filtered = active === "All" ? all : all.filter((i) => i.cat === active);

  return (
    <>
      <PageHero
        eyebrow={h("eyebrow", "Gallery")}
        title={h("title", "Inside a Nairobi sanctuary")}
        subtitle={h("subtitle", "Soft light, refined details, and city views from every angle.")}
        image={resolveImage(h("image", ""), images.hero)}
      />

      <section className="section-padding">
        <div className="container-luxe">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-smooth ${
                  active === c ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/80 hover:bg-secondary/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <button
                key={i}
                onClick={() => setOpen(img.src)}
                className="block w-full overflow-hidden rounded-2xl group break-inside-avoid"
              >
                <img src={img.src} alt={img.alt} loading="lazy" className="w-full transition-elegant group-hover:scale-105" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0 shadow-none">
          {open && <img src={open} alt="" className="w-full rounded-2xl" />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;