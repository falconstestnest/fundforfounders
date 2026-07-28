import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/**
 * Search engines may index public marketing pages only.
 * Admin, APIs, and post-submit thank-you flows stay private.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/admin",
          "/thank-you",
          "/application-received",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
