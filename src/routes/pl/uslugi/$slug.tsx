import { createFileRoute, notFound } from "@tanstack/react-router";

import ServicePage from "@/pages/ServicePage";
import { SERVICES, SERVICE_SLUGS, serviceSlugToKey } from "@/content/services";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { breadcrumbSchema, faqSchema, seoHead, serviceSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/pl/uslugi/$slug")({
  loader: ({ params }) => {
    const key = serviceSlugToKey("pl", params.slug);
    if (!key) throw notFound();
    return { key };
  },
  head: ({ loaderData }) => {
    const key = loaderData?.key;
    if (!key) return {};
    const service = SERVICES[key].pl;
    const plPath = `${PAGE_PATHS.services.pl}/${SERVICE_SLUGS[key].pl}`;
    return seoHead({
      lang: "pl",
      title: service.metaTitle,
      description: service.metaDescription,
      plPath,
      enPath: `${PAGE_PATHS.services.en}/${SERVICE_SLUGS[key].en}`,
      jsonLd: [
        serviceSchema({
          name: service.label,
          description: service.metaDescription,
          url: `${siteConfig.siteUrl}${plPath}`,
          areaServed: ["Warszawa", "Polska"],
        }),
        faqSchema(service.faq),
        breadcrumbSchema([
          { name: "Start", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.pl}` },
          { name: "Usługi", url: `${siteConfig.siteUrl}${PAGE_PATHS.services.pl}` },
          { name: service.label, url: `${siteConfig.siteUrl}${plPath}` },
        ]),
      ],
    });
  },

  component: ServiceRoute,
});

function ServiceRoute() {
  const { key } = Route.useLoaderData();
  return <ServicePage serviceKey={key} />;
}
