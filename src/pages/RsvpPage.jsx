import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import GoldDivider from '../components/ui/GoldDivider'

export default function RsvpPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cek sesi yang sudah ada
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-muted text-sm tracking-widest">Memuat...</p>
      </div>
    )
  }

  return user ? <RsvpDashboard user={user} /> : <RsvpLogin />
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function RsvpLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email atau password salah.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #FAF6EF 0%, #F2EDE3 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.35em] uppercase text-gold/70 mb-4">
            Undangan Pernikahan
          </p>
          <h1 className="font-display text-5xl font-light text-charcoal leading-tight">
            Candra<br />&amp; Listarina
          </h1>
          <GoldDivider className="max-w-[120px] mx-auto" />
          <p className="font-body text-sm text-muted mt-2">Daftar Tamu RSVP</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-gold"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-gold"
            placeholder="Password"
          />
          {error && (
            <p className="font-body text-xs text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold-filled w-full justify-center disabled:opacity-50"
          >
            {loading ? 'Masuk...' : 'Lihat Daftar Tamu'}
          </button>
        </form>

        <p className="text-center mt-8">
          <a
            href="/invite"
            className="font-body text-xs text-muted hover:text-gold transition-colors tracking-widest"
          >
            ← Kembali ke Undangan
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── Dashboard RSVP ──────────────────────────────────────────────────────────
function RsvpDashboard({ user }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setData(data || [])
        setLoading(false)
      })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  function handleExport() {
    const headers = ['No', 'Nama', 'No. HP', 'Kehadiran', 'Jumlah Tamu', 'Tanggal']
    const rows = data.map((row, i) => [
      i + 1,
      row.nama,
      row.hp || '',
      row.hadir ? 'Hadir' : 'Tidak Hadir',
      row.jumlah_tamu ?? '',
      new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    ])
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RSVP_Candra_Listarina_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const hadir = data.filter((r) => r.hadir)
  const tidakHadir = data.filter((r) => !r.hadir)
  const totalTamu = hadir.reduce((sum, r) => sum + (r.jumlah_tamu || 0), 0)

  const filtered = data.filter((r) =>
    r.nama?.toLowerCase().includes(search.toLowerCase()) ||
    r.hp?.includes(search)
  )

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-charcoal py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-gold/60 mb-1">
              Undangan Pernikahan
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-light text-white">
              Candra &amp; Listarina
            </h1>
            <p className="font-body text-xs text-white/40 mt-1">Daftar Tamu RSVP</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="font-body text-xs tracking-widest uppercase text-gold hover:text-gold/70 transition-colors border border-gold/40 hover:border-gold/70 px-4 py-2"
            >
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="font-body text-xs tracking-widest uppercase text-white/50 hover:text-gold transition-colors border border-white/20 hover:border-gold/40 px-4 py-2"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Statistik */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total RSVP', value: data.length, color: 'text-charcoal' },
            { label: 'Hadir', value: `${hadir.length}`, sub: `${totalTamu} orang`, color: 'text-green-700' },
            { label: 'Tidak Hadir', value: tidakHadir.length, color: 'text-red-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gold/20 p-5 text-center">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-muted mb-2">{s.label}</p>
              <p className={`font-display text-4xl font-light ${s.color}`}>{s.value}</p>
              {s.sub && <p className="font-body text-xs text-muted mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor HP..."
            className="input-gold w-full md:w-80"
          />
        </div>

        {/* Tabel */}
        {loading ? (
          <p className="text-muted text-sm font-body py-10 text-center">Memuat data...</p>
        ) : (
          <div className="bg-white border border-gold/20 overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-gold/20 bg-ivory">
                  <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">#</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Nama</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">No. HP</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Kehadiran</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Jml Tamu</th>
                  <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.id} className="border-b border-gold/10 hover:bg-cream/60 transition-colors">
                    <td className="py-3 px-4 text-muted text-xs">{i + 1}</td>
                    <td className="py-3 px-4 text-charcoal font-medium">{row.nama}</td>
                    <td className="py-3 px-4 text-muted">{row.hp || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-sm font-body ${
                        row.hadir
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {row.hadir ? '✓ Hadir' : '✗ Tidak Hadir'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted text-center">{row.jumlah_tamu ?? '—'}</td>
                    <td className="py-3 px-4 text-muted text-xs">
                      {new Date(row.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted italic font-body">
                      {search ? 'Tidak ada hasil pencarian.' : 'Belum ada tamu yang RSVP.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <p className="font-body text-xs text-muted/50 text-center mt-6">
          Login sebagai {user.email}
        </p>
      </div>
    </div>
  )
}
