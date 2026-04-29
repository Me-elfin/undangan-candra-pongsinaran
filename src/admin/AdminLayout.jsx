import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const navLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/rsvp', label: 'RSVP' },
  { to: '/admin/komentar', label: 'Komentar' },
  { to: '/admin/galeri', label: 'Galeri' },
  { to: '/admin/rekening', label: 'Rekening' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-60 bg-charcoal flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold/50">Admin</p>
          <h2 className="font-display text-2xl font-light text-white mt-1">Dashboard</h2>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 font-body text-sm transition-all duration-150 border-l-2
                ${isActive
                  ? 'border-gold text-gold bg-gold/10'
                  : 'border-transparent text-white/50 hover:text-white/80 hover:bg-white/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-0.5">
          <a
            href="/invite"
            target="_blank"
            className="flex items-center px-4 py-2.5 font-body text-sm text-white/40 hover:text-gold transition-colors border-l-2 border-transparent"
          >
            Preview ↗
          </a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 font-body text-sm text-white/30 hover:text-red-400 transition-colors border-l-2 border-transparent"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
