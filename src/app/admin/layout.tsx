import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone admin chrome — no public header/footer from root still wraps.
  // Root layout still includes site Header/Footer; admin pages hide via CSS
  // or we accept the wrap. Prefer full-width admin content.
  return <div className="min-h-screen bg-ivory">{children}</div>;
}
