# Developer Guide — Undangan Pernikahan Candra & Listarina

Panduan ini berisi semua yang perlu diketahui untuk melanjutkan pengembangan proyek ini
menggunakan AI assistant (Cursor, Codex, Gemini, Claude, dll) tanpa harus menjelaskan
ulang dari awal.

---

## Stack Teknologi

| Layer | Teknologi |
|---|---|
| Frontend | React 18 + Vite 6 |
| Styling | Tailwind CSS v3 + custom tokens |
| Animasi | Framer Motion 11 |
| State | Zustand 5 |
| Routing | React Router v6 (nested routes) |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Hosting | Vercel |

---

## Struktur Folder

```
/
├── src/
│   ├── App.jsx                        ← Root routing
│   ├── main.jsx
│   ├── index.css                      ← Tailwind directives + CSS vars
│   │
│   ├── pages/
│   │   └── InvitePage.jsx             ← Halaman utama undangan (10 sections)
│   │
│   ├── components/
│   │   ├── sections/                  ← 10 section undangan
│   │   │   ├── HeroSection.jsx        ← S1: Hero fullscreen parallax
│   │   │   ├── GreetingSection.jsx    ← S2: Salam tamu (?to=NamaTamu)
│   │   │   ├── CoupleSection.jsx      ← S3: Profil kedua pengantin
│   │   │   ├── EventSection.jsx       ← S4: Jadwal + countdown + maps
│   │   │   ├── GallerySection.jsx     ← S5: Grid foto + lightbox
│   │   │   ├── RSVPSection.jsx        ← S6: Form konfirmasi kehadiran
│   │   │   ├── CommentSection.jsx     ← S7: Ucapan + realtime
│   │   │   ├── GiftSection.jsx        ← S8: Info rekening bank
│   │   │   ├── ShareSection.jsx       ← S9: Tombol bagikan (WA/FB/IG)
│   │   │   └── ClosingSection.jsx     ← S10: Ayat penutup
│   │   │
│   │   └── ui/
│   │       ├── AnimatedSection.jsx    ← Framer Motion scroll-reveal wrapper
│   │       ├── CountdownTimer.jsx     ← Hitung mundur ke tanggal nikah
│   │       ├── GoldDivider.jsx        ← Ornamen pemisah emas
│   │       ├── PhotoLightbox.jsx      ← Modal preview foto
│   │       ├── CopyButton.jsx         ← Salin nomor rekening
│   │       └── MusicToggle.jsx        ← Toggle musik latar
│   │
│   ├── admin/
│   │   ├── AdminLogin.jsx             ← /admin/login (form email+password)
│   │   ├── AdminLayout.jsx            ← Shell admin: sidebar + <Outlet />
│   │   ├── AdminDashboard.jsx         ← /admin (ringkasan)
│   │   ├── ProtectedRoute.jsx         ← Guard: redirect ke login jika belum auth
│   │   └── pages/
│   │       ├── RSVPViewer.jsx         ← /admin/rsvp — tabel RSVP
│   │       ├── CommentModerator.jsx   ← /admin/komentar — toggle visibilitas
│   │       ├── GalleryManager.jsx     ← /admin/galeri — upload/hapus foto
│   │       └── AccountEditor.jsx      ← /admin/rekening — CRUD rekening bank
│   │
│   ├── hooks/
│   │   ├── useSupabaseConfig.js       ← Fetch tabel `config` + merge fallback
│   │   ├── useRealtimeComments.js     ← Subscribe realtime komentar
│   │   └── useAuth.js                 ← Supabase Auth session listener
│   │
│   ├── lib/
│   │   ├── supabase.js                ← createClient (baca dari .env.local)
│   │   └── storageUpload.js           ← Helper upload ke Supabase Storage
│   │
│   ├── store/
│   │   └── useStore.js                ← Zustand store (config, user, music)
│   │
│   └── config/
│       └── wedding.fallback.json      ← Data fallback jika Supabase offline
│
├── index.html                         ← Entry point, Google Fonts di sini
├── vite.config.js                     ← Build config + manual chunk split
├── tailwind.config.js                 ← Custom color tokens + fonts
├── vercel.json                        ← SPA rewrite rule (WAJIB ada)
├── .env.local                         ← Env vars lokal (TIDAK di-commit)
└── .gitignore
```

---

## Environment Variables

