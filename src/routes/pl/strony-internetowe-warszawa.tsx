import { createFileRoute } from "@tanstack/react-router";

import WarsawPage from "@/pages/WarsawPage";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { PAGE_SEO, breadcrumbSchema, seoHead, serviceSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const PATH = "/pl/strony-internetowe-warszawa";

export const Route = createFileRoute("/pl/strony-internetowe-warszawa")({
  head: () =>
    seoHead({
      lang: "pl",
      ...PAGE_SEO["warsaw"]!.pl,
      plPath: PATH,
      enPath: PATH,
      singleLanguage: true,
      jsonLd: [
        serviceSchema({
          name: "Tworzenie stron internetowych — cała Polska",
          description: PAGE_SEO["warsaw"]!.pl.description,
          url: `${siteConfig.siteUrl}${PATH}`,
          areaServed: [
            "Polska",
            "Warszawa",
            "Kraków",
            "Wrocław",
            "Poznań",
            "Gdańsk",
            "Łódź",
            "Katowice",
          ],
        }),
        breadcrumbSchema([
          { name: "Start", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.pl}` },
          { name: "Strony internetowe — cała Polska", url: `${siteConfig.siteUrl}${PATH}` },
        ]),
      ],
    }),
  component: WarsawPage,
});
