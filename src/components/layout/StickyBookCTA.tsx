import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useAuth } from "@/admin/auth/AuthProvider";
import { toast } from "sonner";

export const StickyBookCTA = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hide the floating CTA on auth + booking pages
  if (["/booking", "/signin", "/signup", "/my-bookings"].includes(pathname)) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast.info("Please sign in or create an account to continue booking.");
      navigate("/signin", {
        state: { from: "/booking", message: "Please sign in or create an account to continue booking." },
      });
    }
  };

  return (
    <Link
      to="/booking"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-40 inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-elegant transition-smooth hover:bg-primary-glow hover:scale-105 sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5"
    >
      <Calendar className="size-4" />
      <span>Book Now</span>
    </Link>
  );
};