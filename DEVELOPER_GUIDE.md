# Developer Guide — Undangan Pernikahan Chandra & Listarina

Panduan ini berisi semua yang perlu diketahui untuk melanjutkan pengembangan proyek ini
menggunakan AI assistant (Cursor, Codex, Gemini, Claude, dll) tanpa harus menjelaskan
ulang dari awal.

---

## Stack Teknologi

| Layer | Teknologi | Versi |
|---|---|---|
| Frontend | React + Vite | 18 / 6 |
| Styling | Tailwind CSS | v3 (custom tokens) |
| Animasi | Framer Motion | 11 |
| State | Zustand | 5 |
| Routing | React Router | v6 (nested routes) |
| Icons | lucide-react | ✓ |
| Backend / DB | Supabase | PostgreSQL + Auth + Storage + Realtime |
| Hosting | Vercel | — |

---

## Struktur Folder

```
/
├── public/                              ← Aset statis yang di-serve langsung
│   ├── Music.mp3                        ← Musik latar (autoplay setelah "Buka Undangan")
│   ├── hero-916-1.jpg                   ← Hero slideshow — rasio 9:16 (mobile) x3
│   ├── hero-916-2.jpg
│   ├── hero-916-3.jpg
│   ├── hero-169-1.jpg                   ← Hero slideshow — rasio 16:9 (desktop) x3
│   ├── hero-169-2.jpg
│   ├── hero-169-3.jpg
│   ├── mempelai-chandra.jpg             ← Foto pengantin pria (CoupleSection)
│   ├── mempelai-listarina.jpg           ← Foto pengantin wanita (CoupleSection)
│   ├── gallery-DSC_4304.jpg             ← Foto galeri (9 foto fallback)
│   ├── gallery-DSC_4397.jpg
│   ├── gallery-DSC_4402.jpg
│   ├── gallery-DSC_4465.jpg
│   ├── gallery-DSC_4487.jpg
│   ├── gallery-DSC_4541.jpg
│   ├── gallery-DSC_4554.jpg
│   ├── gallery-DSC_4595.jpg
│   └── gallery-DSC_4605.jpg
│
├── src/
│   ├── App.jsx                          ← Root routing
│   ├── main.jsx
│   ├── index.css                        ← Tailwind directives + CSS vars
│   │
│   ├── pages/
│   │   └── InvitePage.jsx               ← Halaman utama undangan (10 sections)
│   │
│   ├── components/
│   │   ├── sections/
│   │   │   ├── HeroSection.jsx          ← S1: Hero fullscreen + slideshow + parallax
│   │   │   ├── GreetingSection.jsx      ← S2: Salam tamu (?to=NamaTamu)
│   │   │   ├── CoupleSection.jsx        ← S3: Profil kedua pengantin
│   │   │   ├── EventSection.jsx         ← S4: Jadwal + countdown + maps
│   │   │   ├── GallerySection.jsx       ← S5: Grid foto + lightbox
│   │   │   ├── RSVPSection.jsx          ← S6: Form konfirmasi kehadiran
│   │   │   ├── CommentSection.jsx       ← S7: Ucapan + realtime
│   │   │   ├── GiftSection.jsx          ← S8: Info rekening bank
│   │   │   ├── ShareSection.jsx         ← S9: Tombol bagikan (WA/FB/IG)
│   │   │   └── ClosingSection.jsx       ← S10: Ayat penutup + credit Instagram
│   │   │
│   │   └── ui/
│   │       ├── AnimatedSection.jsx      ← Framer Motion scroll-reveal wrapper
│   │       ├── CountdownTimer.jsx       ← Hitung mundur ke tanggal nikah
│   │       ├── GoldDivider.jsx          ← Ornamen pemisah emas
│   │       ├── PhotoLightbox.jsx        ← Modal preview foto galeri
│   │       ├── CopyButton.jsx           ← Salin nomor rekening
│   │       └── MusicToggle.jsx          ← Play/Pause + slider volume (fixed bottom-right)
│   │
│   ├── admin/
│   │   ├── AdminLogin.jsx               ← /admin/login (form email+password)
│   │   ├── AdminLayout.jsx              ← Shell admin: sidebar + <Outlet />
│   │   ├── AdminDashboard.jsx           ← /admin (ringkasan)
│   │   ├── ProtectedRoute.jsx           ← Guard: redirect ke login jika belum auth
│   │   └── pages/
│   │       ├── RSVPViewer.jsx           ← /admin/rsvp
│   │       ├── CommentModerator.jsx     ← /admin/komentar
│   │       ├── GalleryManager.jsx       ← /admin/galeri
│   │       └── AccountEditor.jsx        ← /admin/rekening
│   │
│   ├── hooks/
│   │   ├── useSupabaseConfig.js         ← Fetch config + deep merge dengan fallback
│   │   ├── useRealtimeComments.js       ← Subscribe realtime komentar
│   │   └── useAuth.js                   ← Supabase Auth session listener
│   │
│   ├── lib/
│   │   ├── supabase.js                  ← createClient (crash-safe: ada placeholder fallback)
│   │   └── storageUpload.js             ← Helper upload ke Supabase Storage
│   │
│   ├── store/
│   │   └── useStore.js                  ← Zustand (config, user, isMusicPlaying)
│   │
│   └── config/
│       └── wedding.fallback.json        ← Data & foto fallback jika Supabase offline
│
├── index.html                           ← Entry point, Google Fonts di sini
├── vite.config.js                       ← Build config + manual chunk split
├── tailwind.config.js                   ← Custom color tokens + fonts
├── vercel.json                          ← SPA rewrite rule (WAJIB ada)
├── .env.local                           ← Env vars lokal (TIDAK di-commit)
└── .gitignore
```

