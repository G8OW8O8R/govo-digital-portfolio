import { createFileRoute } from "@tanstack/react-router";

import ProcessPage from "@/pages/ProcessPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, seoHead } from "@/lib/seo";

export const Route = createFileRoute("/en/process")({
  head: () =>
    seoHead({
      lang: "en",
      ...PAGE_SEO["process"]!.en,
      plPath: PAGE_PATHS.process.pl,
      enPath: PAGE_PATHS.process.en,
    }),
  component: ProcessPage,
});
