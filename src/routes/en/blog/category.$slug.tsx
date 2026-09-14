import { createFileRoute, notFound } from "@tanstack/react-router";

import BlogCategoryPage from "@/pages/BlogCategoryPage";
import {
  BLOG_CATEGORY_SEO,
  BLOG_CATEGORY_SLUGS,
  findBlogCategory,
  type BlogCategoryKey,
} from "@/content/blog";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { breadcrumbSchema, seoHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/en/blog/category/$slug")({
  loader: ({ params }) => {
    const key = findBlogCategory("en", params.slug);
    if (!key) throw notFound();
    return { categoryKey: key };
  },
  head: ({ loaderData }) => {
    const key = loaderData?.categoryKey as BlogCategoryKey | undefined;
    if (!key) return {};
    const seo = BLOG_CATEGORY_SEO[key].en;
    const plPath = `${PAGE_PATHS.blog.pl}/kategoria/${BLOG_CATEGORY_SLUGS[key].pl}`;
    const enPath = `${PAGE_PATHS.blog.en}/category/${BLOG_CATEGORY_SLUGS[key].en}`;
    return seoHead({
      lang: "en",
      title: seo.title,
      description: seo.description,
      plPath,
      enPath,
      jsonLd: [
        breadcrumbSchema([
          { name: "Home", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.en}` },
          { name: "Blog", url: `${siteConfig.siteUrl}${PAGE_PATHS.blog.en}` },
          { name: seo.title, url: `${siteConfig.siteUrl}${enPath}` },
        ]),
      ],
    });
  },
  component: BlogCategoryRoute,
});

function BlogCategoryRoute() {
  const { categoryKey } = Route.useLoaderData();
  return <BlogCategoryPage categoryKey={categoryKey} />;
}
