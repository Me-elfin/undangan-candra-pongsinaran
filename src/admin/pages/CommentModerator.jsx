import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function CommentModerator() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setComments(data || [])
        setLoading(false)
      })
  }, [])

  async function toggleVisibility(id, current) {
    await supabase.from('comments').update({ is_visible: !current }).eq('id', id)
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_visible: !current } : c))
    )
  }

  async function deleteComment(id) {
    if (!confirm('Hapus komentar ini?')) return
    await supabase.from('comments').delete().eq('id', id)
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted mb-1">Admin</p>
        <h1 className="font-display text-4xl font-light text-charcoal">Moderasi Komentar</h1>
      </div>

      {loading ? (
        <p className="text-muted text-sm font-body">Memuat...</p>
      ) : (
        <div className="space-y-3">
          {comments.length === 0 && (
            <p className="text-muted text-sm font-body italic py-4">Belum ada komentar.</p>
          )}
          {comments.map((c) => (
            <div
              key={c.id}
              className={`card-ivory flex items-start gap-4 ${!c.is_visible ? 'opacity-50' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg font-light text-charcoal">{c.nama}</p>
                <p className="font-body text-sm text-muted mt-1 leading-relaxed break-words">{c.pesan}</p>
                <p className="font-body text-xs text-muted/40 mt-1">
                  {new Date(c.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleVisibility(c.id, c.is_visible)}
                  className={`px-3 py-1.5 text-xs font-body border transition-all ${
                    c.is_visible
                      ? 'border-gold/40 text-gold hover:bg-gold hover:text-white'
                      : 'border-muted/30 text-muted hover:bg-muted hover:text-white'
                  }`}
                >
                  {c.is_visible ? 'Sembunyikan' : 'Tampilkan'}
                </button>
                <button
                  onClick={() => deleteComment(c.id)}
                  className="px-3 py-1.5 text-xs font-body border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
