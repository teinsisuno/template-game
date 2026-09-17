/* Supa Topup — Three.js FX (ES module, three via importmap CDN)
   data-fx="hero": floating 3D game-cover cards + particles
   data-fx="mist": subtle particle field for page headers
   Fallbacks: no WebGL / reduced-motion / load error → html.fx-static (CSS collage). */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

function makeCardTexture(THREE, src, label, w = 512, h = 640) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const x = c.getContext("2d"), r = 40;
      x.save(); x.beginPath(); x.roundRect(2, 2, w - 4, h - 4, r); x.clip();
      const s = Math.max(w / img.width, h / img.height), iw = img.width * s, ih = img.height * s;
      x.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
      const g = x.createLinearGradient(0, h * .55, 0, h); g.addColorStop(0, "transparent"); g.addColorStop(1, "rgba(4,6,15,.92)");
      x.fillStyle = g; x.fillRect(0, h * .55, w, h * .45); x.restore();
      x.strokeStyle = "rgba(160,180,255,.5)"; x.lineWidth = 3; x.beginPath(); x.roundRect(2, 2, w - 4, h - 4, r); x.stroke();
      x.fillStyle = "#fff"; x.font = `700 ${w * .075}px Sora, 'Plus Jakarta Sans', sans-serif`;
      x.textAlign = "center"; x.fillText(label, w / 2, h - 46);
      x.fillStyle = "rgba(120,220,255,.95)"; x.font = `800 ${w * .05}px sans-serif`; x.fillText("SUPA TOPUP", w / 2, h - 18);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      res(t);
    };
    img.onerror = rej; img.src = src;
  });
}

async function buildScene(canvas, mode, games) {
  const THREE = await import("three");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mode === "hero" ? 1.8 : 1.4));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05070f, .055);
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
  camera.position.set(0, 0, mode === "hero" ? 9.2 : 7);

  const root = new THREE.Group(); scene.add(root);

  /* particles */
  const N = innerWidth < 700 ? 160 : (mode === "hero" ? 420 : 260);
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 22; pos[i * 3 + 1] = (Math.random() - .5) * 12; pos[i * 3 + 2] = (Math.random() - .5) * 10 - 2; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pm = new THREE.PointsMaterial({ size: .045, color: 0x8ea2ff, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false });
  const pts = new THREE.Points(pg, pm); root.add(pts);

  /* glow backdrop */
  const gc = document.createElement("canvas"); gc.width = gc.height = 256;
  const gx = gc.getContext("2d"), rg = gx.createRadialGradient(128, 128, 10, 128, 128, 128);
  rg.addColorStop(0, "rgba(123,92,255,.5)"); rg.addColorStop(.55, "rgba(0,212,255,.14)"); rg.addColorStop(1, "transparent");
  gx.fillStyle = rg; gx.fillRect(0, 0, 256, 256);
  const gt = new THREE.CanvasTexture(gc); gt.colorSpace = THREE.SRGBColorSpace;
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.MeshBasicMaterial({ map: gt, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.position.z = -6; glow.position.x = mode === "hero" ? 2.6 : 0; root.add(glow);

  /* floating cover cards */
  const cards = [];
  if (mode === "hero" && games.length) {
    const list = games.filter(g => g.img).slice(0, innerWidth < 700 ? 5 : 9);
    const texs = await Promise.all(list.map(g => makeCardTexture(THREE, g.img, g.name.split(":")[0]).catch(() => null)));
    texs.forEach((tex, i) => {
      if (!tex) return;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.62, 2.02), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      const n = texs.length, a = (i / n) * Math.PI * 2;
      m.userData = { a, r: 3.1, yA: (i % 3 - 1) * .62, sp: .12 + (i % 4) * .025, ph: i * 1.7 };
      m.position.set(Math.cos(a) * 2.9 + 2.2, m.userData.yA, Math.sin(a) * 1.6 - 1);
      root.add(m); cards.push(m);
    });
  }

  /* sizing */
  const fit = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  fit(); addEventListener("resize", fit);

  /* interaction */
  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("pointermove", e => { mx = (e.clientX / innerWidth - .5) * 2; my = (e.clientY / innerHeight - .5) * 2; }, { passive: true });

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    const t = clock.getElapsedTime(), s = RM ? 0 : 1;
    tx += (mx * .16 - tx) * .05; ty += (my * .1 - ty) * .05;
    root.rotation.y = tx; root.rotation.x = ty;
    cards.forEach(c => {
      const u = c.userData;
      c.position.y = u.yA + Math.sin(t * u.sp * 2 + u.ph) * .22 * s;
      c.rotation.z = Math.sin(t * .3 + u.ph) * .04 * s;
    });
    pts.rotation.y = t * .015 * s;
    renderer.render(scene, camera);
  })();
}

(async function init() {
  const host = document.querySelector("[data-fx]");
  if (!host) return;
  const canvas = host.tagName === "CANVAS" ? host : host.querySelector("canvas");
  if (!canvas) return;
  if (RM || !window.WebGLRenderingContext) { document.documentElement.classList.add("fx-static"); return; }
  try {
    await buildScene(canvas, host.dataset.fx, (window.SUPA && window.SUPA.games) || []);
  } catch (err) { console.warn("[fx] WebGL/asset gagal, fallback statis:", err); document.documentElement.classList.add("fx-static"); }
})();
