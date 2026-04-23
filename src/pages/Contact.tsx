import { PageHero } from "@/components/sections/PageHero";
import { images } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { FAQ } from "@/components/sections/FAQ";
import { useContactInfo, toWaNumber } from "@/hooks/useContactInfo";
import { useSiteContent, resolveImage } from "@/hooks/useSiteContent";

const Contact = () => {
  const contact = useContactInfo();
  const { get } = useSiteContent();
  const h = (k: string, fb: string) => get("contact", "hero", k, fb);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent. We'll reply within 2 hours.");
    (e.target as HTMLFormElement).reset();
  };

  const waPrimary = toWaNumber(contact.whatsapp_primary.number);
  const waSecondary = toWaNumber(contact.whatsapp_secondary.number);

  return (
    <>
      <PageHero
        eyebrow={h("eyebrow", "Contact")}
        title={h("title", "We'd love to host you")}
        subtitle={h("subtitle", "Send a message, ring us, or chat on WhatsApp.")}
        image={resolveImage(h("image", ""), images.living)}
      />

      <section className="section-padding">
        <div className="container-luxe grid lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { icon: Phone, label: contact.whatsapp_primary.label, val: contact.whatsapp_primary.number, href: `tel:${waPrimary}` },
              { icon: Phone, label: contact.whatsapp_secondary.label, val: contact.whatsapp_secondary.number, href: `tel:${waSecondary}` },
              { icon: MessageCircle, label: "WhatsApp", val: "Quick reply", href: `https://wa.me/${waPrimary}` },
              { icon: Mail, label: "Email", val: contact.email, href: `mailto:${contact.email}` },
              { icon: MapPin, label: "Location", val: contact.location, href: undefined as string | undefined },
            ].map(({ icon: Icon, label, val, href }) => (
              <a key={label} href={href} className="block">
                <Card className="p-6 hover:shadow-elegant transition-smooth flex items-center gap-4">
                  <div className="size-12 rounded-xl gradient-forest text-primary-foreground flex items-center justify-center shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-semibold">{val}</p>
                  </div>
                </Card>
              </a>
            ))}
          </div>

          <Card className="lg:col-span-2 p-6 md:p-8">
            <h3 className="font-display text-2xl font-bold mb-6">Send us a message</h3>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input required /></div>
                <div className="space-y-2"><Label>Email</Label><Input required type="email" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input type="tel" /></div>
                <div className="space-y-2"><Label>Topic</Label>
                  <select className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm">
                    <option>Booking enquiry</option>
                    <option>Joel's Nissan</option>
                    <option>General question</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>Message</Label><Textarea required rows={5} /></div>
              <Button type="submit" variant="hero" size="lg">Send Message</Button>
            </form>
          </Card>
        </div>
      </section>

      <section className="container-luxe pb-20">
        <div className="rounded-2xl overflow-hidden shadow-elegant aspect-[16/9] border border-border">
          <iframe title="Map" src="https://www.google.com/maps?q=Kilimani,Nairobi&output=embed" width="100%" height="100%" loading="lazy" style={{ border: 0 }} />
        </div>
      </section>

      <FAQ />
    </>
  );
};

export default Contact;