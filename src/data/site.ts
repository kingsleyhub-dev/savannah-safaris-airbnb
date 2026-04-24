import hero from "@/assets/hero.jpg";
import bedroom from "@/assets/bedroom.jpg";
import bedroomAlt1 from "@/assets/bedroom-alt1.jpg";
import bedroomAlt2 from "@/assets/bedroom-alt2.jpg";
import bedroom2 from "@/assets/bedroom2.jpg";
import living from "@/assets/living.jpg";
import living2 from "@/assets/living2.jpg";
import kitchen from "@/assets/kitchen.jpg";
import kitchen2 from "@/assets/kitchen2.jpg";
import kitchen3 from "@/assets/kitchen3.jpg";
import dining from "@/assets/dining.jpg";
import dining2 from "@/assets/dining2.jpg";
import dining3 from "@/assets/dining3.jpg";
import bathroom from "@/assets/bathroom.jpg";
import view from "@/assets/view.jpg";
import nissan from "@/assets/nissan.jpg";

export const images = { hero, bedroom, bedroomAlt1, bedroomAlt2, bedroom2, living, living2, kitchen, kitchen2, kitchen3, dining, dining2, dining3, bathroom, view, nissan };

export const property = {
  name: "Savannah Safaris Airbnb",
  tagline: "Luxury Stay. Prime Location. Seamless Comfort.",
  bedrooms: 2,
  bathrooms: 2,
  guests: 4,
  pricePerNight: 120,
  currency: "USD",
  location: "Kilimani, Nairobi",
  whatsapp: "+254700000000",
  email: "stay@savannahsafaris.co.ke",
};

export const amenities = [
  { icon: "BedDouble", label: "Two Bedrooms", desc: "Plush king & queen beds" },
  { icon: "Bath", label: "Ensuite Washrooms", desc: "Marble rainfall showers" },
  { icon: "ChefHat", label: "Modern Kitchen", desc: "Fully equipped & stocked" },
  { icon: "UtensilsCrossed", label: "Dining Room", desc: "Seats six in elegance" },
  { icon: "Sofa", label: "Sitting Lounge", desc: "Cinematic comfort" },
  { icon: "Wifi", label: "Free High-Speed Wi-Fi", desc: "Fibre 200 Mbps" },
  { icon: "Car", label: "Free Secure Parking", desc: "Gated 24/7" },
  { icon: "ShieldCheck", label: "24/7 Security", desc: "Manned + CCTV" },
  { icon: "Mountain", label: "City Views", desc: "Panoramic skyline" },
  { icon: "MapPin", label: "Prime Location", desc: "Central & connected" },
];

export const highlights = [
  { icon: "Wifi", label: "Free Wi-Fi" },
  { icon: "Car", label: "Free Parking" },
  { icon: "ShieldCheck", label: "Secure Stay" },
  { icon: "Mountain", label: "City Views" },
  { icon: "MapPin", label: "Prime Location" },
  { icon: "Trees", label: "Near National Park" },
];

export const testimonials = [
  {
    name: "Amelia R.",
    location: "London, UK",
    quote: "The most thoughtful stay we've had in Nairobi. Spotless, secure, and the views at sunset are unreal.",
    rating: 5,
  },
  {
    name: "Daniel M.",
    location: "Cape Town, SA",
    quote: "Booked Joel's Nissan for a city tour — felt like a proper concierge service. Will return.",
    rating: 5,
  },
  {
    name: "Priya S.",
    location: "Mumbai, IN",
    quote: "Elegant, spacious, and the host communication was flawless. The location is unbeatable.",
    rating: 5,
  },
  {
    name: "Marcus K.",
    location: "Berlin, DE",
    quote: "A genuinely luxurious experience. Beats any hotel we've stayed at in the city.",
    rating: 5,
  },
];

export const faqs = [
  { q: "What time is check-in and check-out?", a: "Check-in from 2:00 PM, check-out by 11:00 AM. Flexible options available on request." },
  { q: "Is the property suitable for families?", a: "Absolutely. With two bedrooms, ensuite bathrooms, a full kitchen and secure parking, it's ideal for couples, families and small groups up to 4 guests." },
  { q: "How far is the property from Nairobi National Park?", a: "Approximately 20–30 minutes by car, depending on traffic. We can arrange transport via Joel's Nissan." },
  { q: "Do you offer airport pickup?", a: "Yes — airport transfers from JKIA can be added to any booking. Just select the add-on at checkout." },
  { q: "Is the area safe?", a: "Yes. The compound is gated with 24/7 manned security and CCTV throughout." },
  { q: "Can I pay a deposit instead of full amount?", a: "Yes — a 30% deposit secures your booking. The balance is due 7 days before check-in." },
];

export const nearbyPlaces = [
  { name: "Nairobi City Centre", distance: "10 min", icon: "Building2" },
  { name: "Nairobi National Park", distance: "25 min", icon: "Trees" },
  { name: "JKIA Airport", distance: "35 min", icon: "Plane" },
  { name: "Yaya Centre Mall", distance: "5 min", icon: "ShoppingBag" },
  { name: "Karura Forest", distance: "20 min", icon: "Leaf" },
  { name: "Westlands Restaurants", distance: "15 min", icon: "Utensils" },
];