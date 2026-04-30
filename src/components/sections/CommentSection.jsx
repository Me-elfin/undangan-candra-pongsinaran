import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'
import { useRealtimeComments } from '../../hooks/useRealtimeComments'
import { supabase } from '../../lib/supabase'

const PAGE_SIZE = 5

export default function CommentSection() {
  const { comments, loading } = useRealtimeComments()
  const [form, setForm] = useState({ nama: '', pesan: '' })
  const [status, setStatus] = useState(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('comments').insert({
      nama: form.nama,
      pesan: form.pesan,
    })
    if (!error) {
      setForm({ nama: '', pesan: '' })
      setStatus('success')
      setTimeout(() => setStatus(null), 3000)
    } else {
      setStatus('error')
    }
  }

  return (
    <section className="py-24 px-6 bg-ivory">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p className="section-subtitle mb-4">Ucapan & Doa</p>
          <h2 className="section-title">Doa Restu</h2>
          <GoldDivider className="max-w-xs mx-auto" />
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={0.1} className="mb-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="input-gold"
              placeholder="Nama Anda"
            />
            <textarea
              required
              value={form.pesan}
              onChange={(e) => setForm({ ...form, pesan: e.target.value })}
              className="input-gold resize-none"
              rows={3}
              placeholder="Tulis ucapan & doa restu Anda..."
            />
            {status === 'success' && (
              <p className="font-body text-xs text-green-700 text-center">
                ♡ Ucapan Anda sudah terkirim. Terima kasih!
              </p>
            )}
            {status === 'error' && (
              <p className="font-body text-xs text-red-500 text-center">
                Terjadi kesalahan. Silakan coba lagi.
              </p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-gold-filled w-full justify-center disabled:opacity-50"
            >
              {status === 'loading' ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </form>
        </AnimatedSection>

        <div className="space-y-4">
          {loading && (
            <p className="text-center text-muted text-sm font-body py-4">Memuat ucapan...</p>
          )}
          {!loading && comments.length === 0 && (
            <p className="text-center text-muted text-sm font-body italic py-4">
              Jadilah yang pertama memberikan ucapan ♡
            </p>
          )}
          {comments.slice(0, visible).map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index < PAGE_SIZE ? index * 0.07 : 0 }}
              className="card-ivory"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-gold/15 border border-gold/20 flex items-center justify-center text-gold font-display text-xl font-light flex-shrink-0">
                  {comment.nama?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xl font-light text-charcoal leading-tight">
                    {comment.nama}
                  </p>
                  <p className="font-body text-sm text-muted mt-1.5 leading-relaxed break-words">
                    {comment.pesan}
                  </p>
                  <p className="font-body text-xs text-muted/40 mt-2">
                    {new Date(comment.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Load More */}
          {!loading && visible < comments.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="font-body text-xs tracking-[0.25em] uppercase text-gold hover:text-gold/70 transition-colors border border-gold/30 hover:border-gold/60 px-6 py-3"
              >
                Lihat Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
