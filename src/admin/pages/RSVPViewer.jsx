import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function RSVPViewer() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

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

  const hadir = data.filter((r) => r.hadir)
  const tidakHadir = data.filter((r) => !r.hadir)
  const totalTamu = hadir.reduce((sum, r) => sum + (r.jumlah_tamu || 0), 0)

  return (
    <div>
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted mb-1">Admin</p>
        <h1 className="font-display text-4xl font-light text-charcoal">Daftar RSVP</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total RSVP', value: data.length },
          { label: 'Hadir', value: `${hadir.length} (${totalTamu} org)` },
          { label: 'Tidak Hadir', value: tidakHadir.length },
        ].map((s) => (
          <div key={s.label} className="card-ivory text-center py-6">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted mb-1">{s.label}</p>
            <p className="font-display text-3xl font-light text-charcoal">{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-muted text-sm font-body">Memuat...</p>
      ) : (
        <div className="card-ivory overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gold/20">
                <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Nama</th>
                <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">HP</th>
                <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Hadir</th>
                <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Tamu</th>
                <th className="text-left py-3 px-4 text-xs tracking-[0.15em] uppercase text-muted font-normal">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b border-gold/10 hover:bg-cream/50">
                  <td className="py-3 px-4 text-charcoal">{row.nama}</td>
                  <td className="py-3 px-4 text-muted">{row.hp || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 ${row.hadir ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {row.hadir ? 'Hadir' : 'Tidak'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted">{row.jumlah_tamu}</td>
                  <td className="py-3 px-4 text-muted text-xs">
                    {new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted italic">
                    Belum ada RSVP
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
