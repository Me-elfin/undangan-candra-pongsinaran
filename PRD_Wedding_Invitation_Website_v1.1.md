# PRD — Wedding Invitation Website
**Project Type:** Web Application  
**Stack:** React + Tailwind CSS + Supabase  
**Versi Dokumen:** 1.2 (Updated — Hosting: Vercel)  
**Dibuat oleh:** Elfinus Paulereno (via Claude)  
**Tanggal:** April 2026

---

## Changelog
| Versi | Perubahan |
|---|---|
| v1.0 | Initial PRD — Google Sheets sebagai database |
| v1.1 | **Migrasi database ke Supabase** — RSVP, komentar, config, auth, storage semuanya via Supabase |
| v1.2 | **Hosting dikunci ke Vercel** — CI/CD dari GitHub, env vars di Vercel dashboard |

---

## 1. Overview & Tujuan Produk

Website undangan pernikahan digital berbasis React yang menggabungkan pengalaman visual premium (elegant & mewah) dengan fungsionalitas modern — mencakup manajemen konten via dashboard admin, RSVP & komentar berbasis **Supabase (PostgreSQL + Realtime)**, serta animasi scroll parallax yang refined.

**Target Pengguna:**
- **Tamu undangan** — mengakses link undangan personal dari HP/desktop
- **Admin (pengantin/keluarga)** — mengelola konten via dashboard tanpa coding

**Nilai Utama:**
- Menggantikan undangan fisik dengan pengalaman digital yang berkesan
- Data tamu (RSVP, komentar) tersimpan di database PostgreSQL via Supabase
- Komentar tampil **realtime** tanpa refresh (Supabase Realtime subscriptions)
- Konten bisa diupdate kapan saja via admin dashboard
- Foto pengantin/galeri disimpan di **Supabase Storage**

---

## 2. Tech Stack & Arsitektur

| Layer | Pilihan | Keterangan |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev server, HMR |
| Styling | Tailwind CSS v3 | Utility-first, custom design tokens |
| Animation | Framer Motion | Parallax + reveal animation |
| Routing | React Router v6 | `/invite`, `/admin` |
| State | Zustand | Global state untuk config + auth session |
| **Database** | **Supabase (PostgreSQL)** | RSVP, komentar, config konten |
| **Auth** | **Supabase Auth** | Email/password login untuk admin |
| **Storage** | **Supabase Storage** | Upload foto pengantin & galeri |
| **Realtime** | **Supabase Realtime** | Komentar baru muncul live |
| Font | Google Fonts (Cormorant Garamond + DM Sans) | Serif display + clean body |
| **Hosting** | **Vercel** | CI/CD otomatis dari GitHub, preview deployments, custom domain |