File `.env.local` (tidak masuk Git, sudah ada di lokal):

```
VITE_SUPABASE_URL=https://rqilmzgztmljnvnwvmth.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Di Vercel, variabel ini sudah di-set di dashboard project → Settings → Environment Variables.
Jika deploy ulang ke project Vercel yang sama, env vars tidak perlu diubah.

---

## Supabase

**Project ID:** `rqilmzgztmljnvnwvmth`
**URL:** `https://rqilmzgztmljnvnwvmth.supabase.co`

### Tabel Database

#### `config`
Menyimpan semua konfigurasi website dalam format key-value JSON.

| key | Isi `value` (JSONB) |
|---|---|
| `couple` | `{ groom: { fullName, nickname, fatherName, motherName, photoUrl }, bride: {...} }` |
| `event` | `{ akad: { date, time, venue, address, mapsUrl }, resepsi: {...} }` |
| `closing_quote` | `{ text, source }` |
| `music` | `{ enabled: bool, url: string }` |
| `rsvp_enabled` | `{ value: bool }` |
| `heroImageUrl` | `"https://..."` (string langsung) |

#### `rsvp`
Form konfirmasi kehadiran tamu.

| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `name` | text |
| `attendance` | text (`hadir` / `tidak_hadir`) |
| `guest_count` | int |
| `message` | text |
| `created_at` | timestamptz |

#### `comments`
Ucapan selamat dari tamu.

| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `name` | text |
| `message` | text |
| `is_visible` | bool (default true) |
| `created_at` | timestamptz |

> **Realtime**: Tabel ini sudah ditambahkan ke `supabase_realtime` publication.
> Komentar baru muncul tanpa refresh halaman.

#### `bank_accounts`
Rekening tujuan amplop digital.

| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `bank_name` | text |
| `account_name` | text |
| `account_number` | text |
| `logo_url` | text |
| `sort_order` | int |

#### `gallery`
Foto-foto yang ditampilkan di GallerySection.

| Kolom | Tipe |
|---|---|
| `id` | uuid |
| `url` | text (URL publik Supabase Storage) |
| `caption` | text |
| `sort_order` | int |

### Storage Buckets
Semua bucket sudah dibuat dan bersifat **public**:

| Bucket | Kegunaan |
|---|---|
| `avatars` | Foto profil pengantin |
| `gallery` | Foto galeri |
| `music` | File audio latar |

### RLS (Row Level Security)
- `config`, `bank_accounts`, `gallery`: **public read**, auth write
- `rsvp`: **public insert**, auth read
- `comments`: **public read** (is_visible=true), **public insert**, auth full

---

## Alur Data: Config

```
Supabase tabel `config`
        ↓ (useSupabaseConfig hook)
Merge dengan wedding.fallback.json
        ↓
Diteruskan sebagai prop `config` ke setiap section
```

Jika Supabase tidak bisa diakses, site otomatis pakai data dari
`src/config/wedding.fallback.json`. **Selalu update file ini juga** setiap kali
mengubah data di Supabase.

---

## Cara Update Data Pernikahan

### Cara 1 — Via Admin Dashboard
Buka `https://undangan-candra-pongsinaran.vercel.app/admin/login`
Login dengan akun Supabase Auth, lalu edit di masing-masing halaman admin.

### Cara 2 — Direct SQL di Supabase
```sql
-- Update nama pengantin
UPDATE config
SET value = '{ "groom": { "fullName": "...", ... }, "bride": { ... } }'::jsonb
WHERE key = 'couple';

-- Update tanggal & venue
UPDATE config
SET value = '{ "akad": { "date": "YYYY-MM-DD", "time": "HH:MM", "venue": "...", "address": "...", "mapsUrl": "..." }, "resepsi": { ... } }'::jsonb
WHERE key = 'event';
```

Setelah update SQL, **juga update** `src/config/wedding.fallback.json` dengan data yang sama.

### Cara 3 — Edit File Fallback Saja (cepat untuk dev lokal)
Edit `src/config/wedding.fallback.json`, lalu deploy. Supabase akan override fallback
saat runtime, jadi pastikan Supabase juga konsisten.

---

## Workflow Development Lokal

```bash
# 1. Install dependencies (hanya pertama kali atau setelah npm install)
npm install

# 2. Jalankan dev server
npm run dev
# → http://localhost:5173/invite

# 3. Test dengan nama tamu
# → http://localhost:5173/invite?to=NamaTamu

# 4. Akses admin (lokal)
# → http://localhost:5173/admin/login
```

