interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
}

export const PageHero = ({ eyebrow, title, subtitle, image }: Props) => (
  <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28 overflow-hidden">
    <div className="absolute inset-0">
      <img src={image} alt="" className="w-full h-full object-cover" loading="eager" />
      <div className="absolute inset-0 gradient-hero" />
    </div>
    <div className="container-luxe relative text-primary-foreground text-center max-w-3xl">
      {eyebrow && <span className="eyebrow text-accent justify-center mb-4">— {eyebrow}</span>}
      <h1 className="font-display fluid-h1 font-bold text-balance animate-fade-up">{title}</h1>
      {subtitle && <p className="mt-4 sm:mt-6 text-base sm:text-lg text-primary-foreground/85 text-balance">{subtitle}</p>}
    </div>
  </section>
);