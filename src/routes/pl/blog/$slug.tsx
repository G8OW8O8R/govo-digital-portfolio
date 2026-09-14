import { createFileRoute, notFound } from "@tanstack/react-router";

import BlogPostPage from "@/pages/BlogPostPage";
import { BLOG_POSTS, findBlogPost } from "@/content/blog";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { articleSchema, breadcrumbSchema, seoHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/pl/blog/$slug")({
  loader: ({ params }) => {
    const post = findBlogPost("pl", params.slug);
    if (!post) throw notFound();
    return { postId: post.id };
  },
  head: ({ loaderData }) => {
    const post = BLOG_POSTS.find((p) => p.id === loaderData?.postId);
    if (!post) return {};
    const content = post.pl;
    const plPath = `${PAGE_PATHS.blog.pl}/${content.slug}`;
    const enPath = `${PAGE_PATHS.blog.en}/${post.en.slug}`;
    return seoHead({
      lang: "pl",
      title: content.metaTitle,
      description: content.metaDescription,
      plPath,
      enPath,
      jsonLd: [
        articleSchema({
          title: content.title,
          description: content.metaDescription,
          url: `${siteConfig.siteUrl}${plPath}`,
          datePublished: post.date,
          lang: "pl",
        }),
        breadcrumbSchema([
          { name: "Start", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.pl}` },
          { name: "Blog", url: `${siteConfig.siteUrl}${PAGE_PATHS.blog.pl}` },
          { name: content.title, url: `${siteConfig.siteUrl}${plPath}` },
        ]),
      ],
    });
  },
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const { postId } = Route.useLoaderData();
  return <BlogPostPage postId={postId} />;
}