**Catatan Arsitektur:**
- Supabase menggantikan peran Google Sheets, Apps Script, Google OAuth, dan Cloudinary sekaligus
- Tidak ada backend custom — semua lewat Supabase client SDK langsung dari React
- Environment variables: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`

---

## 3. Fitur & Scope

### 3.1 Halaman Utama — `/invite?to=NamaTamu`

**Urutan Section (scroll dari atas ke bawah):**

#### S1 — Hero / Opening
- Full-screen background foto pengantin (dengan overlay gradient emas)
- Nama pengantin (animasi reveal + typewriter subtle)
- Tanggal pernikahan
- Tombol "Buka Undangan" → trigger animasi cinematic ke section berikutnya
- Musik autoplay (opsional, dengan toggle mute)

#### S2 — Greeting / Salutation
- Teks "Kepada Yth." + nama tamu (diambil dari URL query `?to=NamaTamu`)
- Body copy undangan formal
- *Animasi: fade-in saat scroll masuk viewport*

#### S3 — Pengantin (The Couple)
- Dua kolom: foto + profil singkat pengantin pria & wanita
- Nama lengkap, nama panggilan, nama orang tua
- *Animasi: slide-in dari kiri & kanan*

#### S4 — Acara (Event Details)
- Card untuk Akad Nikah & Resepsi
- Ikon, tanggal, jam, lokasi
- Tombol "Lihat di Google Maps" (buka Maps di tab baru)
- Countdown timer (hari/jam/menit/detik menuju hari H)
- *Animasi: parallax background + card reveal*

#### S5 — Galeri Foto
- Grid foto prewedding / keluarga (4–8 foto)
- URL foto dari **Supabase Storage** public bucket
- Lightbox saat foto diklik
- *Animasi: masonry stagger reveal saat scroll*

#### S6 — RSVP
- Form: nama, nomor HP, kehadiran (Hadir/Tidak Hadir), jumlah tamu
- Submit → **INSERT ke tabel `rsvp` via Supabase client**
- Feedback sukses/gagal
- *Animasi: form fade-in + subtle gold border focus state*

#### S7 — Komentar & Doa Restu
- Form: nama + pesan
- Submit → **INSERT ke tabel `comments` via Supabase client**
- List komentar tampil **realtime** via `supabase.channel().on('postgres_changes')`
- *Animasi: comment card slide-up*

#### S8 — Amplop Digital (Rekening)
- Judul: "Hadiah & Doa"
- Copy teks yang sopan (opsional, bisa dimatikan di config)
- Card rekening: logo bank, nama pemilik, nomor rekening
- Tombol "Salin Nomor Rekening" (copy to clipboard)
- Bisa lebih dari 1 rekening (data dari tabel `bank_accounts`)

#### S9 — Share
- Tombol share: Facebook, Instagram (copy link), WhatsApp
- Copy link personal undangan ke clipboard
- *Animasi: icon bounce-in*

#### S10 — Penutup / Footer
- Kutipan cinta / ayat Alkitab / puisi pendek (dari tabel `config`)
- Nama pengantin
- Tanggal

---

### 3.2 Dashboard Admin — `/admin`

**Auth:** Supabase Auth (email + password)  
**Proteksi route:** Cek session aktif di Supabase, redirect ke `/admin/login` jika tidak ada

**Fitur Admin:**

| Modul | Deskripsi | Tabel/Bucket Terkait |
|---|---|---|
| **Profil Pengantin** | Edit nama, foto, bio singkat, nama orang tua | `config`, `storage/avatars` |
| **Detail Acara** | Edit tanggal, jam, lokasi akad & resepsi, link Maps | `config` |
| **Galeri** | Upload / hapus foto galeri | `gallery`, `storage/gallery` |
| **Rekening** | Tambah / edit / hapus nomor rekening | `bank_accounts` |
| **Kutipan Penutup** | Edit teks penutup | `config` |
| **Pengaturan Musik** | Toggle on/off, URL file musik | `config` |
| **RSVP List** | Lihat, filter, export daftar tamu RSVP | `rsvp` |
| **Komentar** | Lihat + moderasi (toggle visible/hidden) | `comments` |
| **Preview** | Tombol preview langsung ke halaman undangan | — |

---

### 3.3 Supabase Integration

#### 3.3.1 Database Schema

```sql
-- Konfigurasi konten undangan
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data RSVP tamu
CREATE TABLE rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  hp TEXT,
  hadir BOOLEAN NOT NULL,
  jumlah_tamu INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Komentar & doa restu
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  pesan TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rekening bank pengantin
CREATE TABLE bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Galeri foto
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,      -- URL dari Supabase Storage
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.3.2 Row Level Security (RLS)

```sql
-- config: public read, admin only write
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read config" ON config FOR SELECT USING (true);
CREATE POLICY "Admin write config" ON config FOR ALL USING (auth.role() = 'authenticated');

-- rsvp: public insert, admin only read
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert rsvp" ON rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read rsvp" ON rsvp FOR SELECT USING (auth.role() = 'authenticated');

-- comments: public insert + read (visible only), admin full access
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible comments" ON comments FOR SELECT USING (is_visible = true);
CREATE POLICY "Public insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access comments" ON comments FOR ALL USING (auth.role() = 'authenticated');

-- bank_accounts & gallery: public read, admin write
-- (sama pola dengan config)
```

#### 3.3.3 Supabase Storage Buckets

| Bucket | Akses | Isi |
|---|---|---|
| `avatars` | Public | Foto profil pengantin |
| `gallery` | Public | Foto galeri prewedding |
| `music` | Public | File audio background musik |

