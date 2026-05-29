import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { slugify } from '../../lib/slugify'
import { Button, Card } from '../../components/ui'

function buildEmptyForm(fields) {
  return fields.reduce((state, field) => {
    state[field.name] = field.type === 'checkbox' ? false : ''
    return state
  }, {})
}

function toFormValue(field, value) {
  if (field.type === 'checkbox') return Boolean(value)
  if (field.type === 'number') return value ?? ''
  if (field.type === 'datetime-local') {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return value ?? ''
}

function toDatabaseValue(field, value) {
  if (field.type === 'checkbox') return Boolean(value)
  if (field.type === 'number') {
    if (value === '' || value == null) return null
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (field.type === 'datetime-local') {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date.toISOString()
  }
  return typeof value === 'string' ? value.trim() : value
}

function formatDisplayValue(field, value, relationMaps) {
  if (value == null || value === '') return '—'
  if (field.type === 'checkbox') return value ? 'Sim' : 'Não'
  if (field.type === 'datetime-local') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('pt-BR')
  }
  if (field.type === 'select' && field.relation) {
    return relationMaps[field.relation]?.[value] ?? value
  }
  return String(value)
}

function getFieldComponentType(field) {
  if (field.type === 'textarea') return 'textarea'
  if (field.type === 'select') return 'select'
  if (field.type === 'checkbox') return 'checkbox'
  if (field.type === 'number') return 'number'
  if (field.type === 'datetime-local') return 'datetime-local'
  return 'text'
}

export function AdminCrudPage({ config, userId }) {
  const [records, setRecords] = useState([])
  const [relations, setRelations] = useState({})
  const [formState, setFormState] = useState(() => buildEmptyForm(config.fields))
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const relationMaps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(relations).map(([fieldName, options]) => [
          fieldName,
          Object.fromEntries(options.map((option) => [option.value, option.label]))
        ])
      ),
    [relations]
  )

  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return records
    return records.filter((record) =>
      config.listFields.some((fieldName) => String(record[fieldName] ?? '').toLowerCase().includes(term))
    )
  }, [config.listFields, records, searchTerm])

  async function loadData() {
    setLoading(true)
    setError('')

    if (!supabase) {
      setError('Configure as variáveis do Supabase para usar o CRUD administrativo.')
      setLoading(false)
      return
    }

    const [recordsResult, ...relationResults] = await Promise.all([
      supabase
        .from(config.table)
        .select('*')
        .order(config.orderBy ?? 'created_at', { ascending: config.ascending ?? false }),
      ...(config.relations ?? []).map((relation) =>
        supabase
          .from(relation.table)
          .select(`${relation.valueField}, ${relation.labelField}`)
          .order(relation.orderBy ?? relation.labelField, { ascending: relation.ascending ?? true })
      )
    ])

    if (recordsResult.error) {
      setError(recordsResult.error.message)
      setRecords([])
      setActiveId(null)
      setFormState(buildEmptyForm(config.fields))
    } else {
      const nextRecords = recordsResult.data ?? []
      setRecords(nextRecords)
      const firstRecord = nextRecords[0]

      if (config.singleton && firstRecord) {
        setActiveId(firstRecord.id)
        setFormState(
          config.fields.reduce((state, field) => {
            state[field.name] = toFormValue(field, firstRecord[field.name])
            return state
          }, {})
        )
      } else if (config.singleton) {
        setActiveId(null)
        setFormState(buildEmptyForm(config.fields))
      }
    }

    if (config.relations?.length) {
      const nextRelations = {}
      relationResults.forEach((result, index) => {
        const relation = config.relations[index]
        if (!relation) return
        nextRelations[relation.field] = (result.data ?? []).map((item) => ({
          value: item[relation.valueField],
          label: item[relation.labelField]
        }))
      })
      setRelations(nextRelations)
    } else {
      setRelations({})
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [config.table])

  function resetForm() {
    setActiveId(null)
    setFormState(buildEmptyForm(config.fields))
  }

  function handleEdit(record) {
    setActiveId(record.id)
    setFormState(
      config.fields.reduce((state, field) => {
        state[field.name] = toFormValue(field, record[field.name])
        return state
      }, {})
    )
  }

  async function handleDelete(recordId) {
    if (!supabase) return
    if (!confirm('Tem certeza que deseja excluir este registro?')) return
    setSaving(true)
    setError('')

    const { error: deleteError } = await supabase.from(config.table).delete().eq('id', recordId)
    if (deleteError) {
      setError(deleteError.message)
    } else {
      await loadData()
      if (activeId === recordId) {
        resetForm()
      }
    }

    setSaving(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!supabase) {
      setError('Configure as variáveis do Supabase para salvar registros.')
      return
    }

    setSaving(true)
    setError('')

    const payload = config.fields.reduce((nextPayload, field) => {
      nextPayload[field.name] = toDatabaseValue(field, formState[field.name])
      return nextPayload
    }, {})

    if (config.slugSourceField && !payload.slug && payload[config.slugSourceField]) {
      payload.slug = slugify(payload[config.slugSourceField])
    }

    if (!activeId && userId) {
      payload.created_by = userId
    }

    let mutationResult
    if (config.singleton) {
      mutationResult = activeId
        ? await supabase.from(config.table).update(payload).eq('id', activeId)
        : await supabase.from(config.table).insert(payload)
    } else if (activeId) {
      mutationResult = await supabase.from(config.table).update(payload).eq('id', activeId)
    } else {
      mutationResult = await supabase.from(config.table).insert(payload)
    }

    if (mutationResult.error) {
      setError(mutationResult.error.message)
    } else {
      await loadData()
      if (!config.singleton) {
        resetForm()
      }
    }

    setSaving(false)
  }

  function handleFieldChange(field, value) {
    setFormState((current) => {
      const nextState = { ...current, [field.name]: value }
      if (field.name === config.slugSourceField && config.fields.some((item) => item.name === 'slug')) {
        const currentSlug = String(current.slug ?? '').trim()
        if (!currentSlug) {
          nextState.slug = slugify(value)
        }
      }
      return nextState
    })
  }

  const emptyState = !loading && filteredRecords.length === 0

  return (
    <div className="admin-section crud-page">
      <div className="admin-crud-header">
        <div>
          <span className="eyebrow">Cadastro</span>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
        <div className="crud-toolbar">
          <Button type="button" className="btn-secondary" onClick={loadData} disabled={loading || saving}>Atualizar</Button>
          {!config.singleton ? <Button type="button" onClick={resetForm}>Novo registro</Button> : null}
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="crud-search-row">
        <input
          className="crud-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar registros na tabela"
        />
        <span className="crud-count">{filteredRecords.length} registro(s)</span>
      </div>

      <div className="admin-crud-grid crud-grid">
        <Card className="crud-list-card">
          <h3>Listagem</h3>
          <p>Editar, excluir e acompanhar os registros do Supabase.</p>
          {loading ? <p>Carregando registros...</p> : null}
          {!loading && emptyState ? <p>Nenhum registro encontrado.</p> : null}

          {!loading && filteredRecords.length > 0 ? (
            <div className="crud-table-wrap">
              <table className="crud-table">
                <thead>
                  <tr>
                    {config.listFields.map((fieldName) => (
                      <th key={fieldName}>{config.fields.find((field) => field.name === fieldName)?.label ?? fieldName}</th>
                    ))}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      {config.listFields.map((fieldName) => {
                        const field = config.fields.find((item) => item.name === fieldName) ?? { name: fieldName, type: 'text' }
                        return <td key={fieldName}>{formatDisplayValue(field, record[fieldName], relationMaps)}</td>
                      })}
                      <td className="crud-actions">
                        <button type="button" className="crud-link" onClick={() => handleEdit(record)}>Editar</button>
                        {!config.singleton ? (
                          <button type="button" className="crud-link danger" onClick={() => handleDelete(record.id)} disabled={saving}>
                            Excluir
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Card>

        <Card className="crud-form-card">
          <h3>{activeId ? 'Editar registro' : config.singleton ? 'Registro único' : 'Criar registro'}</h3>
          <form className="crud-form" onSubmit={handleSubmit}>
            {config.fields.map((field) => {
              const inputType = getFieldComponentType(field)
              return (
                <label key={field.name} className={`crud-field crud-field--${inputType}`}>
                  <span>
                    {field.label}
                    {field.required ? ' *' : ''}
                  </span>
                  {inputType === 'textarea' ? (
                    <textarea
                      rows={field.rows ?? 4}
                      value={formState[field.name]}
                      onChange={(event) => handleFieldChange(field, event.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : inputType === 'select' ? (
                    <select
                      value={formState[field.name]}
                      onChange={(event) => handleFieldChange(field, event.target.value)}
                      required={field.required}
                    >
                      <option value="">{field.placeholder ?? 'Selecione'}</option>
                      {(relations[field.relation] ?? field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : inputType === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={Boolean(formState[field.name])}
                      onChange={(event) => handleFieldChange(field, event.target.checked)}
                    />
                  ) : (
                    <input
                      type={inputType}
                      value={formState[field.name]}
                      onChange={(event) => handleFieldChange(field, event.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.helpText ? <small>{field.helpText}</small> : null}
                </label>
              )
            })}

            <div className="crud-form-actions">
              <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
              {!config.singleton ? (
                <Button type="button" className="btn-secondary" onClick={resetForm} disabled={saving}>Limpar</Button>
              ) : null}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
