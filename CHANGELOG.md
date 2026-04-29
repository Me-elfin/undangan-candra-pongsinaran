# Changelog — Undangan Pernikahan Chandra & Listarina

Semua perubahan signifikan dicatat di sini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.4.0] — 2026-04-30

### Changed
- **Animasi Global** — memperlambat durasi animasi *fade/slide* dari 0.7s menjadi 1.3s agar transisi halaman lebih halus dan elegan.
- **Transisi Scroll** — mengganti *native scroll* pada tombol "Buka Undangan" di `HeroSection` menjadi animasi *custom ease-in-out* berdurasi 1.5 detik.
- **CoupleSection** — memperbesar teks nama lengkap pengantin pria dan wanita sebesar 2pt (`text-[16.6px]`).
- **GreetingSection** — mengganti *background* gambar statis menjadi *background* video kompresi (`BgGreetingSection.mp4`) khusus pada *mobile view* dengan efek *sticky* 100svh.
- **GallerySection** — memisahkan layout *mobile* dan *desktop*. Khusus untuk *mobile view*, menggunakan *custom masonry collage layout* dengan proporsi *aspect ratio* yang rapi (menggunakan file `gambar 1.jpg` s/d `gambar 9.jpg` dari direktori aset lokal), namun tetap memuat aset foto aslinya saat *lightbox* terbuka.

---

## [1.3.0] — 2026-04-29

### Fixed
- Label **"Akad Nikah"** diganti menjadi **"Pemberkatan"** pada `EventSection`
  agar sesuai dengan terminologi gereja GMIT (`10527c1`)

---

## [1.2.0] — 2026-04-29

### Fixed
- **Foto pengantin tidak tampil** — `useSupabaseConfig` kini menggunakan `deepMerge()`
  sehingga nilai kosong dari Supabase tidak menimpa foto lokal di fallback JSON
- **Nama ayah pengantin pria** dikoreksi: *Tony* → **Tomy** Pongsinaran

### Changed
- Galeri diperkecil dari 20 menjadi **9 foto** sesuai pilihan klien
- 9 foto galeri asli (`DSC_4304` s/d `DSC_4605`) disimpan di `public/` sebagai fallback lokal

### Added
- `deepMerge()` di `src/hooks/useSupabaseConfig.js` — merge bertingkat yang
  mengabaikan nilai `""` / `null` / `undefined` dari Supabase (`6e82269`)

---

## [1.1.0] — 2026-04-29

### Added
- **Foto mempelai asli** — `public/mempelai-chandra.jpg` dan `public/mempelai-listarina.jpg`
  menggantikan placeholder Unsplash di `CoupleSection` (`32f851c`)

---

## [1.0.0] — 2026-04-29

### Added
- 🎵 **Musik latar otomatis** — `public/Music.mp3` diputar otomatis setelah tamu
  klik "Buka Undangan" (memenuhi syarat interaksi browser)
- **Kontrol musik** di pojok kanan bawah: tombol Play/Pause + slider volume
  menggunakan ikon dari `lucide-react`
- 🖼️ **Hero slideshow responsif** — 3 foto 9:16 untuk mobile (`hero-916-{1,2,3}.jpg`)
  dan 3 foto 16:9 untuk desktop (`hero-169-{1,2,3}.jpg`); ganti slide setiap 3,5 detik
  dengan fade transition via Framer Motion `AnimatePresence`
- **Credit footer** — link Instagram `@lekomese_studio` di `ClosingSection`
- **Supabase crash-safe** — `src/lib/supabase.js` menggunakan placeholder fallback
  jika `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` belum tersedia (`8d19a13`)

---

## [0.3.0] — 2026-04-29

### Fixed
- **Vercel 404 pada semua route** — tambah `vercel.json` dengan rewrite rule SPA
  sehingga `/invite`, `/admin`, dll tidak lagi mengembalikan 404 (`eff7533`)
- **Realtime komentar** — aktifkan tabel `comments` di `supabase_realtime` publication
  via `ALTER publication supabase_realtime ADD TABLE comments`
- **Realtime error handling** — tambah handler `(status, err)` di `.subscribe()` agar
  error koneksi tidak memunculkan uncaught rejection

### Fixed
- React Router v7 deprecation warnings — tambah flag `future` di `BrowserRouter`:
  `v7_startTransition` dan `v7_relativeSplatPath` (`aee95d7`)

---

## [0.2.0] — 2026-04-29

### Changed
- Tambah `.vercel` ke `.gitignore` agar folder konfigurasi Vercel CLI tidak ikut di-commit
  (`383ce54`)

---

## [0.1.0] — 2026-04-29

### Added
- **Initial release** — website undangan pernikahan digital lengkap (`46cddfb`)

#### Halaman Undangan (`/invite`)
- **S1 HeroSection** — hero fullscreen dengan parallax scroll, nama pengantin, tanggal,
  tombol "Buka Undangan" (section di bawah hanya di-render setelah diklik)
- **S2 GreetingSection** — salam personal via query param `?to=NamaTamu`
- **S3 CoupleSection** — profil foto + nama lengkap + nama orang tua kedua pengantin
- **S4 EventSection** — kartu Pemberkatan & Resepsi, hitung mundur (`CountdownTimer`),
  tombol Google Maps
- **S5 GallerySection** — grid foto 2–3 kolom dengan lightbox (`PhotoLightbox`)
- **S6 RSVPSection** — form konfirmasi kehadiran → `INSERT` ke tabel `rsvp` Supabase
- **S7 CommentSection** — form ucapan + daftar komentar realtime via `useRealtimeComments`
- **S8 GiftSection** — kartu rekening bank dengan tombol salin (`CopyButton`)
- **S9 ShareSection** — tombol bagikan via WhatsApp, Facebook, Instagram, copy link
- **S10 ClosingSection** — ayat penutup (Matius 19:6), nama pengantin, tanggal

#### Admin Dashboard (`/admin`)
- Login dengan Supabase Auth (email + password) — `ProtectedRoute` guard
- **RSVP Viewer** — tabel data tamu yang mengkonfirmasi kehadiran
- **Comment Moderator** — toggle visibilitas komentar tamu
- **Gallery Manager** — upload foto ke Supabase Storage, hapus foto
- **Account Editor** — CRUD rekening bank tujuan hadiah

#### Infrastruktur
- React 18 + Vite 6 + Tailwind CSS v3 (token: `gold`, `cream`, `ivory`, `charcoal`, `muted`)
- Framer Motion: parallax, scroll-reveal (`AnimatedSection`), stagger galeri
- Zustand store: `isMusicPlaying`, `config`, `user`
- Supabase: 5 tabel (`config`, `rsvp`, `comments`, `bank_accounts`, `gallery`),
  3 storage bucket (`avatars`, `gallery`, `music`), RLS policies
- Vercel deploy dengan env vars `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- Google Fonts: Cormorant Garamond (`font-display`) + DM Sans (`font-body`)
