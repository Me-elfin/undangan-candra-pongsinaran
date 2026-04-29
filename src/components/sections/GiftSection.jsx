import { useEffect, useState } from 'react'
import AnimatedSection from '../ui/AnimatedSection'
import GoldDivider from '../ui/GoldDivider'
import CopyButton from '../ui/CopyButton'
import { supabase } from '../../lib/supabase'

const FALLBACK_ACCOUNTS = [
  {
    id: 1,
    bank_name: 'BCA',
    account_name: 'Nama Pengantin',
    account_number: '1234567890',
    logo_url: '',
  },
]

export default function GiftSection() {
  const [accounts, setAccounts] = useState(FALLBACK_ACCOUNTS)

  useEffect(() => {
    supabase
      .from('bank_accounts')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setAccounts(data)
      })
  }, [])

  return (
    <section className="py-24 px-6 bg-cream">
      <div className="max-w-xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p className="section-subtitle mb-4">Hadiah & Doa</p>
          <h2 className="section-title">Amplop Digital</h2>
          <GoldDivider className="max-w-xs mx-auto" />
          <p className="font-body text-sm text-muted mt-2 leading-relaxed">
            Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda berkenan
            memberikan tanda kasih, berikut informasi rekening kami.
          </p>
        </AnimatedSection>

        <div className="space-y-4">
          {accounts.map((acc, i) => (
            <AnimatedSection key={acc.id} variant="scale" delay={i * 0.1}>
              <div className="card-ivory">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    {acc.logo_url ? (
                      <img src={acc.logo_url} alt={acc.bank_name} className="h-7 object-contain" />
                    ) : (
                      <div className="bg-gold/10 border border-gold/25 px-3 py-1.5">
                        <span className="font-display text-lg text-gold font-light tracking-wide">
                          {acc.bank_name}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-body text-xs text-muted">{acc.account_name}</p>
                      <p className="font-display text-2xl font-light text-charcoal tracking-wider mt-0.5">
                        {acc.account_number}
                      </p>
                    </div>
                  </div>
                  <CopyButton text={acc.account_number} />
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
