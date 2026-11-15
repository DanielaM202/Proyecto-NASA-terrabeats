// Service worker: lets the page work without a connection.
// - Page and built files: saved the first time they are used.
// - Audio, video and images: served from the "offline pack" (see src/components/OfflinePack.jsx).
// - Audio and video ask for byte ranges, so a saved file is cut to the range requested.
const CACHE = 'terrabeats-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(handle(req, url));
});

async function handle(req, url) {
  const cache = await caches.open(CACHE);

  if (req.mode === 'navigate') {
    try {
      const fresh = await fetch(req);
      if (fresh.ok) cache.put('/', fresh.clone());
      return fresh;
    } catch {
      return (await cache.match('/')) || Response.error();
    }
  }

  const hit = await cache.match(url.pathname + url.search);
  const range = req.headers.get('range');
  if (hit) return range ? sliceRange(hit, range) : hit;

  try {
    const res = await fetch(req);
    // Built files never change under the same name, so they are safe to keep.
    if (res.ok && res.status === 200 && url.pathname.startsWith('/assets/')) cache.put(url.pathname, res.clone());
    return res;
  } catch {
    return Response.error();
  }
}

async function sliceRange(res, range) {
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  const start = m && m[1] !== '' ? Number(m[1]) : 0;
  const end = m && m[2] !== '' ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
    },
  });
}
