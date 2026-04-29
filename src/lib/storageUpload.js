import { supabase } from './supabase'

export async function uploadToStorage(bucket, file) {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl
}
