import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function StatCard({ label, value, to }) {
  return (
    <Link
      to={to}
      className="card-ivory hover:border-gold/40 transition-colors cursor-pointer block"
    >
      <p className="font-body text-xs tracking-[0.2em] uppercase text-muted mb-2">{label}</p>
      <p className="font-display text-5xl font-light text-charcoal">{value ?? '—'}</p>
    </Link>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ rsvp: null, hadir: null, comments: null })

  useEffect(() => {
    async function load() {
      const [{ count: rsvp }, { count: hadir }, { count: comments }] = await Promise.all([
        supabase.from('rsvp').select('*', { count: 'exact', head: true }),
        supabase.from('rsvp').select('*', { count: 'exact', head: true }).eq('hadir', true),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
      ])
      setStats({ rsvp, hadir, comments })
    }
    load()
  }, [])

  return (
    <div>
      <div className="mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted mb-1">Selamat datang</p>
        <h1 className="font-display text-4xl font-light text-charcoal">Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total RSVP" value={stats.rsvp} to="/admin/rsvp" />
        <StatCard label="Hadir" value={stats.hadir} to="/admin/rsvp" />
        <StatCard label="Komentar" value={stats.comments} to="/admin/komentar" />
      </div>

      <div className="card-ivory">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-muted mb-4">Menu Cepat</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/admin/rsvp', label: 'Lihat RSVP' },
            { to: '/admin/komentar', label: 'Moderasi Komentar' },
            { to: '/admin/galeri', label: 'Kelola Galeri' },
            { to: '/admin/rekening', label: 'Kelola Rekening' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="py-3 px-4 border border-gold/30 text-center font-body text-xs tracking-wide text-charcoal hover:bg-gold hover:text-white hover:border-gold transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