---

## Workflow Deploy ke Vercel

```bash
# 1. Build lokal dulu untuk pastikan tidak ada error
npm run build

# 2. Deploy ke production
vercel deploy --prod
```

Vercel akan otomatis:
- Baca `vite.config.js` → build React + chunk splitting
- Baca `vercel.json` → aktifkan SPA rewrite (PENTING: tanpa ini semua route selain `/` akan 404)
- Pakai env vars yang sudah ada di Vercel dashboard

**Production URL:** `https://undangan-candra-pongsinaran.vercel.app`

> Jangan lupa `npm run build` sebelum deploy untuk memastikan tidak ada syntax error
> yang baru masuk.

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

Routing menggunakan React Router v6 nested routes dengan `<Outlet />` di `AdminLayout`.

---

## Pola "Buka Undangan"

Hero (`HeroSection`) ditampilkan selalu. Section lainnya hanya di-render setelah tamu
klik "Buka Undangan". Logika ada di `InvitePage.jsx`:

```jsx
const [opened, setOpened] = useState(false)
const contentRef = useRef(null)

function handleOpen() {
  setOpened(true)
  setTimeout(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, 50)
}
```

Timeout 50ms diperlukan agar DOM sections sempat di-mount sebelum `scrollIntoView`
dipanggil.

---

## Custom Tailwind Tokens

Didefinisikan di `tailwind.config.js`:

| Token | Hex | Kegunaan |
|---|---|---|
| `gold` | `#C9A84C` | Aksen utama, border, judul |
| `gold-light` | `#E8D08A` | Hover state, highlight |
| `cream` | `#FAF6EF` | Background utama |
| `ivory` | `#F2EDE3` | Background card |
| `charcoal` | `#2C2C2C` | Teks utama |
| `muted` | `#8A7F72` | Teks sekunder, label |

Font: `font-display` = Cormorant Garamond (serif, heading), `font-body` = DM Sans (sans-serif, body).

---

## Hal Penting yang Wajib Diketahui

1. **`vercel.json` wajib ada** — tanpa file ini semua route `/invite`, `/admin`, dll akan
   mengembalikan 404 di Vercel karena ini SPA.

2. **`.env.local` tidak di-commit** — env vars Supabase disimpan lokal dan di Vercel
   dashboard. Jika clone ulang, buat file `.env.local` baru dengan isi di atas.

3. **Realtime comments** — tabel `comments` sudah ditambahkan ke `supabase_realtime`
   publication. Jika tabel di-drop dan dibuat ulang, jalankan:
   ```sql
   ALTER publication supabase_realtime ADD TABLE comments;
   ```

4. **Fallback JSON harus sinkron** — `src/config/wedding.fallback.json` dipakai saat
   Supabase lambat/offline. Selalu update bersamaan dengan update data di Supabase.

5. **Admin auth** — menggunakan Supabase Auth (email+password). Akun dibuat/dikelola
   di Supabase Dashboard → Authentication → Users. Tidak ada registrasi publik.

6. **Foto pengantin** — placeholder saat ini menggunakan Unsplash. Ganti dengan upload
   ke bucket `avatars` via `/admin/galeri` atau langsung update `photoUrl` di config.

---

## Data Pernikahan Aktual

Sumber kebenaran ada di Supabase tabel `config` dan `bank_accounts`.
Fallback ada di `src/config/wedding.fallback.json`.

**Pengantin:**
- Pria: Chandra W. D. T. Pongsinaran, ST — putra dari Bapak Tony Pongsinaran & Ibu Lily Ondang
- Wanita: Listarina Mbura, S.Pd — putri dari Bapak Paulus Mbura & Ibu Sarline Sine

**Tanggal:** Jumat, 01 Mei 2026

**Pemberkatan Nikah:** 16.00 WITA — Gereja GMIT Zaitun Tuapukan, Jln. Timor Raya Km. 24, Tuapukan

**Resepsi:** 18.00 WITA — Kediaman Bapak Paulus Mbura, Jln. Timor Raya Km. 24, Tuapukan

**Rekening:**
- BNI — Listarina Mbura — `897309629`
- BNI — Chandra William — `1886238915`

**Ayat penutup:** Matius 19:6
