import { createFileRoute } from "@tanstack/react-router";

import PricingPage from "@/pages/PricingPage";
import { PRICING } from "@/content/pricing";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, breadcrumbSchema, faqSchema, seoHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const PL_PATH = `${PAGE_PATHS.services.pl}/cennik`;
const EN_PATH = `${PAGE_PATHS.services.en}/pricing`;

export const Route = createFileRoute("/pl/uslugi/cennik")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["pricing"]!.pl,
      plPath: PL_PATH,
      enPath: EN_PATH,
      jsonLd: [
        faqSchema(PRICING.pl.faq),
        breadcrumbSchema([
          { name: "Start", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.pl}` },
          { name: "Usługi", url: `${siteConfig.siteUrl}${PAGE_PATHS.services.pl}` },
          { name: "Cennik", url: `${siteConfig.siteUrl}${PL_PATH}` },
        ]),
      ],
    }),
  component: PricingPage,
});