---

## Environment Variables

File `.env.local` (tidak masuk Git, sudah ada di lokal):

```
VITE_SUPABASE_URL=https://rqilmzgztmljnvnwvmth.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

> **Crash-safe**: `src/lib/supabase.js` sudah menggunakan placeholder fallback jika env
> vars tidak ada, sehingga build/dev tidak crash saat `.env.local` belum dibuat.

Di Vercel, variabel ini sudah di-set di dashboard project → Settings → Environment Variables.
Jika deploy ulang ke project Vercel yang sama, env vars tidak perlu diubah.

---

## Supabase

**Project ID:** `rqilmzgztmljnvnwvmth`
**URL:** `https://rqilmzgztmljnvnwvmth.supabase.co`

### Tabel Database

#### `config`
Key-value JSON untuk semua konfigurasi website.

| key | Isi `value` (JSONB) |
|---|---|
| `couple` | `{ groom: { fullName, nickname, fatherName, motherName, photoUrl }, bride: {...} }` |
| `event` | `{ akad: { date, time, venue, address, mapsUrl }, resepsi: {...} }` |
| `closing_quote` | `{ text, source }` |
| `music` | `{ enabled: bool, url: string }` |
| `rsvp_enabled` | `{ value: bool }` |
| `heroImageUrl` | `"https://..."` (opsional, tidak dipakai slideshow) |

#### `rsvp`
| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `name` | text |
| `attendance` | text (`hadir` / `tidak_hadir`) |
| `guest_count` | int |
| `message` | text |
| `created_at` | timestamptz |

#### `comments`
| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `name` | text |
| `message` | text |
| `is_visible` | bool (default true) |
| `created_at` | timestamptz |

> **Realtime aktif**: sudah di-add ke `supabase_realtime` publication.
> Jika tabel ini pernah di-drop+recreate, jalankan:
> ```sql
> ALTER publication supabase_realtime ADD TABLE comments;
> ```

#### `bank_accounts`
| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `bank_name` | text |
| `account_name` | text |
| `account_number` | text |
| `logo_url` | text |
| `sort_order` | int |

#### `gallery`
| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `image_url` | text (URL publik Supabase Storage) |
| `caption` | text |
| `sort_order` | int |

> Jika tabel `gallery` kosong, GallerySection otomatis pakai 9 foto lokal dari `public/`.

### Storage Buckets (semua public)
| Bucket | Kegunaan |
|---|---|
| `avatars` | Foto profil pengantin |
| `gallery` | Foto galeri (alternatif upload via admin) |
| `music` | File audio latar (alternatif hosting) |

### RLS (Row Level Security)
- `config`, `bank_accounts`, `gallery`: **public read**, auth write
- `rsvp`: **public insert**, auth read
- `comments`: **public read** (is_visible=true), **public insert**, auth full

---

## Alur Data: Config

```
src/config/wedding.fallback.json   ← initial state (instant, offline-safe)
           ↓
  useSupabaseConfig hook
           ↓ deepMerge()
  Supabase tabel `config`          ← override runtime (hanya nilai non-empty)
           ↓
  prop `config` ke setiap section
```

