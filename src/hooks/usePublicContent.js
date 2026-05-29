import { useEffect, useState } from 'react'
import { hasSupabaseEnv, supabase } from '../lib/supabase'

const emptyContent = {
  parishProfile: null,
  communities: [],
  news: [],
  clergy: [],
  massSchedules: [],
  officeHours: [],
  usefulLinks: [],
  pastorals: []
}

function sortByLabel(items) {
  return [...items].sort((left, right) => left.label.localeCompare(right.label, 'pt-BR'))
}

export function usePublicContent() {
  const [content, setContent] = useState(emptyContent)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadContent() {
      if (!hasSupabaseEnv || !supabase) {
        if (isMounted) {
          setLoading(false)
        }
        return
      }

      const [parishProfileResult, communitiesResult, newsResult, clergyResult, massSchedulesResult, officeHoursResult, usefulLinksResult, pastoralsResult] = await Promise.all([
        supabase.from('parish_profile').select('*').eq('is_published', true).order('updated_at', { ascending: false }).limit(1),
        supabase.from('communities').select('*').eq('is_published', true).order('manual_order', { ascending: true }).order('name', { ascending: true }),
        supabase.from('news').select('*').eq('is_published', true).order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
        supabase.from('clergy').select('*').eq('is_published', true).order('manual_order', { ascending: true }).order('name', { ascending: true }),
        supabase.from('mass_schedules').select('*, communities(id, name, slug)').eq('is_published', true).order('created_at', { ascending: false }),
        supabase.from('office_hours').select('*').eq('is_published', true).order('created_at', { ascending: false }),
        supabase.from('useful_links').select('*').eq('is_published', true).order('manual_order', { ascending: true }).order('title', { ascending: true }),
        supabase.from('pastorals').select('*').eq('is_published', true).order('manual_order', { ascending: true }).order('title', { ascending: true })
      ])

      const results = [parishProfileResult, communitiesResult, newsResult, clergyResult, massSchedulesResult, officeHoursResult, usefulLinksResult, pastoralsResult]
      const firstError = results.find((result) => result.error)?.error

      if (firstError) {
        if (isMounted) {
          setError(firstError.message)
          setLoading(false)
        }
        return
      }

      const nextContent = {
        parishProfile: parishProfileResult.data?.[0] ?? null,
        communities: communitiesResult.data ?? [],
        news: newsResult.data ?? [],
        clergy: clergyResult.data ?? [],
        massSchedules: massSchedulesResult.data ?? [],
        officeHours: officeHoursResult.data ?? [],
        usefulLinks: usefulLinksResult.data ?? [],
        pastorals: pastoralsResult.data ?? []
      }

      if (isMounted) {
        setContent(nextContent)
        setLoading(false)
      }
    }

    loadContent()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = sortByLabel([
    { label: 'Comunidades', value: content.communities.length.toString() },
    { label: 'Horários', value: content.massSchedules.length.toString() },
    { label: 'Notícias', value: content.news.length.toString() },
    { label: 'Pastorais', value: content.pastorals.length.toString() }
  ])

  return {
    ...content,
    stats,
    loading,
    error
  }
}
