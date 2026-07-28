import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Network OS",
    template: "%s · FundForFounders OS",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full-viewport admin chrome covers public header/footer (z-index 200).
  return <>{children}</>;
}