### Deep Merge (penting!)
`useSupabaseConfig.js` menggunakan `deepMerge()` — jika Supabase mengirim string kosong
(`""`), `null`, atau `undefined`, nilai **fallback JSON tetap dipertahankan**.
Ini mencegah foto pengantin hilang jika kolom `photoUrl` di Supabase kosong.

---

## Fitur Utama & Cara Kerjanya

### 1. Hero Slideshow
- **File:** `src/components/sections/HeroSection.jsx`
- 6 foto di `public/`: `hero-916-{1,2,3}.jpg` (mobile 9:16) dan `hero-169-{1,2,3}.jpg` (desktop 16:9)
- Deteksi rasio layar via `window.innerWidth < 768` + resize listener
- Ganti foto setiap **3.5 detik** dengan fade transition (Framer Motion `AnimatePresence`)
- Parallax scroll via `useScroll` + `useTransform`
- **Untuk ganti foto hero:** replace file di `public/` dengan nama yang sama

### 2. Musik Otomatis
- **File:** `src/components/ui/MusicToggle.jsx`, `src/pages/InvitePage.jsx`
- Musik di `public/Music.mp3`, auto-play saat tamu klik "Buka Undangan"
- `InvitePage` pass `autoPlay={opened}` ke `MusicToggle`
- `MusicToggle` mempunyai tombol Play/Pause dan slider volume (Lucide icons)
- Auto-play mungkin diblokir browser — tamu tetap bisa klik manual
- **Untuk ganti musik:** replace `public/Music.mp3`

### 3. Buka Undangan + Auto Scroll
- **File:** `src/pages/InvitePage.jsx`
- Semua section di bawah hero hanya di-render setelah `opened = true`
- Setelah render, `scrollIntoView({ behavior: 'smooth' })` dipanggil via `setTimeout 50ms`
  (delay diperlukan agar DOM sempat mount sebelum scroll)
- `musicUrl` selalu fallback ke `/Music.mp3` agar musik bisa jalan tanpa Supabase config

### 4. Galeri Foto
- **File:** `src/components/sections/GallerySection.jsx`
- Prioritas: data dari tabel Supabase `gallery` → jika kosong, pakai 9 foto lokal di `public/`
- Grid 2 kolom (mobile) / 3 kolom (desktop), dengan lightbox (`PhotoLightbox.jsx`)
- **Untuk tambah foto:** upload ke `public/` lalu tambah entry di `FALLBACK_PHOTOS`,
  **atau** upload via `/admin/galeri` ke Supabase Storage

### 5. Credit Footer
- **File:** `src/components/sections/ClosingSection.jsx`
- Link Instagram `@lekomese_studio` → `https://www.instagram.com/lekomese/`

---

## Cara Update Data Pernikahan

### Via Admin Dashboard
`https://undangan-candra-pongsinaran.vercel.app/admin/login` → login → edit.

### Via SQL Langsung
```sql
-- Update nama pengantin
UPDATE config
SET value = '{
  "groom": { "fullName": "...", "nickname": "...", "fatherName": "...", "motherName": "...", "photoUrl": "" },
  "bride":  { "fullName": "...", "nickname": "...", "fatherName": "...", "motherName": "...", "photoUrl": "" }
}'::jsonb
WHERE key = 'couple';

-- Update tanggal & venue
UPDATE config
SET value = '{
  "akad":    { "date": "YYYY-MM-DD", "time": "HH:MM", "venue": "...", "address": "...", "mapsUrl": "..." },
  "resepsi": { "date": "YYYY-MM-DD", "time": "HH:MM", "venue": "...", "address": "...", "mapsUrl": "..." }
}'::jsonb
WHERE key = 'event';
```

> Setelah update SQL, **selalu sync juga** `src/config/wedding.fallback.json`.

---

## Workflow Development Lokal

```bash
# Install dependencies (hanya pertama kali)
npm install

# Jalankan dev server
npm run dev
# → http://localhost:5173/invite
# → http://localhost:5173/invite?to=NamaTamu  (undangan personal)
# → http://localhost:5173/admin/login          (admin)
```

---

## Workflow Deploy ke Vercel

```bash
# 1. Pastikan build bersih
npm run build

# 2. Deploy ke production
vercel deploy --prod
```

**Production URL:** `https://undangan-candra-pongsinaran.vercel.app`

> `vercel.json` berisi rewrite rule SPA — **jangan hapus file ini**. Tanpanya semua
> route selain `/` akan mengembalikan 404 di Vercel.

---

## Routing

