import logo from "@/assets/logo-transparent.png";
import { Link } from "react-router-dom";

export const Logo = ({ variant = "dark" }: { variant?: "dark" | "light" }) => (
  <Link to="/" className="flex items-center gap-3 group">
    <img src={logo} alt="Savannah Safaris Airbnb" className="h-12 w-12 object-contain transition-smooth group-hover:scale-105" />
    <div className="hidden sm:flex flex-col leading-tight">
      <span className={`font-display font-bold text-base ${variant === "light" ? "text-primary-foreground" : "text-primary"}`}>
        Savannah Safaris
      </span>
      <span className={`text-[10px] uppercase tracking-[0.3em] ${variant === "light" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        Airbnb · Nairobi
      </span>
    </div>
  </Link>
);