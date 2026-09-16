import { notFound } from "next/navigation";

export default function ServicesPage() {
  // Treat `/services` as a non-existent path — render the Next.js 404 page
  notFound();
}
