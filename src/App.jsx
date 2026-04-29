import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import InvitePage from './pages/InvitePage'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import ProtectedRoute from './admin/ProtectedRoute'
import RSVPViewer from './admin/pages/RSVPViewer'
import CommentModerator from './admin/pages/CommentModerator'
import GalleryManager from './admin/pages/GalleryManager'
import AccountEditor from './admin/pages/AccountEditor'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Navigate to="/invite" replace />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="rsvp" element={<RSVPViewer />} />
          <Route path="komentar" element={<CommentModerator />} />
          <Route path="galeri" element={<GalleryManager />} />
          <Route path="rekening" element={<AccountEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
