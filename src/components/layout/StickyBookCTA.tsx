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
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-primary text-primary-foreground shadow-elegant hover:bg-primary-glow hover:scale-105 transition-smooth font-medium text-sm"
    >
      <Calendar className="size-4" />
      <span>Book Now</span>
    </Link>
  );
};