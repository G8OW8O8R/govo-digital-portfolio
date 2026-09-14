import { createFileRoute } from "@tanstack/react-router";

import PricingPage from "@/pages/PricingPage";
import { PRICING } from "@/content/pricing";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, breadcrumbSchema, faqSchema, seoHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const PL_PATH = `${PAGE_PATHS.services.pl}/cennik`;
const EN_PATH = `${PAGE_PATHS.services.en}/pricing`;

export const Route = createFileRoute("/en/services/pricing")({
  head: () =>
    seoHead({
      lang: "en",
      ...PAGE_SEO["pricing"]!.en,
      plPath: PL_PATH,
      enPath: EN_PATH,
      jsonLd: [
        faqSchema(PRICING.en.faq),
        breadcrumbSchema([
          { name: "Home", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.en}` },
          { name: "Services", url: `${siteConfig.siteUrl}${PAGE_PATHS.services.en}` },
          { name: "Pricing", url: `${siteConfig.siteUrl}${EN_PATH}` },
        ]),
      ],
    }),
  component: PricingPage,
});
