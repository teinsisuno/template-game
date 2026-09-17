# Supa Topup — Game Topup & PPOB

Production-ready static front-end untuk platform PPOB dengan fokus utama **top up game instan**.
Vanilla HTML/CSS/JS + **Three.js** (ESM via CDN, version pin) — tanpa build step.

## Struktur
```
├── index.html      Beranda: hero 3D, top-up cepat, top-5 chart, katalog, PPOB, flash sale
├── topup.html      Katalog game, filter/search, form order + cek nickname, invoice modal
├── produk.html     Katalog PPOB, kalkulator margin reseller, tabel harga grosir
├── lacak.html      Tracking invoice + timeline status + riwayat lokal
├── bantuan.html    Help center: FAQ, pembayaran, refund, uptime, kontak/tiket CS
├── auth.html       Masuk/daftar member & reseller (split layout)
├── 404.html        Halaman error kustom
├── css/style.css   Design system premium (tokens, glassmorphism, responsif, print)
├── js/data.js      Sumber data tunggal (game, PPOB, metode bayar, fee)
├── js/main.js      UI logic: katalog, order, invoice+timer, tracking, auth, PWA
├── js/fx.js        Three.js: kartu game 3D melayang + partikel (fallback otomatis)
├── img/            Aset JPG kover game (1080×1350)
├── sw.js           Service worker (network-first HTML, cache-first aset)
├── manifest.webmanifest  PWA manifest
├── sitemap.xml / robots.txt / .htaccess
```

## Menjalankan lokal
```bash
python -m http.server 8000     # atau: npx serve .
# buka http://localhost:8000
```
> ⚠️ Jangan dibuka via `file://` — modul ES (Three.js importmap) dan tekstur WebGL butuh origin HTTP.

## Catatan Three.js
- Diimpor via **import map** dari `cdn.jsdelivr.net/npm/three@0.169.0` (pinned).
- `js/fx.js` membangun: kartu kover game bertekstur (`CanvasTexture` + `SRGBColorSpace`, rounded-rect via canvas), partikel additive, glow backdrop, parallax pointer, `FogExp2`.
- Fallback berjenjang: `prefers-reduced-motion` / WebGL gagal / CDN mati → `html.fx-static` menampilkan kolase CSS statis.
- Performa: DPR clamp ≤1.8, jumlah kartu dikurangi di layar kecil, render loop pause saat tab hidden.

## Integrasi backend (langkah produksi)
Semua state transaksi demo ada di `localStorage` (`sg_tx`). Titik integrasi:
| Fungsi | File | Ganti dengan |
|---|---|---|
| `quickCheckout()` / `detailCheckout()` | js/main.js | `POST /api/orders` (nomor WA, ID, produk) |
| `openInvoice()` | js/main.js | render QRIS/VA dari payment gateway (Midtrans/Xendit) |
| `payNow()` | js/main.js | webhook `transaction.settled` + SSE/polling status |
| `showTx()` | js/main.js | `GET /api/orders/:invoice` |
| `authSubmit()` | js/main.js | OTP/SMS + sesi JWT (httpOnly cookie) |
| `window.SUPA` | js/data.js | `GET /api/catalog` + sinkronisasi harga publisher |

Keamanan sisi server wajib: rate limit, validasi ID ke provider sebelum bayar, idempotency key, rekonsiliasi harian, audit log.

## Aset gambar
Kover game (11 JPG @1080×1350) diambil dari storage **gachaku.com** atas izin pemilik brand/developer situs tersebut (pemilik proyek ini). Aset merupakan key-art resmi penerbit game — untuk komersial penuh, gunakan `storage admin` milik sendiri atau CDN lisensi resmi publisher.

## Deployment
- **Apache**: `.htaccess` sudah berisi kompresi, cache, security headers, ErrorDocument 404. CSP dikomentari — sesuaikan bila perlu.
- **Nginx**: aktifkan gzip/brotli, `expires` untuk `img/`, `js/`, `css/`; fallback `try_files ... /404.html`.
- **Netlify/Vercel**: nol konfigurasi; deploy direktori ini apa adanya.
- HTTPS wajib agar **service worker (PWA)** aktif; instalable dari menu browser.

## Checklis QA yang sudah diverifikasi
- `node --check` lulus untuk `data.js`, `main.js`, `sw.js`, `fx.js` (ESM)
- Semua halaman & aset merespons 200 di server lokal
- Validasi form (regex ID, WA, PIN), XSS-escaping input tracking (`esc()`)
- A11y: skip-link, aria-pressed pada chip/nominal/bayar, aria-live toast, focus-visible, label form
- Performa: `loading="lazy"`, width/height di `<img>` (CLS), preconnect font, font `display=swap`
