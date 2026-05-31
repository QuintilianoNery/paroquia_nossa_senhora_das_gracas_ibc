import { useState } from 'react'
import { supabase } from '@lib/supabase'

export function useCrudOperations(table) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  const create = async (values) => {
    setSaving(true)
    setError(null)
    try {
      const { data, error: err } = await supabase.from(table).insert([values]).select()
      if (err) throw err
      return data?.[0]
    } catch (err) {
      const msg = err?.message || String(err)
      setError(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const update = async (id, values) => {
    setSaving(true)
    setError(null)
    try {
      const { data, error: err } = await supabase.from(table).update(values).eq('id', id).select()
      if (err) throw err
      return data?.[0]
    } catch (err) {
      const msg = err?.message || String(err)
      setError(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    setDeleting(true)
    setError(null)
    try {
      const { error: err } = await supabase.from(table).delete().eq('id', id)
      if (err) throw err
    } catch (err) {
      const msg = err?.message || String(err)
      setError(msg)
      throw err
    } finally {
      setDeleting(false)
    }
  }

  const reorder = async ({ items, item, direction, orderField = 'created_at' }) => {
    const index = items.findIndex(current => current.id === item.id)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= items.length) return false

    const other = items[swapIndex]
    const currentValue = item[orderField]
    const swapValue = other[orderField]

    const [{ error: firstError }, { error: secondError }] = await Promise.all([
      supabase.from(table).update({ [orderField]: swapValue }).eq('id', item.id),
      supabase.from(table).update({ [orderField]: currentValue }).eq('id', other.id),
    ])

    if (firstError) throw firstError
    if (secondError) throw secondError

    return true
  }

  return { create, update, remove, reorder, saving, deleting, error, clearError: () => setError(null) }
}