#### 3.3.4 Realtime — Komentar Live

```javascript
// useRealtimeComments.js
const channel = supabase
  .channel('comments-live')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'comments',
    filter: 'is_visible=eq.true'
  }, (payload) => {
    setComments(prev => [payload.new, ...prev])
  })
  .subscribe()
```

#### 3.3.5 Config Key Convention

Tabel `config` menyimpan semua data konten undangan dengan pola key-value JSON:

| Key | Value (JSONB) | Keterangan |
|---|---|---|
| `couple` | `{ groom: {...}, bride: {...} }` | Profil pengantin |
| `event` | `{ akad: {...}, resepsi: {...} }` | Detail acara |
| `closing_quote` | `{ text: "...", source: "..." }` | Kutipan penutup |
| `music` | `{ enabled: true, url: "..." }` | Pengaturan musik |
| `rsvp_enabled` | `{ value: true }` | Toggle form RSVP |

---

## 4. Desain Visual

### 4.1 Design Language: *"Gilded Romance"*
> Aesthetic arah: **Elegant & Mewah** — terinspirasi dari editorial wedding magazine high-end. Serif typography, palet emas–krim–putih gading, ornamen halus, spacing luas.

### 4.2 Color Palette

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-gold` | `#C9A84C` | Aksen utama, border, highlight |
| `--color-gold-light` | `#E8D08A` | Gradient, hover state |
| `--color-cream` | `#FAF6EF` | Background utama |
| `--color-ivory` | `#F2EDE3` | Card background |
| `--color-charcoal` | `#2C2C2C` | Teks utama |
| `--color-muted` | `#8A7F72` | Teks sekunder |
| `--color-white` | `#FFFFFF` | Kontras pada dark section |

### 4.3 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Nama Pengantin | Cormorant Garamond | 300–700 | 48–96px |
| Heading Section | Cormorant Garamond | 600 | 32–48px |
| Body Copy | DM Sans | 400 | 16–18px |
| Label / Caption | DM Sans | 300 | 12–14px |
| Ornamen Dekoratif | Cormorant Garamond Italic | 300 | Variable |

### 4.4 Animasi (Framer Motion)

| Tipe | Implementasi | Section |
|---|---|---|
| **Fade + Slide Up** | `initial: opacity 0, y 40` → `animate: opacity 1, y 0` | S2, S6, S7 |
| **Slide Horizontal** | `x: -60` / `x: 60` → `x: 0` | S3 (pasangan) |
| **Parallax Background** | `useScroll` + `useTransform` on background Y | S4, S1 |
| **Stagger Children** | `staggerChildren: 0.15` | S5 (galeri), S8 (rekening) |
| **Scale Reveal** | `scale: 0.95` → `scale: 1` | Card-card |
| **Countdown Tick** | CSS keyframe pulse tiap detik | S4 countdown |

---

## 5. Komponen React & Struktur Folder

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── sections/
│   │   ├── HeroSection.jsx
│   │   ├── GreetingSection.jsx
│   │   ├── CoupleSection.jsx
│   │   ├── EventSection.jsx
│   │   ├── GallerySection.jsx
│   │   ├── RSVPSection.jsx
│   │   ├── CommentSection.jsx
│   │   ├── GiftSection.jsx
│   │   ├── ShareSection.jsx
│   │   └── ClosingSection.jsx
│   ├── ui/
│   │   ├── CountdownTimer.jsx
│   │   ├── GoldDivider.jsx
│   │   ├── PhotoLightbox.jsx
│   │   ├── CopyButton.jsx
│   │   ├── MusicToggle.jsx
│   │   └── AnimatedSection.jsx     ← wrapper Framer Motion reusable
├── admin/
│   ├── AdminLayout.jsx
│   ├── AdminLogin.jsx              ← Supabase Auth login form
│   └── pages/
│       ├── ProfileEditor.jsx
│       ├── EventEditor.jsx
│       ├── GalleryManager.jsx      ← Upload ke Supabase Storage
│       ├── AccountEditor.jsx
│       ├── RSVPViewer.jsx
│       └── CommentModerator.jsx
├── hooks/
│   ├── useScrollReveal.js
│   ├── useSupabaseConfig.js        ← Fetch config dari tabel `config`
│   ├── useRealtimeComments.js      ← Supabase Realtime subscription
│   └── useAuth.js                  ← Supabase Auth session
├── lib/
│   ├── supabase.js                 ← createClient() instance
│   └── storageUpload.js            ← Helper upload ke Supabase Storage
├── store/
│   └── useStore.js                 ← Zustand global state
├── config/
│   └── wedding.fallback.json       ← Fallback jika Supabase belum setup
└── App.jsx
```

---

## 6. Supabase Client Setup

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

```env
# .env.local
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Contoh Query Pattern

