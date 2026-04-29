import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY_FORM = { bank_name: '', account_name: '', account_number: '', logo_url: '', sort_order: 0 }

export default function AccountEditor() {
  const [accounts, setAccounts] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadAccounts() }, [])

  async function loadAccounts() {
    const { data } = await supabase.from('bank_accounts').select('*').order('sort_order')
    setAccounts(data || [])
  }

  function startEdit(acc) {
    setEditing(acc.id)
    setForm({ bank_name: acc.bank_name, account_name: acc.account_name, account_number: acc.account_number, logo_url: acc.logo_url || '', sort_order: acc.sort_order })
  }

  function cancelEdit() { setEditing(null); setForm(EMPTY_FORM) }

  async function handleSave(e) {
    e.preventDefault()
    setLoading(true)
    if (editing) {
      await supabase.from('bank_accounts').update(form).eq('id', editing)
    } else {
      await supabase.from('bank_accounts').insert(form)
    }
    await loadAccounts()
    cancelEdit()
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Hapus rekening ini?')) return
    await supabase.from('bank_accounts').delete().eq('id', id)
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted mb-1">Admin</p>
        <h1 className="font-display text-4xl font-light text-charcoal">Kelola Rekening</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card-ivory">
          <h2 className="font-display text-2xl font-light text-charcoal mb-6">
            {editing ? 'Edit Rekening' : 'Tambah Rekening'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { key: 'bank_name', label: 'Nama Bank', placeholder: 'BCA / BNI / BRI...' },
              { key: 'account_name', label: 'Nama Pemilik', placeholder: 'Nama lengkap' },
              { key: 'account_number', label: 'Nomor Rekening', placeholder: '1234567890' },
              { key: 'logo_url', label: 'URL Logo (opsional)', placeholder: 'https://...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="font-body text-xs tracking-[0.15em] uppercase text-muted block mb-1.5">
                  {label}
                </label>
                <input
                  required={key !== 'logo_url'}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-gold"
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-gold-filled flex-1 justify-center disabled:opacity-50">
                {loading ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
              </button>
              {editing && (
                <button type="button" onClick={cancelEdit} className="btn-gold flex-1 justify-center">
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          {accounts.length === 0 && (
            <p className="text-muted text-sm font-body italic">Belum ada rekening.</p>
          )}
          {accounts.map((acc) => (
            <div key={acc.id} className="card-ivory">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-xl font-light text-charcoal">{acc.bank_name}</p>
                  <p className="font-body text-sm text-muted">{acc.account_name}</p>
                  <p className="font-body text-base text-charcoal mt-0.5 tracking-wider">{acc.account_number}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(acc)} className="px-3 py-1.5 text-xs font-body border border-gold/40 text-gold hover:bg-gold hover:text-white transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(acc.id)} className="px-3 py-1.5 text-xs font-body border border-red-200 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
