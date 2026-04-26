import { PageHero } from "@/components/sections/PageHero";
import { images } from "@/data/site";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type Item = { src: string; cat: string; alt: string };
type MediaAsset = { id: string; public_url: string; kind: "image" | "video"; filename: string; alt_text: string | null; gallery_category: string | null };

// Each entry maps a category section to its default photos. The section slug
// (e.g. "bedrooms") + key (e.g. "image1") is what admins edit in the portal.
const categoryDefaults: { cat: string; slug: string; items: { key: string; src: string; alt: string }[] }[] = [
  { cat: "Bedrooms", slug: "bedrooms", items: [
    { key: "image1", src: images.bedroom, alt: "Master bedroom" },
    { key: "image2", src: images.bedroom2, alt: "Second bedroom" },
    { key: "image3", src: images.bedroom2Alt1, alt: "Second bedroom — wide view" },
    { key: "image4", src: images.bedroom2Alt2, alt: "Second bedroom — headboard detail" },
    { key: "image5", src: images.bedroomAlt1, alt: "Bedroom — wider view" },
    { key: "image6", src: images.bedroomAlt2, alt: "Bedroom — detail" },
  ]},
  { cat: "Living Room", slug: "living-room", items: [
    { key: "image1", src: images.living, alt: "Sitting lounge" },
    { key: "image2", src: images.living2, alt: "Lounge — wide view" },
  ]},
  { cat: "Dining Area", slug: "dining-area", items: [
    { key: "image1", src: images.dining, alt: "Dining" },
    { key: "image2", src: images.dining2, alt: "Dining — chandelier view" },
    { key: "image3", src: images.dining3, alt: "Dining — side view" },
  ]},
  { cat: "Kitchen", slug: "kitchen", items: [
    { key: "image1", src: images.kitchen, alt: "Kitchen" },
    { key: "image2", src: images.kitchen2, alt: "Kitchen — counter view" },
    { key: "image3", src: images.kitchen3, alt: "Kitchen — wide view" },
  ]},
  { cat: "Bathrooms", slug: "bathrooms", items: [
    { key: "image1", src: images.bathroom, alt: "Master bathroom" },
    { key: "image2", src: images.bathroomAlt1, alt: "Second bathroom" },
    { key: "image3", src: images.bathroomAlt2, alt: "Bathroom — vanity detail" },
  ]},
  { cat: "Views", slug: "views", items: [
    { key: "image1", src: images.view, alt: "City view" },
  ]},
  { cat: "Exterior", slug: "exterior", items: [
    { key: "image1", src: images.hero, alt: "Balcony" },
  ]},
];

const baseCats = ["All", ...categoryDefaults.map((c) => c.cat)];

const Gallery = () => {
  const { get } = useSiteContent();
  const h = (k: string, fb: string) => get("gallery", "hero", k, fb);
  const all: Item[] = categoryDefaults.flatMap((cat) =>
    cat.items.map((item) => ({
      cat: cat.cat,
      alt: get("gallery", cat.slug, `${item.key}_alt`, item.alt),
      src: resolveImage(get("gallery", cat.slug, item.key, ""), item.src),
    }))
  );
  const [active, setActive] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [publishedMedia, setPublishedMedia] = useState<MediaAsset[]>([]);
  const publishedPhotos = publishedMedia.filter((item) => item.kind === "image");
  const publishedVideos = publishedMedia.filter((item) => item.kind === "video");
  const cats = ["All", ...Array.from(new Set([...baseCats.slice(1), ...publishedPhotos.map((item) => item.gallery_category).filter(Boolean) as string[]]))];
  const photoItems = [
    ...all,
    ...publishedPhotos.map((item) => ({ src: item.public_url, cat: item.gallery_category ?? "Uploaded", alt: item.alt_text ?? item.filename })),
  ];
  const filtered = active === "All" ? photoItems : photoItems.filter((i) => i.cat === active);

  useEffect(() => {
    (supabase.from("media_assets") as any).select("id, public_url, kind, filename, alt_text, gallery_category").eq("show_in_gallery", true).eq("is_published", true).order("gallery_sort_order", { ascending: true }).order("created_at", { ascending: false }).then(({ data }: { data: MediaAsset[] | null }) => {
      setPublishedMedia((data as MediaAsset[]) ?? []);
    });
  }, []);

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
          <Tabs defaultValue="photos" className="space-y-10">
            <TabsList className="mx-auto flex w-fit">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="space-y-10">
              <div className="flex flex-wrap gap-2 justify-center">
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
                    key={`${img.src}-${i}`}
                    onClick={() => setOpenIndex(i)}
                    className="block w-full overflow-hidden rounded-2xl group break-inside-avoid"
                  >
                    <img src={img.src} alt={img.alt} loading="lazy" className="w-full transition-elegant group-hover:scale-105" />
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              {publishedVideos.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">No published videos yet.</p>
              ) : (
                <Carousel opts={{ align: "start" }} className="mx-auto max-w-5xl">
                  <CarouselContent>
                  {publishedVideos.map((video) => (
                    <CarouselItem key={video.id} className="sm:basis-1/2 lg:basis-1/3">
                      <video src={video.public_url} controls preload="metadata" className="aspect-video w-full rounded-2xl bg-secondary object-cover" />
                    </CarouselItem>
                  ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={openIndex !== null} onOpenChange={() => setOpenIndex(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0 shadow-none">
          {openIndex !== null && (
            <Carousel opts={{ startIndex: openIndex, loop: true }} className="w-full">
              <CarouselContent>
                {filtered.map((img, i) => (
                  <CarouselItem key={`${img.src}-modal-${i}`}>
                    <img src={img.src} alt={img.alt} className="max-h-[85vh] w-full rounded-2xl object-contain" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;