```javascript
// INSERT rsvp
const { error } = await supabase.from('rsvp').insert({
  nama, hp, hadir, jumlah_tamu
})

// FETCH comments (visible only)
const { data } = await supabase
  .from('comments')
  .select('*')
  .eq('is_visible', true)
  .order('created_at', { ascending: false })

// FETCH config
const { data } = await supabase
  .from('config')
  .select('key, value')

// UPLOAD foto ke Storage
const { data } = await supabase.storage
  .from('gallery')
  .upload(`photo_${Date.now()}.jpg`, file)

// GET public URL dari Storage
const { data: { publicUrl } } = supabase.storage
  .from('gallery')
  .getPublicUrl(fileName)
```

---

## 7. URL Structure

| URL | Fungsi |
|---|---|
| `/` | Redirect ke `/invite` atau halaman landing |
| `/invite` | Undangan tanpa nama tamu |
| `/invite?to=NamaTamu` | Undangan dengan greeting personal |
| `/admin` | Dashboard admin (protected, cek Supabase session) |
| `/admin/login` | Halaman login admin |
| `/admin/rsvp` | Lihat daftar RSVP |
| `/admin/komentar` | Moderasi komentar |
| `/admin/galeri` | Kelola foto galeri |
| `/admin/rekening` | Kelola nomor rekening |

---

## 8. Responsiveness

| Breakpoint | Target |
|---|---|
| Mobile (`< 640px`) | Layout single column, font scale down, touch-friendly |
| Tablet (`640–1024px`) | 2 kolom untuk couple + galeri |
| Desktop (`> 1024px`) | Full layout, parallax aktif penuh |

**Catatan:** Parallax dinonaktifkan di mobile (performa + UX) — diganti dengan simple fade reveal.

---

## 9. Non-Functional Requirements

| Aspek | Target |
|---|---|
| **Performance** | Lighthouse score ≥ 85 (mobile) |
| **Load Time** | < 3 detik pada koneksi 4G |
| **Image Optimization** | Lazy load + Supabase Storage image transform |
| **SEO** | Meta OG tags untuk WhatsApp/FB preview |
| **Aksesibilitas** | Alt text pada gambar, contrast ratio AA |
| **Security** | RLS aktif di semua tabel, admin route cek session Supabase |
| **Realtime** | Komentar baru muncul tanpa refresh via Supabase Realtime |

---

## 10. Tahapan Pengerjaan (Vibe Coding Roadmap)

### Phase 1 — Scaffolding & Supabase Setup (Hari 1)
- [ ] Setup Vite + React + Tailwind
- [ ] Install Framer Motion, React Router, Zustand, `@supabase/supabase-js`
- [ ] Buat project di Supabase dashboard
- [ ] Jalankan SQL schema (5 tabel + RLS policies)
- [ ] Buat 3 Storage bucket (avatars, gallery, music)
- [ ] Setup `supabase.js` client + `.env.local`

### Phase 2 — Halaman Undangan (Hari 2–4)
- [ ] Build semua 10 section secara berurutan
- [ ] Implementasi `AnimatedSection` wrapper
- [ ] Countdown timer functional
- [ ] Galeri + lightbox (foto dari Supabase Storage)
- [ ] Hook `useSupabaseConfig` untuk load semua data konten

