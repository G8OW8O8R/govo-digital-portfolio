import { createFileRoute } from "@tanstack/react-router";

import ContactPage from "@/pages/ContactPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/en/contact")({
  head: () =>
    seoHead({
      lang: "en",
      ...PAGE_SEO["contact"]!.en,
      plPath: PAGE_PATHS.contact.pl,
      enPath: PAGE_PATHS.contact.en,
    }),
  component: ContactPage,
});
