/* Supa Topup — app logic (v2). Data dari js/data.js (window.SUPA). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const { games: GAMES, ppob: PPOB, pays: PAYS, rupiah } = window.SUPA;
const store = { get: (k, f) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? f } catch { return f } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { } } };
const state = { game: GAMES[0], nom: 0, pay: 0 };

/* ================= shared UI ================= */
function toast(msg) { const t = document.createElement("div"); t.className = "toast"; t.textContent = msg; $("#toast")?.appendChild(t); setTimeout(() => t.remove(), 3600) }
function closeModal() { $("#checkoutModal")?.classList.remove("open"); clearInterval(payTimer) }
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal() });
$("#menuBtn")?.addEventListener("click", () => $("#navLinks")?.classList.toggle("open"));
if ($("#year")) $("#year").textContent = new Date().getFullYear();

/* floating widgets (WA + back-to-top) */
document.body.insertAdjacentHTML("beforeend", `<div class="floats no-print">
<button class="fab top" id="fabTop" aria-label="Kembali ke atas">↑</button>
<a class="fab wa" href="https://wa.me/6281234567890?text=Halo%20CS%20Supa%20Topup" target="_blank" rel="noopener" aria-label="Chat CS WhatsApp">💬</a></div>`);
addEventListener("scroll", () => $("#fabTop")?.classList.toggle("show", scrollY > 560), { passive: true });
$("#fabTop")?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* scroll reveal */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target) } }), { threshold: .06 });
  $$("section > .container > .grid, .tile, .panel, .quote, .faq details, .how>div").forEach((el, i) => { el.classList.add("reveal"); el.style.transitionDelay = (i % 6) * 55 + "ms"; io.observe(el) });
}

/* countdown flash sale ke jam 19.00 */
setInterval(() => {
  const n = new Date(), t = new Date(n); t.setHours(19, 0, 0, 0); if (n > t) t.setDate(t.getDate() + 1);
  let s = Math.floor((t - n) / 1000);
  const p = x => String(x).padStart(2, "0");
  if ($("#cdH")) { cdH.textContent = p(Math.floor(s / 3600)); cdM.textContent = p(Math.floor(s % 3600 / 60)); cdS.textContent = p(s % 60) }
}, 1000);

