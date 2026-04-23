import { jsPDF } from "jspdf";

/**
 * Booking confirmation data passed to the PDF generator.
 * Amounts are in WHOLE dollars (not cents) for human readability.
 */
export interface ReceiptData {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestCountry?: string;
  checkIn: string;        // human-formatted date
  checkOut: string;       // human-formatted date
  nights: number;
  guests: number;
  pricePerNight: number;
  subtotal: number;
  cleaning: number;
  addons: { label: string; price: number }[];
  discountPercent: number;
  discountAmount: number;
  total: number;
  promoCode?: string;
  propertyName: string;
  propertyLocation: string;
  contactEmail?: string;
}

/** Build & download a branded PDF receipt for the given booking. */
export const downloadReceipt = (d: ReceiptData) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const PAD = 48;
  let y = 56;

  // Header band
  doc.setFillColor(34, 49, 38); // forest green
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Savannah Safaris Airbnb", PAD, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Booking Confirmation & Receipt", PAD, 70);

  // Reset for body
  doc.setTextColor(20, 20, 20);
  y = 130;

  // Booking ID + dates
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(`Booking ID: ${d.bookingId}`, PAD, y);
  doc.text(
    `Issued: ${new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`,
    W - PAD, y, { align: "right" },
  );
  y += 30;

  // Section helper
  const heading = (label: string) => {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(34, 49, 38);
    doc.text(label, PAD, y);
    y += 6;
    doc.setDrawColor(220, 214, 198);
    doc.line(PAD, y, W - PAD, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
  };

  const row = (left: string, right: string) => {
    doc.text(left, PAD, y);
    doc.text(right, W - PAD, y, { align: "right" });
    y += 18;
  };

  heading("Guest Details");
  row("Name", d.guestName);
  row("Email", d.guestEmail);
  if (d.guestPhone) row("Phone", d.guestPhone);
  if (d.guestCountry) row("Country", d.guestCountry);
  y += 6;

  heading("Stay");
  row("Property", d.propertyName);
  row("Location", d.propertyLocation);
  row("Check-in", d.checkIn);
  row("Check-out", d.checkOut);
  row("Nights", String(d.nights));
  row("Guests", String(d.guests));
  y += 6;

  heading("Charges");
  row(`$${d.pricePerNight} × ${d.nights} night${d.nights === 1 ? "" : "s"}`, `$${d.subtotal.toFixed(2)}`);
  row("Cleaning fee", `$${d.cleaning.toFixed(2)}`);
  for (const a of d.addons) row(a.label, `$${a.price.toFixed(2)}`);
  if (d.discountAmount > 0) {
    row(`Promo${d.promoCode ? ` (${d.promoCode})` : ""} −${d.discountPercent}%`, `-$${d.discountAmount.toFixed(2)}`);
  }
  y += 4;
  doc.setDrawColor(34, 49, 38);
  doc.setLineWidth(1);
  doc.line(PAD, y, W - PAD, y);
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total paid", PAD, y);
  doc.text(`$${d.total.toFixed(2)}`, W - PAD, y, { align: "right" });
  y += 36;

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  const footer = [
    "Thank you for choosing Savannah Safaris Airbnb.",
    "This receipt confirms your reservation. Please present this document or your booking ID at check-in.",
    d.contactEmail ? `Questions? Contact us at ${d.contactEmail}` : "",
  ].filter(Boolean);
  for (const line of footer) {
    doc.text(line, PAD, y);
    y += 14;
  }

  doc.save(`SavannahSafaris-Booking-${d.bookingId.slice(0, 8)}.pdf`);
};