### Phase 3 — Integrasi Supabase Data (Hari 5)
- [ ] RSVP form → INSERT ke tabel `rsvp`
- [ ] Comment form → INSERT ke tabel `comments`
- [ ] Fetch comments dengan Realtime subscription
- [ ] Load bank_accounts untuk GiftSection
- [ ] Seed data awal via Supabase SQL editor

### Phase 4 — Dashboard Admin (Hari 6–7)
- [ ] Supabase Auth login (`/admin/login`)
- [ ] Protected route dengan session check
- [ ] Form editor semua modul konten (UPDATE tabel `config`)
- [ ] Upload foto via Supabase Storage
- [ ] RSVP viewer + comment moderator (toggle `is_visible`)

### Phase 5 — Polish & Deploy (Hari 8)
- [ ] Responsiveness audit (mobile/tablet/desktop)
- [ ] Animasi fine-tuning
- [ ] OG meta tags
- [ ] Push ke GitHub → auto-deploy ke Vercel
- [ ] Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` di Vercel Environment Variables
- [ ] Connect custom domain di Vercel dashboard
- [ ] Test preview deployment sebelum production

---

## 11. Prompt Vibe Coding — Kickstart Prompt

Gunakan prompt ini sebagai kickstart di Cursor/Windsurf/Lovable:

```
Build a wedding invitation website using React 18 + Vite + Tailwind CSS + Framer Motion + Supabase.

Design language: "Gilded Romance" — elegant luxury aesthetic.
Colors: gold (#C9A84C), cream (#FAF6EF), ivory (#F2EDE3), charcoal (#2C2C2C).
Fonts: Cormorant Garamond (display/headings) + DM Sans (body), loaded from Google Fonts.

Database: Supabase (PostgreSQL). Tables: config (key/value), rsvp, comments, bank_accounts, gallery.
Auth: Supabase Auth (email/password) for admin route only.
Storage: Supabase Storage buckets — avatars, gallery, music.
Realtime: Subscribe to comments table for live updates.

Supabase client in `src/lib/supabase.js` using VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars.

Create the following sections in order:
1. HeroSection — full-screen parallax photo from Supabase Storage, couple names with reveal animation
2. GreetingSection — personalized greeting from URL param `?to=NamaTamu`
3. CoupleSection — two-column layout with slide-in animation, data from config table
4. EventSection — event cards (akad + resepsi), countdown timer, Google Maps button
5. GallerySection — masonry grid from gallery table + Supabase Storage, lightbox, stagger reveal
6. RSVPSection — form INSERT to rsvp table via Supabase client
7. CommentSection — form INSERT + realtime display from comments table
8. GiftSection — bank_accounts table with copy-to-clipboard button
9. ShareSection — FB/IG/WhatsApp share buttons
10. ClosingSection — closing quote from config table

Admin dashboard at /admin (protected by Supabase Auth session):
- Login page with Supabase email/password auth
- Pages for editing config, managing gallery (upload to Supabase Storage), viewing RSVP list, moderating comments

All section transitions use Framer Motion (fade+slide on viewport entry).
Routing via React Router v6.
```

---

## 12. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Supabase free tier limit (500MB DB, 1GB Storage) | Lebih dari cukup untuk 1 undangan; monitor di Supabase dashboard |
| RLS misconfiguration → data bocor | Test setiap policy dengan Supabase SQL editor sebelum deploy |
| Anon key ter-expose di frontend | Aman by design — anon key hanya punya akses sesuai RLS policy |
| Foto besar → Storage mahal/lambat | Gunakan Supabase image transforms: `?width=800&quality=80` |
| Admin panel bocor | Supabase session expired otomatis, RLS blokir tanpa auth |
| Musik autoplay diblokir browser | Default mute, user klik play manual |
| Realtime quota habis (2M messages/bulan free) | Untuk skala undangan, sangat aman di bawah limit |
| Link undangan di-forward ke orang lain | Note di footer "Undangan ini khusus untuk [Nama]" |

---

*PRD v1.2 — Siap dijadikan konteks awal vibe coding session. Stack final: React + Tailwind + Framer Motion + Supabase + Vercel. Gunakan SQL schema di Section 3.3.1 untuk init database, lalu kickstart dengan prompt di Section 11.*
