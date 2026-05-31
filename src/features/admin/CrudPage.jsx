import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@lib/supabase'
import { toast } from '@lib/toast'
import { useCrudOperations } from '@lib/hooks/useCrudOperations'

/**
 * CrudPage — componente genérico de listagem + CRUD para o painel admin.
 * Props:
 *   table        string   — nome da tabela no Supabase
 *   title        string   — título da seção
 *   columns      array    — [{ key, label, render? }]
 *   FormComponent         — componente de formulário (recebe onSave, onCancel, item)
 *   orderBy      string   — campo de ordenação (default: 'created_at')
 *   reorderField string   — campo numérico que será reordenado manualmente (opcional)
 *   searchField  string   — campo para busca (default: null)
 *   canReorder   boolean  — habilita botões de ordenação manual
 */
export default function CrudPage({
  table, title, columns, FormComponent,
  orderBy = 'created_at', reorderField = null, searchField = null, canReorder = false
}) {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [editing, setEditing] = useState(null)   // null = list, 'new' = criar, item = editar
  const [deleting,setDeleting]= useState(null)   // item a excluir
  const [saving,  setSaving]  = useState(false)
  const { reorder } = useCrudOperations(table)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    let q = supabase.from(table).select('*').order(orderBy, { ascending: true })
    const { data, error } = await q
    if (error) setError(error.message)
    else setItems(data)
    setLoading(false)
  }, [table, orderBy])

  useEffect(() => { fetchItems() }, [fetchItems])

  const filtered = search && searchField
    ? items.filter(i => String(i[searchField] ?? '').toLowerCase().includes(search.toLowerCase()))
    : items

  const handleSave = async (values) => {
    setSaving(true)
    try {
      const orderField = reorderField

      if (editing === 'new') {
        if (orderField) {
          // Insert: shift rows when manual reordering is enabled
          const newOrder = Number(values[orderField] ?? 0)
          if (newOrder && newOrder > 0) {
            const { data: toShift, error: selErr } = await supabase.from(table).select('id,' + orderField).gte(orderField, newOrder)
            if (selErr) throw selErr
            for (const r of toShift || []) {
              const upd = await supabase.from(table).update({ [orderField]: (r[orderField] ?? 0) + 1 }).eq('id', r.id)
              if (upd.error) throw upd.error
            }
          } else {
            const { data: maxRow } = await supabase.from(table).select(orderField).order(orderField, { ascending: false }).limit(1)
            const next = (maxRow && maxRow[0] && Number(maxRow[0][orderField] ?? 0)) ? Number(maxRow[0][orderField]) + 1 : 1
            values[orderField] = next
          }
        }
        const { error } = await supabase.from(table).insert(values)
        if (error) throw error
      } else {
        // Update: only shift ranges if the table actually uses a manual reorder field
        if (orderField) {
          const oldOrder = Number(editing[orderField] ?? 0)
          const newOrder = Number(values[orderField] ?? 0)
          if (oldOrder !== newOrder) {
            if (newOrder <= 0) values[orderField] = 1

            if (newOrder < oldOrder) {
              const { data: toShift, error: selErr } = await supabase.from(table).select('id,' + orderField).gte(orderField, newOrder).lt(orderField, oldOrder).neq('id', editing.id)
              if (selErr) throw selErr
              for (const r of toShift || []) {
                const upd = await supabase.from(table).update({ [orderField]: (r[orderField] ?? 0) + 1 }).eq('id', r.id)
                if (upd.error) throw upd.error
              }
            } else if (newOrder > oldOrder) {
              const { data: toShift, error: selErr } = await supabase.from(table).select('id,' + orderField).lte(orderField, newOrder).gt(orderField, oldOrder).neq('id', editing.id)
              if (selErr) throw selErr
              for (const r of toShift || []) {
                const upd = await supabase.from(table).update({ [orderField]: (r[orderField] ?? 0) - 1 }).eq('id', r.id)
                if (upd.error) throw upd.error
              }
            }
          }
        }

        const { error } = await supabase.from(table).update(values).eq('id', editing.id)
        if (error) throw error
      }
      setEditing(null)
      await fetchItems()
    } catch (e) {
      toast.error('Erro ao salvar: ' + (e?.message || String(e)))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)
    try {
      const { error } = await supabase.from(table).delete().eq('id', deleting.id)
      if (error) throw error
      await fetchItems()
      setDeleting(null)
      toast.success('Registro excluído')
    } catch (err) {
      toast.error('Erro ao excluir: ' + (err?.message || String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleReorder = async (item, direction) => {
    try {
      const orderField = reorderField || orderBy || 'created_at'
      const changed = await reorder({ items, item, direction, orderField })
      if (!changed) return
      await fetchItems()
    } catch (err) {
      toast.error('Erro ao reordenar: ' + (err?.message || String(err)))
    }
  }

  // ── Form view ──────────────────────────────────────────
  if (editing !== null) {
    return (
      <div>
        <button
          onClick={() => setEditing(null)}
          className="btn btn-ghost"
          style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <i className="ti ti-arrow-left"></i> Voltar
        </button>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {editing === 'new' ? `Novo — ${title}` : `Editar — ${title}`}
        </h1>
        <div className="card" style={{ maxWidth: 680 }}>
          <div className="card-body">
            <FormComponent
              item={editing === 'new' ? null : editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── List view ──────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.75rem' }}>{title}</h1>
        <button className="btn btn-teal btn-sm" onClick={() => setEditing('new')}>
          <i className="ti ti-plus"></i> Novo
        </button>
      </div>

      {/* Search */}
      {searchField && (
        <div style={{ marginBottom: 16, maxWidth: 360 }}>
          <input
            type="search"
            className="form-input"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a9aaa' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='M21 21l-4.35-4.35'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: '10px center' }}
          />
        </div>
      )}

      {/* Errors */}
      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}><i className="ti ti-alert-circle"></i>{error}</div>}

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                {canReorder && <th style={{ width: 80 }}>Ordem</th>}
                {columns.map(c => <th key={c.key}>{c.label}</th>)}
                <th style={{ width: 140, textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={columns.length + (canReorder ? 2 : 1)} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                  <i className="ti ti-loader-2" style={{ fontSize: 20 }}></i>
                </td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={columns.length + (canReorder ? 2 : 1)} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                  Nenhum registro encontrado.
                </td></tr>
              )}
              {!loading && filtered.map((item, idx) => (
                <tr key={item.id}>
                  {canReorder && (
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handleReorder(item, 'up')} className="btn btn-sm" style={{ padding: '4px 8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 4 }} disabled={idx === 0}>
                          <i className="ti ti-chevron-up" style={{ fontSize: 13 }}></i>
                        </button>
                        <button onClick={() => handleReorder(item, 'down')} className="btn btn-sm" style={{ padding: '4px 8px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 4 }} disabled={idx === filtered.length - 1}>
                          <i className="ti ti-chevron-down" style={{ fontSize: 13 }}></i>
                        </button>
                      </div>
                    </td>
                  )}
                  {columns.map(c => (
                    <td key={c.key}>{c.render ? c.render(item[c.key], item) : String(item[c.key] ?? '—')}</td>
                  ))}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-sm" onClick={() => setEditing(item)} style={{ background: 'var(--teal-xlight)', color: 'var(--teal-dark)', border: 'none' }}>
                        <i className="ti ti-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleting(item)}>
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleting && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3><i className="ti ti-alert-triangle" style={{ color: '#dc2626', marginRight: 8 }}></i>Confirmar exclusão</h3>
              <button onClick={() => setDeleting(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}><i className="ti ti-x"></i></button>
            </div>
            <div className="modal-body">
              <p>Esta ação não pode ser desfeita. Deseja realmente excluir este registro?</p>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setDeleting(null)} style={{ background: 'var(--cream)', color: 'var(--text)' }}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
