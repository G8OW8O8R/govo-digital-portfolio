import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OVERRIDES_PATH = "src/content/project-overrides.json";

/** btoa/atob + TextEncoder/TextDecoder instead of Buffer — this runs on whatever
 * edge/server runtime Nitro targets for the deploy, and Buffer isn't guaranteed
 * to exist there, while these Web APIs are. Polish diacritics need the UTF-8
 * round-trip; atob/btoa alone only handle Latin1. */
function utf8ToBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

type SaveInput = {
  slug: string;
  lang: "pl" | "en";
  name: string;
  subtitle: string;
  blurb: string;
  tags: string[];
};

function validateInput(data: unknown): SaveInput {
  if (typeof data !== "object" || data === null) throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const slug = String(d.slug ?? "").trim();
  if (!slug) throw new Error("Missing slug");
  const lang = d.lang === "en" ? "en" : "pl";
  const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const tags = Array.isArray(d.tags)
    ? d.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 12)
    : [];
  return {
    slug,
    lang,
    name: clip(d.name, 200),
    subtitle: clip(d.subtitle, 300),
    blurb: clip(d.blurb, 2000),
    tags,
  };
}

/** Owner-only content editing: verifies the caller has the `admin` role (via the
 * existing `has_role` RPC — no new auth system needed), then commits the edit
 * straight to `src/content/project-overrides.json` in the repo through the
 * GitHub Contents API. That commit triggers the normal Vercel deploy, so there's
 * no separate database/storage service to provision — just a GitHub token. */
export const saveProjectContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(validateInput)
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      throw new Error("Forbidden: admin role required");
    }

    const token = process.env["GITHUB_TOKEN"];
    const repo = process.env["GITHUB_REPO"];
    const branch = process.env["GITHUB_BRANCH"] || "main";
    if (!token || !repo) {
      throw new Error(
        "Server misconfigured: set GITHUB_TOKEN and GITHUB_REPO in the deployment environment.",
      );
    }

    const apiBase = `https://api.github.com/repos/${repo}/contents/${OVERRIDES_PATH}`;
    const ghHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers: ghHeaders });
    if (!getRes.ok) throw new Error(`GitHub read failed: ${getRes.status} ${await getRes.text()}`);
    const getJson = (await getRes.json()) as { content: string; sha: string };

    let current: Record<string, Record<string, unknown>> = {};
    try {
      current = JSON.parse(base64ToUtf8(getJson.content));
    } catch {
      current = {};
    }

    const next = {
      ...current,
      [data.slug]: {
        ...(current[data.slug] ?? {}),
        [data.lang]: {
          name: data.name,
          subtitle: data.subtitle,
          blurb: data.blurb,
          tags: data.tags,
        },
      },
    };

    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `content: update ${data.slug} (${data.lang}) via admin editor`,
        content: utf8ToBase64(JSON.stringify(next, null, 2) + "\n"),
        sha: getJson.sha,
        branch,
      }),
    });
    if (!putRes.ok) throw new Error(`GitHub write failed: ${putRes.status} ${await putRes.text()}`);

    return { ok: true as const };
  });

const IMAGE_EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function sanitizeSlugPart(input: string): string {
  return input.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60) || "project";
}

type UploadInput = { slug: string; mime: string; contentBase64: string };

function validateUploadInput(data: unknown): UploadInput {
  if (typeof data !== "object" || data === null) throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const slug = String(d.slug ?? "").trim();
  if (!slug) throw new Error("Missing slug");
  const mime = String(d.mime ?? "");
  if (!IMAGE_EXT_BY_MIME[mime]) throw new Error("Unsupported image type");
  const contentBase64 = String(d.contentBase64 ?? "");
  if (!contentBase64) throw new Error("Missing image data");
  // Base64 runs ~4/3 the byte size, so this caps the actual image around ~4.5MB.
  if (contentBase64.length > 6_000_000) throw new Error("Image too large (max ~4MB)");
  return { slug, mime, contentBase64 };
}

/** Owner-only: uploads a gallery image straight into the repo's `public/gallery/`
 * folder via the GitHub Contents API (same no-database approach as content edits),
 * so the resulting URL is servable immediately after the triggered Vercel deploy. */
export const uploadProjectImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(validateUploadInput)
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      throw new Error("Forbidden: admin role required");
    }

    const token = process.env["GITHUB_TOKEN"];
    const repo = process.env["GITHUB_REPO"];
    const branch = process.env["GITHUB_BRANCH"] || "main";
    if (!token || !repo) {
      throw new Error(
        "Server misconfigured: set GITHUB_TOKEN and GITHUB_REPO in the deployment environment.",
      );
    }

    const ext = IMAGE_EXT_BY_MIME[data.mime];
    const dir = `gallery/${sanitizeSlugPart(data.slug)}`;
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const apiBase = `https://api.github.com/repos/${repo}/contents/public/${dir}/${fileName}`;
    const ghHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `content: add gallery image for ${data.slug}`,
        content: data.contentBase64,
        branch,
      }),
    });
    if (!putRes.ok) throw new Error(`GitHub upload failed: ${putRes.status} ${await putRes.text()}`);

    return { ok: true as const, url: `/${dir}/${fileName}` };
  });

type GalleryInput = { slug: string; gallery: string[]; video: string };

function validateGalleryInput(data: unknown): GalleryInput {
  if (typeof data !== "object" || data === null) throw new Error("Invalid payload");
  const d = data as Record<string, unknown>;
  const slug = String(d.slug ?? "").trim();
  if (!slug) throw new Error("Missing slug");
  const gallery = Array.isArray(d.gallery)
    ? d.gallery.map((g) => String(g).trim()).filter(Boolean).slice(0, 24)
    : [];
  const video = String(d.video ?? "").trim().slice(0, 500);
  return { slug, gallery, video };
}

/** Owner-only: persists the gallery image list + optional video URL for a project,
 * shared across languages (unlike the text fields), via the same overrides file. */
export const saveProjectGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(validateGalleryInput)
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      throw new Error("Forbidden: admin role required");
    }

    const token = process.env["GITHUB_TOKEN"];
    const repo = process.env["GITHUB_REPO"];
    const branch = process.env["GITHUB_BRANCH"] || "main";
    if (!token || !repo) {
      throw new Error(
        "Server misconfigured: set GITHUB_TOKEN and GITHUB_REPO in the deployment environment.",
      );
    }

    const apiBase = `https://api.github.com/repos/${repo}/contents/${OVERRIDES_PATH}`;
    const ghHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const getRes = await fetch(`${apiBase}?ref=${branch}`, { headers: ghHeaders });
    if (!getRes.ok) throw new Error(`GitHub read failed: ${getRes.status} ${await getRes.text()}`);
    const getJson = (await getRes.json()) as { content: string; sha: string };

    let current: Record<string, Record<string, unknown>> = {};
    try {
      current = JSON.parse(base64ToUtf8(getJson.content));
    } catch {
      current = {};
    }

    const next = {
      ...current,
      [data.slug]: {
        ...(current[data.slug] ?? {}),
        media: { gallery: data.gallery, video: data.video || undefined },
      },
    };

    const putRes = await fetch(apiBase, {
      method: "PUT",
      headers: { ...ghHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `content: update gallery for ${data.slug}`,
        content: utf8ToBase64(JSON.stringify(next, null, 2) + "\n"),
        sha: getJson.sha,
        branch,
      }),
    });
    if (!putRes.ok) throw new Error(`GitHub write failed: ${putRes.status} ${await putRes.text()}`);

    return { ok: true as const };
  });
