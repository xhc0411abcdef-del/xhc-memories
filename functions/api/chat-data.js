/**
 * Cloudflare Pages Function: /api/chat-data
 * Proxies GitHub raw file access for private repo chat data files.
 *
 * Usage: GET /api/chat-data?file=data1_p01.json
 *
 * Requires env var: GH_TOKEN (set in Cloudflare Pages Settings → Variables and Secrets)
 */

const REPO = "xhc0411abcdef-del/xhc-memories";
const BRANCH = "main";

// Allowed file names (whitelist for security)
const ALLOWED_FILES = new Set([
  "data1_p01.json","data1_p02.json","data1_p03.json","data1_p04.json",
  "data1_p05.json","data1_p06.json","data1_p07.json","data1_p08.json",
  "data1_p09.json","data1_p10.json","data1_p11.json","data1_p12.json",
  "data2_p01.json","data2_p02.json","data2_p03.json","data2_p04.json",
  "data2_p05.json","data2_p06.json","data2_p07.json","data2_p08.json",
  "data2_p09.json","data2_p10.json","data2_p11.json","data2_p12.json",
]);

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const file = url.searchParams.get("file");

  if (!file || !ALLOWED_FILES.has(file)) {
    return new Response(JSON.stringify({ error: "Invalid file parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = env.GH_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "GH_TOKEN not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Use GitHub API to get file content (works for private repos)
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/chat/${file}?ref=${BRANCH}`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3.raw", // returns raw file content directly
      "User-Agent": "xhc-memories-chat",
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: `GitHub API error: ${res.status}` }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const content = await res.text();
  return new Response(content, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400", // cache for 1 day (data doesn't change)
    },
  });
}
