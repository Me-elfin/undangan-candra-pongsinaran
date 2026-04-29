import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-muted text-sm tracking-widest">Memuat...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return children
}
