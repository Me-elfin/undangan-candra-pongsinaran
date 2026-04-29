import { useState } from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'
import { supabase } from '../../lib/supabase'

export default function RSVPSection({ config }) {
  const rsvpEnabled = config?.rsvp_enabled?.value !== false
  const [form, setForm] = useState({ nama: '', hp: '', hadir: true, jumlah_tamu: 1 })
  const [status, setStatus] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('rsvp').insert({
      nama: form.nama,
      hp: form.hp,
      hadir: form.hadir,
      jumlah_tamu: form.hadir ? Number(form.jumlah_tamu) : 0,
    })
    setStatus(error ? 'error' : 'success')
  }

  if (!rsvpEnabled) return null

  return (
    <section className="py-24 px-6 bg-cream">
      <div className="max-w-lg mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p className="section-subtitle mb-4">Konfirmasi Kehadiran</p>
          <h2 className="section-title">RSVP</h2>
          <GoldDivider className="max-w-xs mx-auto" />
          <p className="font-body text-sm text-muted mt-2 leading-relaxed">
            Mohon konfirmasi kehadiran Anda agar kami dapat mempersiapkan dengan baik.
          </p>
        </AnimatedSection>

        <AnimatedSection variant="fade-up" delay={0.1}>
          {status === 'success' ? (
            <div className="card-ivory text-center py-14">
              <div className="text-gold text-5xl mb-6 font-display">♡</div>
              <p className="font-display text-3xl font-light text-charcoal">Terima kasih!</p>
              <p className="font-body text-sm text-muted mt-3">
                Konfirmasi kehadiran Anda sudah kami terima.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted block mb-2">
                  Nama Lengkap *
                </label>
                <input
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="input-gold"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted block mb-2">
                  Nomor HP
                </label>
                <input
                  value={form.hp}
                  onChange={(e) => setForm({ ...form, hp: e.target.value })}
                  className="input-gold"
                  placeholder="08xx-xxxx-xxxx"
                  type="tel"
                />
              </div>

              <div>
                <label className="font-body text-xs tracking-[0.2em] uppercase text-muted block mb-3">
                  Konfirmasi Kehadiran *
                </label>
                <div className="flex gap-3">
                  {[
                    { value: true, label: 'Hadir' },
                    { value: false, label: 'Tidak Hadir' },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setForm({ ...form, hadir: opt.value })}
                      className={`flex-1 py-3 text-xs font-body tracking-[0.15em] uppercase border transition-all duration-200 ${
                        form.hadir === opt.value
                          ? 'bg-gold text-white border-gold'
                          : 'bg-white text-muted border-gold/30 hover:border-gold'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.hadir && (
                <div>
                  <label className="font-body text-xs tracking-[0.2em] uppercase text-muted block mb-2">
                    Jumlah Tamu
                  </label>
                  <select
                    value={form.jumlah_tamu}
                    onChange={(e) => setForm({ ...form, jumlah_tamu: e.target.value })}
                    className="input-gold"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} orang</option>
                    ))}
                  </select>
                </div>
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
                {status === 'loading' ? 'Mengirim...' : 'Kirim Konfirmasi'}
              </button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}
