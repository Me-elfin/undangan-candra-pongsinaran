import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import fallback from '../config/wedding.fallback.json'

export function useSupabaseConfig() {
  const [config, setConfig] = useState(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase
        .from('config')
        .select('key, value')

      if (!error && data) {
        const parsed = data.reduce((acc, row) => {
          acc[row.key] = row.value
          return acc
        }, {})
        setConfig((prev) => ({ ...prev, ...parsed }))
      }
      setLoading(false)
    }

    fetchConfig()
  }, [])

  return { config, loading }
}
