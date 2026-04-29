import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadToStorage } from '../../lib/storageUpload'

export default function GalleryManager() {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })
    setPhotos(data || [])
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      for (const file of files) {
        const url = await uploadToStorage('gallery', file)
        await supabase.from('gallery').insert({
          image_url: url,
          caption: '',
          sort_order: photos.length,
        })
      }
      await loadPhotos()
    } catch (err) {
      setError('Upload gagal: ' + err.message)
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(photo) {
    if (!confirm('Hapus foto ini?')) return
    const fileName = photo.image_url.split('/').pop()
    await supabase.storage.from('gallery').remove([fileName])
    await supabase.from('gallery').delete().eq('id', photo.id)
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
  }

  return (
    <div>
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted mb-1">Admin</p>
        <h1 className="font-display text-4xl font-light text-charcoal">Kelola Galeri</h1>
      </div>

      <div className="mb-8">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-gold-filled disabled:opacity-50"
        >
          {uploading ? 'Mengupload...' : '+ Upload Foto'}
        </button>
        {error && <p className="font-body text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {photos.length === 0 ? (
        <p className="text-muted text-sm font-body italic">Belum ada foto di galeri.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.caption || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/60 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(photo)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-red-500 text-white text-xs font-body"
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
