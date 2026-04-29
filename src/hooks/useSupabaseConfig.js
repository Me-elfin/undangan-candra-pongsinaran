import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import fallback from '../config/wedding.fallback.json'

// Deep merge that preserves fallback values when Supabase sends empty strings
function deepMerge(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    const srcVal = source[key]
    const tgtVal = target[key]
    if (srcVal === '' || srcVal === null || srcVal === undefined) {
      // Keep fallback value if Supabase value is empty
      continue
    }
    if (typeof srcVal === 'object' && !Array.isArray(srcVal) && typeof tgtVal === 'object' && !Array.isArray(tgtVal)) {
      result[key] = deepMerge(tgtVal, srcVal)
    } else {
      result[key] = srcVal
    }
  }
  return result
}

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
        setConfig((prev) => deepMerge(prev, parsed))
      }
      setLoading(false)
    }

    fetchConfig()
  }, [])

  return { config, loading }
}
