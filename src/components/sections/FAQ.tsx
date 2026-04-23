import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/data/site";
import { useSiteContent } from "@/hooks/useSiteContent";

export const FAQ = () => {
  const { get } = useSiteContent();
  const g = (k: string, fb: string) => get("home", "faq", k, fb);
  return (
  <section className="section-padding">
    <div className="container-luxe max-w-3xl">
      <div className="text-center mb-12 space-y-4">
        <span className="eyebrow">{g("eyebrow", "— FAQ")}</span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold">{g("title", "Good to know")}</h2>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-xl px-5 bg-card">
            <AccordionTrigger className="text-left font-medium hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
  );
};