/* ================= cards ================= */
function gameCard(g, rank) {
  const cover = g.img ? `<img src="${g.img}" alt="Kover ${g.name}" width="270" height="203" loading="lazy">` : g.icon;
  return `<article class="card"><div class="card-cover">${cover}
  <span class="disc">${g.tag}</span><span class="flash">⚡ Instan</span>${rank ? `<span class="rank">#${rank} Terlaris</span>` : ""}</div>
  <div class="card-body"><h3>${g.name}</h3><p>${g.sold} • stok ✅</p>
  <div class="card-meta"><span class="price">${rupiah(g.from)}<small>mulai dari</small></span>
  <a class="btn btn-primary btn-sm" href="topup.html?game=${g.id}">Top Up</a></div></div></article>`;
}
function ppobTile(p) {
  return `<a class="tile${p.hot ? " hot" : ""}" href="produk.html#${p.id}" id="${p.id}"><span class="ic">${p.icon}</span>
  <span><h3>${p.name}</h3><p>${p.desc}</p></span><span class="price go">${rupiah(p.from)}<small>mulai</small></span></a>`;
}

/* ================= HOME ================= */
if ($("#homeGames")) {
  $("#homeGames").innerHTML = GAMES.slice(0, 8).map(g => gameCard(g)).join("");
  $$("#gameFilter .fbtn").forEach(b => b.onclick = () => {
    $$("#gameFilter .fbtn").forEach(x => x.classList.remove("active")); b.classList.add("active");
    const f = b.dataset.f; $("#homeGames").innerHTML = GAMES.filter(g => f === "all" || g.cat === f).map(g => gameCard(g)).join("") || "<p class='hint'>Tidak ada game di kategori ini.</p>";
  });
}
if ($("#topRank")) $("#topRank").innerHTML = GAMES.slice(0, 5).map((g, i) => gameCard(g, i + 1)).join("");
if ($("#homePpob")) $("#homePpob").innerHTML = PPOB.slice(0, 6).map(p => ppobTile({ ...p, hot: ["pulsa", "pln"].includes(p.id) }).replace(/id="/, 'data-id="')).join("");
if ($("#gameMarquee")) $("#gameMarquee").innerHTML = GAMES.concat(GAMES).map(g => `<span>${g.img ? `<img src="${g.img}" alt="" width="26" height="26" loading="lazy">` : g.icon} ${g.name}</span>`).join("");
if ($("#payMarquee")) $("#payMarquee").innerHTML = PAYS.concat(PAYS).map(p => `<span>${p[0]}</span>`).join("");

/* quick widget */
function chipList() {
  const qg = $("#quickGames"); if (!qg) return;
  qg.innerHTML = GAMES.slice(0, 6).map((g, i) => `<button class="chip" data-i="${i}" aria-pressed="${i === (state.gameIdx ?? 0)}">${g.img ? `<img src="${g.img}" alt="" width="24" height="24" loading="lazy">` : g.icon} ${g.name.split(":")[0]}</button>`).join("");
  qg.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; state.gameIdx = +b.dataset.i; state.game = GAMES[state.gameIdx]; state.nom = 0; chipList(); nomList(); total() };
}
function nomList() {
  const box = $("#quickNoms"); if (!box) return;
  box.innerHTML = state.game.noms.map((n, i) => `<button class="nom" data-i="${i}" aria-pressed="${i === state.nom}"><b>${n[0]}</b><span>${rupiah(n[1])}</span></button>`).join("");
  box.onclick = e => { const b = e.target.closest(".nom"); if (!b) return; state.nom = +b.dataset.i; nomList(); total() };
}
function payList(sel, cb) {
  const box = $(sel); if (!box) return;
  box.innerHTML = PAYS.map((p, i) => `<button class="pay" data-i="${i}" aria-pressed="${i === state.pay}"><span>${p[0]}</span><small class="hint">${p[1]}</small></button>`).join("");
  box.onclick = e => { const b = e.target.closest(".pay"); if (!b) return; state.pay = +b.dataset.i; $$(".pay", box).forEach(x => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); cb && cb() };
}
function calc(price, payIdx, promo) {
  const fee = window.SUPA.feeOf(price, PAYS[payIdx]);
  const disc = (promo || "").trim().toUpperCase() === "GAMER30" ? Math.min(15000, Math.round(price * .3)) : 0;
  return { fee, disc, total: price + fee - disc };
}
function total() { const t = $("#quickTotal"); if (!t) return; t.textContent = rupiah(calc(state.game.noms[state.nom][1], state.pay).total) }
function quickCheckout() {
  const id = $("#quickId").value.trim();
  if (!/^[A-Za-z0-9 ._-]{4,24}$/.test(id)) return toast("User ID minimal 4 karakter (huruf/angka) 🎮");
  const [nom, price] = state.game.noms[state.nom], { fee, disc, total } = calc(price, state.pay);
  openInvoice({ game: state.game.name, img: state.game.img, item: nom, id, server: $("#quickServer").value.trim() || "-", pay: PAYS[state.pay][0], price, fee, disc, total });
}
if ($("#quickGames")) { chipList(); payList("#quickPays", total); nomList(); }
function goSearch() { const q = ($("#q")?.value || "").toLowerCase(); const hit = GAMES.find(g => g.name.toLowerCase().includes(q)); location.href = hit ? `topup.html?game=${hit.id}` : "topup.html"; return false }

/* ================= TOPUP page ================= */
if ($("#catalog")) {
  const render = list => $("#catalog").innerHTML = list.map(g => gameCard(g)).join("") || "<p class='hint'>Tidak ditemukan.</p>";
  const sync = () => { const q = ($("#catQ").value || "").toLowerCase(), f = $("#catFilter .fbtn.active")?.dataset.f || "all"; render(GAMES.filter(g => (f === "all" || g.cat === f) && g.name.toLowerCase().includes(q))) };
  $("#catQ").addEventListener("input", sync);
  $$("#catFilter .fbtn").forEach(b => b.onclick = () => { $$("#catFilter .fbtn").forEach(x => x.classList.remove("active")); b.classList.add("active"); sync() });
  render(GAMES);
  if ($("#catRail")) $("#catRail").innerHTML = GAMES.filter(g => g.img).map(g => `<a class="rail-item" href="#detail" onclick="selectGame('${g.id}')"><img src="${g.img}" alt="${g.name}" width="132" height="99" loading="lazy"><b>${g.name}</b></a>`).join("");
  const pre = new URLSearchParams(location.search).get("game"); if (pre) selectGame(pre);
}
function selectGame(id) {
  const g = GAMES.find(x => x.id === id); if (!g) return;
  state.game = g; state.nom = 0; state.pay = 0;
  $("#dTitle").innerHTML = `${g.img ? `<img src="${g.img}" alt="" width="52" height="65" style="border-radius:13px;object-fit:cover;border:1px solid var(--line-2);vertical-align:middle;margin-right:12px">` : ""}<span style="vertical-align:middle">${g.name}</span>`;
  $("#dDesc").textContent = `${g.sold} • ${g.tag} • pengiriman otomatis`;
  $("#dNoms").innerHTML = g.noms.map((n, i) => `<button class="nom" data-i="${i}" aria-pressed="${i === 0}"><b>${n[0]}</b><span>${rupiah(n[1])}</span><small>✅ ready</small></button>`).join("");
  $("#dNoms").onclick = e => { const b = e.target.closest(".nom"); if (!b) return; state.nom = +b.dataset.i; $$("#dNoms .nom").forEach(x => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); syncDetail() };
  payList("#dPays", syncDetail);
  $("#dPromo").oninput = syncDetail;
  const ni = $("#dId");
  clearTimeout(ni._t); ni.oninput = () => { clearTimeout(ni._t); $("#nick").textContent = ""; ni._t = setTimeout(() => { if (ni.value.trim().length > 3) $("#nick").textContent = "✓ Nickname ditemukan: Player" + Math.floor(1000 + Math.random() * 9000) }, 900) };
  syncDetail();
  $("#detail")?.scrollIntoView({ behavior: "smooth" });
}
function syncDetail() { const { total } = calc(state.game.noms[state.nom][1], state.pay, ($("#dPromo") || {}).value); $("#dTotal").textContent = rupiah(total) }
function detailCheckout() {
  const id = $("#dId").value.trim(); if (id.length < 4) return toast("Isi User ID dengan benar 🎮");
  const [nom, price] = state.game.noms[state.nom], { fee, disc, total } = calc(price, state.pay, $("#dPromo").value);
  openInvoice({ game: state.game.name, img: state.game.img, item: nom, id, server: $("#dServer").value.trim() || "-", wa: $("#dWa").value.trim() || "-", pay: PAYS[state.pay][0], price, fee, disc, total });
}

/* ================= PPOB page ================= */
if ($("#ppobCatalog")) {
  const render = list => $("#ppobCatalog").innerHTML = list.map(p => ppobTile(p)).join("");
  render(PPOB);
  $$("#ppobFilter .fbtn").forEach(b => b.onclick = () => { $$("#ppobFilter .fbtn").forEach(x => x.classList.remove("active")); b.classList.add("active"); const f = b.dataset.f; render(PPOB.filter(p => f === "all" || p.cat === f)) });
  const rTx = $("#rTx"), rMg = $("#rMg"), upd = () => { vTx.textContent = rTx.value; vMg.textContent = rupiah(+rMg.value); $("#profit").textContent = rupiah(rTx.value * rMg.value * 30) };
  rTx.oninput = upd; rMg.oninput = upd; upd();
}
function buyPpob(id) {
  const p = PPOB.find(x => x.id === id); if (!p) return;
  const no = prompt(`Nomor/ID pelanggan untuk ${p.name}:`); if (!no) return;
  const price = p.denom ? p.denom[1][1] : p.from * 2;
  const { fee, total } = calc(price, 0);
  openInvoice({ game: p.name, item: p.denom ? p.denom[1][0] : "Tagihan", id: no, server: "-", pay: PAYS[0][0], price, fee, disc: 0, total });
}

/* ================= Invoice / payment ================= */
let currentTx = null, payTimer = null;
function openInvoice(d) {
  currentTx = { inv: "SP-" + Date.now().toString(36).toUpperCase().slice(-4) + Math.random().toString(36).slice(2, 6).toUpperCase(), date: new Date().toLocaleString("id-ID"), status: "Menunggu Pembayaran", ...d };
  let left = 30 * 60;
  $("#invoiceBox").innerHTML = `<h3>🧾 Supa Topup • ${currentTx.inv}</h3><table>
  <tr><td>Produk</td><td style="text-align:right"><b>${currentTx.game} — ${currentTx.item}</b></td></tr>
  <tr><td>ID / Nomor</td><td style="text-align:right">${currentTx.id}${currentTx.server !== "-" ? " (" + currentTx.server + ")" : ""}</td></tr>
  <tr><td>Metode</td><td style="text-align:right">${currentTx.pay}</td></tr>
  <tr><td>Harga</td><td style="text-align:right">${rupiah(currentTx.price)}</td></tr>
  <tr><td>Biaya layanan</td><td style="text-align:right">${rupiah(currentTx.fee)}</td></tr>
  ${currentTx.disc ? `<tr><td>Promo GAMER30</td><td style="text-align:right">−${rupiah(currentTx.disc)}</td></tr>` : ""}
  <tr><td><b>Total bayar</b></td><td style="text-align:right"><b>${rupiah(currentTx.total)}</b></td></tr></table>
  <div class="paybar"><span id="invTimer">⏳ 30:00</span><span>Scan QR / transfer lalu klik tombol di bawah</span></div>`;
  clearInterval(payTimer);
  payTimer = setInterval(() => { left--; const el = $("#invTimer"); if (!el) return clearInterval(payTimer); el.textContent = "⏳ " + String(Math.floor(left / 60)).padStart(2, 0) + ":" + String(left % 60).padStart(2, 0); if (left <= 0) { clearInterval(payTimer); el.textContent = "⛔ Kedaluwarsa — buat pesanan baru" } }, 1000);
  $("#checkoutModal").classList.add("open");
}
function payNow() {
  if (!currentTx || $("#invTimer")?.textContent.includes("Kedaluwarsa")) return toast("Masa bayar habis, buat pesanan baru ya 🙏");
  closeModal();
  currentTx.status = "Sukses";
  const h = store.get("sg_tx", []); h.unshift(currentTx); store.set("sg_tx", h);
  toast(`✅ ${currentTx.inv} terbayar — item dikirim (3 detik)`);
  renderHistory();
}

/* ================= Tracking ================= */
function renderHistory() {
  const tb = $("#historyBody"); if (!tb) return; const h = store.get("sg_tx", []);
  tb.innerHTML = h.length ? h.map(t => { const g = GAMES.find(x => x.name === t.game); return `<tr>
  <td><span class="kbd">${t.inv}</span></td>
  <td><div style="display:flex;gap:10px;align-items:center">${g?.img ? `<img src="${g.img}" alt="" width="36" height="45" loading="lazy">` : ""}<span>${t.game}<br><small class="hint">${t.item} • ${t.date}</small></span></div></td>
  <td>${t.id}</td><td><b>${rupiah(t.total)}</b></td>
  <td><span class="status ${t.status === "Sukses" ? "ok" : "pending"}">${t.status}</span></td>
  <td><button class="btn btn-ghost btn-sm" onclick="showTx('${t.inv}')">Detail</button></td></tr>` }).join("")
    : `<tr><td colspan="6" class="hint">Belum ada transaksi di perangkat ini. <a class="link" href="topup.html">Mulai top up →</a></td></tr>`;
}
function showTx(inv) {
  const t = store.get("sg_tx", []).find(x => x.inv === (inv || "").toUpperCase());
  if (!t) { $("#trackResult").innerHTML = `<p class="hint">❌ Invoice <b>${esc(inv)}</b> tidak ditemukan di perangkat ini. Coba demo: <button class="btn btn-sm" onclick="loadDemo()">muat data demo</button></p>`; return }
  const g = GAMES.find(x => x.name === t.game), ok = t.status === "Sukses";
  $("#trackResult").innerHTML = `<div class="panel"><div style="display:flex;gap:14px;align-items:center">${g?.img ? `<img src="${g.img}" alt="" width="64" height="80" style="border-radius:14px;object-fit:cover">` : ""}
  <div><h3 style="margin:0">${t.game} — ${t.item}</h3><p class="hint" style="margin:0">${t.inv} • ${t.date} • ID ${esc(t.id)} • ${t.pay} • <b style="color:var(--gold)">${rupiah(t.total)}</b></p></div></div>
  <ul class="timeline"><li class="done"><b>Pesanan dibuat</b><span>${t.date}</span></li>
  <li class="done"><b>Pembayaran terverifikasi</b><span>${t.pay}</span></li>
  <li class="${ok ? "done" : "now"}"><b>${ok ? "Item terkirim ⚡" : "Diproses sistem"}</b><span>${ok ? "Selesai — cek in-game. Simpan invoice untuk klaim garansi." : "Biasanya < 30 detik sejak bayar."}</span></li></ul>
  <p class="hint">Tidak menerima item? <a class="link" href="bantuan.html#refund">Klaim garansi refund →</a></p></div>`;
}
function loadDemo() {
  store.set("sg_tx", [{ inv: "SP-DEMO24", date: new Date().toLocaleString("id-ID"), status: "Sukses", game: "Mobile Legends", item: "86 💎", id: "12345678", server: "2201", pay: "QRIS ⚡", price: 19500, fee: 137, disc: 0, total: 19637 }, { inv: "SP-DEMO25", date: new Date().toLocaleString("id-ID"), status: "Diproses", game: "Token PLN", item: "50 rb", id: "37829104", server: "-", pay: "BCA Virtual Account", price: 50900, fee: 4000, disc: 0, total: 54900 }]);
  renderHistory(); $("#trackQ").value = "SP-DEMO24"; showTx("SP-DEMO24"); toast("Data demo dimuat 🧪");
}
function trackSearch(e) { e.preventDefault(); const q = $("#trackQ").value.trim().toUpperCase(); if (q) showTx(q); return false }
function clearHistory() { store.set("sg_tx", []); renderHistory(); toast("Riwayat dihapus") }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])) }
renderHistory();
if (location.hash.startsWith("#SP-")) showTx(location.hash.slice(1));

/* ================= Auth & misc ================= */
function authSubmit(e) {
  e.preventDefault();
  const u = { name: $("#aName").value.trim(), phone: $("#aPhone").value.trim(), reseller: $("#aReseller").checked, at: new Date().toISOString() };
  if (!/^0[0-9]{9,14}$/.test(u.phone)) return toast("Format nomor WhatsApp tidak valid");
  store.set("sg_user", u);
  $("#authInfo").textContent = `Halo ${u.name}! Akun ${u.reseller ? "Reseller ✅ (harga grosir aktif)" : "Member"} tersimpan lokal di perangkat ini.`;
  toast("Berhasil masuk sebagai " + u.name);
  $$(".nav-cta .btn-ghost").forEach(b => { b.textContent = "👤 " + u.name.split(" ")[0] });
  return false;
}
const su = store.get("sg_user", null);
if (su && $(".nav-cta .btn-ghost")) $(".nav-cta .btn-ghost").textContent = "👤 " + su.name.split(" ")[0];
function csSubmit(e) { e.preventDefault(); toast(`🎫 Tiket terkirim! CS balas ke ${$("#csName").value} via WA ±40 detik`); e.target.reset(); return false }
function newsSubmit(e) { e.preventDefault(); toast("Terdaftar! Cek email untuk kupon 5% 🎉"); e.target.reset(); return false }

/* service worker (production: cache shell + assets) */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { }));
}
