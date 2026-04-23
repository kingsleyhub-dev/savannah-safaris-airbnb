import logo from "@/assets/logo-transparent.png";
import { Link } from "react-router-dom";

export const Logo = ({ variant = "dark" }: { variant?: "dark" | "light" }) => (
  <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 group">
    <img src={logo} alt="Savannah Safaris Airbnb" className="h-10 w-10 shrink-0 object-contain transition-smooth group-hover:scale-105 sm:h-12 sm:w-12" />
    <div className="hidden min-w-0 sm:flex flex-col leading-tight">
      <span className={`truncate font-display font-bold text-sm sm:text-base ${variant === "light" ? "text-primary-foreground" : "text-primary"}`}>
        Savannah Safaris
      </span>
      <span className={`truncate text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] ${variant === "light" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        Airbnb · Nairobi
      </span>
    </div>
  </Link>
);