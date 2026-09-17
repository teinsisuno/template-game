/* Supa Topup — service worker: shell cache, network-first HTML, cache-first assets */
const V = "supa-v2";
const CORE = ["index.html", "topup.html", "produk.html", "lacak.html", "bantuan.html", "auth.html", "404.html",
  "css/style.css", "js/data.js", "js/main.js", "js/fx.js", "manifest.webmanifest"];
const IMGS = ["img/ml.jpg", "img/ff.jpg", "img/genshin.jpg", "img/valo.jpg", "img/pubg.jpg", "img/codm.jpg",
  "img/hok.jpg", "img/wuwa.jpg", "img/hsrr.jpg", "img/zzz.jpg", "img/roblox.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll([...CORE, ...IMGS])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.endsWith(".html")) {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(e.request, cp)); return res }).catch(() => r)));
  }
});
