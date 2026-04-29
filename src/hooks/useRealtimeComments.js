import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })

      setComments(data || [])
      setLoading(false)
    }

    fetchComments()

    const channel = supabase
      .channel('comments-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          if (payload.new && payload.new.is_visible !== false) {
            setComments((prev) => [payload.new, ...prev])
          }
        }
      )
      .subscribe((status, err) => {
        if (err) console.warn('Realtime subscription error:', err)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { comments, loading }
}
