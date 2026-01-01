/* eslint-disable no-console */

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const PB_IDENTITY = process.env.PB_IDENTITY || process.env.PB_ADMIN_EMAIL || "";
const PB_PASSWORD = process.env.PB_PASSWORD || "";

const DEFAULT_RANGES = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 10],
  [1, 20],
  [1, 50],
  [1, 60],
  [1, 100],
  [1, 520],
  [1, 1000],
  [1, 10000],
  [1, 69],
  [1, 49],
];

const base = (path) => `${PB_URL.replace(/\/+$/g, "")}${path}`;

async function jsonFetch(url, init = {}) {
  const res = await fetch(url, init);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) || text || `${res.status}`;
    throw new Error(`${res.status} ${url}: ${msg}`);
  }
  return data;
}

async function authAdmin() {
  if (!PB_IDENTITY || !PB_PASSWORD) return null;

  const url = base("/api/admins/auth-with-password");
  const payload = { identity: PB_IDENTITY, password: PB_PASSWORD };

  try {
    const data = await jsonFetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (data?.token) return String(data.token);
    return null;
  } catch (e) {
    console.error(
      "Auth failed (check PB version / identity/password):",
      e.message,
    );
    return null;
  }
}

async function upsertBySlug(collection, slug, record, token) {
  const listUrl = new URL(base(`/api/collections/${collection}/records`));
  listUrl.searchParams.set("perPage", "1");
  listUrl.searchParams.set("page", "1");
  listUrl.searchParams.set("filter", `(slug='${slug.replace(/'/g, "\\'")}')`);

  const headers = { "content-type": "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;

  const list = await jsonFetch(listUrl.toString(), { headers });
  const existing = list?.items?.[0];

  if (existing?.id) {
    const patchUrl = base(
      `/api/collections/${collection}/records/${existing.id}`,
    );
    await jsonFetch(patchUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify(record),
    });
    return { id: existing.id, updated: true };
  }

  const createUrl = base(`/api/collections/${collection}/records`);
  const created = await jsonFetch(createUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(record),
  });
  return { id: created?.id || null, created: true };
}

async function upsertByField(collection, fieldName, fieldValue, record, token) {
  const listUrl = new URL(base(`/api/collections/${collection}/records`));
  listUrl.searchParams.set("perPage", "1");
  listUrl.searchParams.set("page", "1");
  listUrl.searchParams.set(
    "filter",
    `(${fieldName}='${String(fieldValue).replace(/'/g, "\\'")}')`,
  );

  const headers = { "content-type": "application/json" };
  if (token) headers.authorization = `Bearer ${token}`;

  const list = await jsonFetch(listUrl.toString(), { headers });
  const existing = list?.items?.[0];

  if (existing?.id) {
    const patchUrl = base(
      `/api/collections/${collection}/records/${existing.id}`,
    );
    await jsonFetch(patchUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify(record),
    });
    return { id: existing.id, updated: true };
  }

  const createUrl = base(`/api/collections/${collection}/records`);
  const created = await jsonFetch(createUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(record),
  });
  return { id: created?.id || null, created: true };
}

async function ensureRangeTemplate(token) {
  const record = {
    type: "range",
    title_template: "Random Number {{min}}-{{max}}",
    meta_desc:
      "Generate a random number between {{min}} and {{max}} instantly.",
    content_top:
      "<p><strong>Random number {{min}}-{{max}}</strong> is useful for games, raffles, and quick decisions.</p>",
    content_bottom: "<p>Refresh the page or press Space to generate again.</p>",
  };
  return upsertByField("seo_templates", "type", "range", record, token);
}

async function seedKeywords(ranges, token) {
  for (const [min, max] of ranges) {
    const slug = `${min}-${max}`;
    const record = {
      slug,
      type: "range",
      params: { min, max, count: 1, step: 1 },
      allow_indexing: false,
      volume: 100,
      clicks: 0,
    };
    await upsertBySlug("keywords", slug, record, token);
    console.log(`Seeded: ${slug}`);
  }
}

async function main() {
  console.log("PB_URL:", PB_URL);

  const token = await authAdmin();
  if (!token) {
    console.log(
      "No admin token (will attempt public write). If PocketBase rules require auth, set PB_IDENTITY + PB_PASSWORD.",
    );
  }

  await ensureRangeTemplate(token);
  await seedKeywords(DEFAULT_RANGES, token);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
