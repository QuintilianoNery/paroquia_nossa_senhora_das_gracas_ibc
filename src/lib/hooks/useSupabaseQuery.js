import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@lib/supabase'

export function useSupabaseQuery(table, options = {}) {
  const { filters = {}, orderBy = 'created_at', limit = null } = options
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from(table).select('*')

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) query = query.eq(key, value)
      })

      if (orderBy) {
        const [field, dir] = orderBy.includes(':') ? orderBy.split(':') : [orderBy, 'asc']
        query = query.order(field, { ascending: dir === 'asc' })
      }

      if (limit) query = query.limit(limit)

      const { data: responseData, error: responseError } = await query
      if (responseError) {
        setError(responseError.message)
        setData([])
      } else {
        setData(responseData || [])
      }
    } catch (err) {
      setError(err.message || String(err))
      setData([])
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(filters), orderBy, limit])

  useEffect(() => {
    let cancelled = false
    const wrapped = async () => {
      await fetchData()
      if (cancelled) return
    }
    wrapped()
    return () => { cancelled = true }
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useSupabaseQuerySingle(table, filters = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetch = async () => {
      try {
        let query = supabase.from(table).select('*')
        Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== null) query = query.eq(key, value) })
        const { data: responseData, error: responseError } = await query.single()
        if (responseError) {
          setError(responseError.message)
          setData(null)
        } else {
          setData(responseData)
        }
      } catch (err) {
        if (!cancelled) setError(err.message || String(err))
        setData(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [table, JSON.stringify(filters)])

  return { data, loading, error }
}
