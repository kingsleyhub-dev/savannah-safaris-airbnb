import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { useContactInfo } from "@/hooks/useContactInfo";

export const Footer = () => {
  const contact = useContactInfo();
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-luxe py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
            An exclusive 2-bedroom luxury escape in the heart of Nairobi — comfort, security, and seamless direct bookings.
          </p>
          <div className="flex gap-3 pt-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="size-10 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground transition-smooth flex items-center justify-center">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.25em] text-accent mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {[
              ["The Stay", "/property"],
              ["Gallery", "/gallery"],
              ["Services", "/services"],
              ["Location", "/location"],
              ["About", "/about"],
            ].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-accent transition-smooth">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.25em] text-accent mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-3"><MapPin className="size-4 mt-0.5 text-accent" /> {contact.location}</li>
            <li className="flex items-start gap-3"><Phone className="size-4 mt-0.5 text-accent" /> {contact.whatsapp_primary.label}: {contact.whatsapp_primary.number}</li>
            <li className="flex items-start gap-3"><Phone className="size-4 mt-0.5 text-accent" /> {contact.whatsapp_secondary.label}: {contact.whatsapp_secondary.number}</li>
            <li className="flex items-start gap-3"><Mail className="size-4 mt-0.5 text-accent" /> {contact.email}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.25em] text-accent mb-4">Direct Booking</h4>
          <p className="text-sm text-primary-foreground/70 mb-4">Best rates guaranteed when you book directly with us.</p>
          <Link to="/booking" className="inline-flex items-center justify-center px-6 py-3 rounded-full gradient-gold text-primary font-medium text-sm hover:opacity-90 transition-smooth">
            Reserve Your Stay
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-luxe py-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Savannah Safaris Airbnb. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/admin" className="hover:text-accent">Admin</Link>
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