```
/                    → redirect ke /invite
/invite              → Halaman undangan utama
/invite?to=NamaTamu  → Undangan dengan salam personal
/admin/login         → Login admin
/admin               → Dashboard admin (protected)
/admin/rsvp          → Lihat data RSVP
/admin/komentar      → Moderasi komentar
/admin/galeri        → Kelola foto galeri
/admin/rekening      → Kelola rekening bank
```

---

## Custom Tailwind Tokens

| Token | Hex | Kegunaan |
|---|---|---|
| `gold` | `#C9A84C` | Aksen utama, border, judul |
| `gold-light` | `#E8D08A` | Hover state, highlight |
| `cream` | `#FAF6EF` | Background utama |
| `ivory` | `#F2EDE3` | Background card |
| `charcoal` | `#2C2C2C` | Teks utama |
| `muted` | `#8A7F72` | Teks sekunder, label |

Font: `font-display` = Cormorant Garamond (heading), `font-body` = DM Sans (body).

---

## Hal Penting & Jebakan Umum

1. **`vercel.json` wajib ada** — tanpa ini semua route SPA akan 404 di Vercel.

2. **`.env.local` tidak di-commit** — jika clone ulang repo, buat file baru dengan isi:
   ```
   VITE_SUPABASE_URL=https://rqilmzgztmljnvnwvmth.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key dari Supabase dashboard>
   ```

3. **Deep merge config** — `useSupabaseConfig` sengaja mengabaikan nilai kosong dari Supabase
   agar foto lokal di fallback JSON tidak tertimpa string kosong.

4. **Foto pengantin** — `photoUrl` di fallback JSON menunjuk ke `/mempelai-chandra.jpg` dan
   `/mempelai-listarina.jpg` di folder `public/`. Jika ingin ganti foto, replace file tersebut.

5. **Auto-play musik** — beberapa browser memblokir auto-play sebelum ada interaksi user.
   Musik baru jalan setelah tamu klik "Buka Undangan" (yang dihitung sebagai interaksi).

6. **Realtime comments** — jika tabel `comments` pernah di-drop & dibuat ulang:
   ```sql
   ALTER publication supabase_realtime ADD TABLE comments;
   ```

7. **Admin auth** — menggunakan Supabase Auth (email+password). Akun dikelola di
   Supabase Dashboard → Authentication → Users. Tidak ada registrasi publik.

8. **EventSection label** — "Akad Nikah" sudah diganti menjadi **"Pemberkatan"** sesuai
   tradisi GMIT. Lihat `EventCard` di `EventSection.jsx`.

---

## Data Pernikahan Aktual

Sumber kebenaran: Supabase tabel `config` + `bank_accounts`.
Fallback lokal: `src/config/wedding.fallback.json`.

| Data | Nilai |
|---|---|
| Pengantin Pria | Chandra W. D. T. Pongsinaran, ST |
| Orang Tua Pria | Bapak Tomy Pongsinaran & Ibu Lily Ondang |
| Pengantin Wanita | Listarina Mbura, S.Pd |
| Orang Tua Wanita | Bapak Paulus Mbura & Ibu Sarline Sine |
| Tanggal | Jumat, 01 Mei 2026 |
| Pemberkatan | 16.00 WITA — Gereja GMIT Zaitun Tuapukan, Jln. Timor Raya Km. 24, Tuapukan |
| Resepsi | 18.00 WITA — Kediaman Bapak Paulus Mbura, Jln. Timor Raya Km. 24, Tuapukan |
| Rekening 1 | BNI — Listarina Mbura — `897309629` |
| Rekening 2 | BNI — Chandra William — `1886238915` |
| Ayat Penutup | Matius 19:6 |
| Fotografer | @lekomese_studio (Instagram) |

---

## Riwayat Perubahan Signifikan

| Commit | Perubahan |
|---|---|
| `Initial commit` | Scaffolding lengkap: 10 sections, admin dashboard, Supabase integration |
| `aee95d7` | Fix realtime + React Router v7 warnings |
| `eff7533` | Fix 404 Vercel: tambah `vercel.json` + aktifkan Supabase Realtime |
| `8d19a13` | **Hero slideshow** (6 foto responsif), **musik autoplay** (lucide-react), footer credit |
| `32f851c` | Foto mempelai asli (`/mempelai-chandra.jpg`, `/mempelai-listarina.jpg`) |
| `6e82269` | **Deep merge config**, galeri 9 foto lokal, nama ayah: Tomy |
| `10527c1` | Label "Akad Nikah" → "Pemberkatan" |
