import { createFileRoute, notFound } from "@tanstack/react-router";

import BlogPostPage from "@/pages/BlogPostPage";
import { BLOG_POSTS, findBlogPost } from "@/content/blog";
import { PAGE_PATHS } from "@/lib/i18n-routes";
import { articleSchema, breadcrumbSchema, seoHead } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/en/blog/$slug")({
  loader: ({ params }) => {
    const post = findBlogPost("en", params.slug);
    if (!post) throw notFound();
    return { postId: post.id };
  },
  head: ({ loaderData }) => {
    const post = BLOG_POSTS.find((p) => p.id === loaderData?.postId);
    if (!post) return {};
    const content = post.en;
    const plPath = `${PAGE_PATHS.blog.pl}/${post.pl.slug}`;
    const enPath = `${PAGE_PATHS.blog.en}/${content.slug}`;
    return seoHead({
      lang: "en",
      title: content.metaTitle,
      description: content.metaDescription,
      plPath,
      enPath,
      jsonLd: [
        articleSchema({
          title: content.title,
          description: content.metaDescription,
          url: `${siteConfig.siteUrl}${enPath}`,
          datePublished: post.date,
          lang: "en",
        }),
        breadcrumbSchema([
          { name: "Home", url: `${siteConfig.siteUrl}${PAGE_PATHS.home.en}` },
          { name: "Blog", url: `${siteConfig.siteUrl}${PAGE_PATHS.blog.en}` },
          { name: content.title, url: `${siteConfig.siteUrl}${enPath}` },
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
