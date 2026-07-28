import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/thank-you", "/application-received"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
