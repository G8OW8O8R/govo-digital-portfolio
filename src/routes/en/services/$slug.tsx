import { createFileRoute, notFound } from "@tanstack/react-router";

import ServicePage from "@/pages/ServicePage";
import { SERVICES, SERVICE_SLUGS, serviceSlugToKey } from "@/content/services";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { breadcrumbSchema, faqSchema, seoHead, serviceSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/en/services/$slug")({
  loader: ({ params }) => {
    const key = serviceSlugToKey("en", params.slug);
    if (!key) throw notFound();
    return { key };
  },
  head: ({ loaderData }) => {
    const key = loaderData?.key;
    if (!key) return {};
    const service = SERVICES[key].en;
    const enPath = `${PAGE_PATHS.services.en}/${SERVICE_SLUGS[key].en}`;
    return seoHead({
      lang: "en",
      title: service.metaTitle,
      description: service.metaDescription,
      plPath: `${PAGE_PATHS.services.pl}/${SERVICE_SLUGS[key].pl}`,
      enPath,
      jsonLd: [
        serviceSchema({
          name: service.label,
          description: service.metaDescription,
          url: `${siteConfig.siteUrl}${enPath}`,
        }),
        faqSchema(service.faq),
        breadcrumbSchema([
          { name: "Home", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.en}` },
          { name: "Services", url: `${siteConfig.siteUrl}${PAGE_PATHS.services.en}` },
          { name: service.label, url: `${siteConfig.siteUrl}${enPath}` },
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
