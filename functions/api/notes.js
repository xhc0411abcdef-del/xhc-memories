/**
 * Cloudflare Pages Function: /api/notes
 * Handles reading and writing notes.json in the GitHub repo.
 *
 * GET  /api/notes        → returns notes array
 * POST /api/notes        → body: { text, sender } → appends note and returns updated array
 * DELETE /api/notes?id=  → removes note by id and returns updated array
 *
 * Requires env var: GH_TOKEN (set in Cloudflare Pages Settings → Variables and Secrets)
 */

const REPO = "xhc0411abcdef-del/xhc-memories";
const BRANCH = "main";
const FILE_PATH = "notes.json";

async function getNotesFile(token) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "xhc-memories-notes",
      },
    }
  );
  if (!res.ok) {
    if (res.status === 404) return { notes: [], sha: null };
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const data = await res.json();
  // Decode base64 content with proper UTF-8 handling
  const bytes = Uint8Array.from(atob(data.content.replace(/\n/g, "")), (c) => c.charCodeAt(0));
  const text = new TextDecoder("utf-8").decode(bytes);
  return { notes: JSON.parse(text), sha: data.sha };
}

async function saveNotesFile(token, notes, sha) {
  // Encode with proper UTF-8 handling
  const text = JSON.stringify(notes, null, 2);
  const bytes = new TextEncoder().encode(text);
  const base64 = btoa(String.fromCharCode(...Array.from(bytes)));

  const body = {
    message: "feat: update notes",
    content: base64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "xhc-memories-notes",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub save error: ${res.status} ${err}`);
  }
  return res.json();
}

export async function onRequestGet({ env }) {
  const token = env.GH_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "GH_TOKEN not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const { notes } = await getNotesFile(token);
    return new Response(JSON.stringify(notes), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost({ request, env }) {
  const token = env.GH_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "GH_TOKEN not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const { text, sender } = await request.json();
    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { notes, sha } = await getNotesFile(token);
    const newNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: sender || "me",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    await saveNotesFile(token, notes, sha);
    return new Response(JSON.stringify(notes), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestDelete({ request, env }) {
  const token = env.GH_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "GH_TOKEN not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { notes, sha } = await getNotesFile(token);
    const updated = notes.filter((n) => n.id !== id);
    await saveNotesFile(token, updated, sha);
    return new Response(JSON.stringify(updated), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
