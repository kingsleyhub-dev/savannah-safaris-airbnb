interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
}

export const PageHero = ({ eyebrow, title, subtitle, image }: Props) => (
  <section className="relative overflow-hidden pb-14 pt-24 sm:pb-20 sm:pt-32 md:pb-24 md:pt-40">
    <div className="absolute inset-0">
      <img src={image} alt="" className="w-full h-full object-cover" loading="eager" />
      <div className="absolute inset-0 gradient-hero" />
    </div>
    <div className="container-luxe relative max-w-3xl text-center text-primary-foreground">
      {eyebrow && <span className="eyebrow text-accent justify-center mb-4">— {eyebrow}</span>}
      <h1 className="font-display fluid-h1 font-bold text-balance animate-fade-up">{title}</h1>
      {subtitle && <p className="mt-4 px-2 text-sm text-balance text-primary-foreground/85 sm:mt-6 sm:px-0 sm:text-lg">{subtitle}</p>}
    </div>
  </section>
);