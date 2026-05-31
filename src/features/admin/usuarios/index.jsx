import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@lib/supabase'
import { toast } from '@lib/toast'

const schema = z.object({
  name: z.string().min(2, 'Informe o nome'),
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().optional(),
})

const initialFormValues = {
  name: '',
  email: '',
  password: '',
}

function getEdgeFunctionErrorMessage(err) {
  const message = err?.message || ''

  if (message.includes('Failed to send a request to the Edge Function') || message.includes('404')) {
    return 'A função admin-users ainda não foi publicada no Supabase. Implemente e faça deploy da Edge Function supabase/functions/admin-users.'
  }

  return message || 'Erro ao processar a operação'
}

function UserForm({ item, onSave, onCancel, saving }) {
  const isEditing = Boolean(item?.id)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialFormValues,
  })

  useEffect(() => {
    reset(item ? { name: item.name ?? '', email: item.email ?? '', password: '' } : initialFormValues)
  }, [item, reset])

  const submit = async (values) => {
    await onSave({
      ...values,
      password: values.password?.trim() || '',
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nome *</label>
          <input {...register('name')} className="form-input" placeholder="Nome do usuário" />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <label className="form-label">E-mail *</label>
          <input {...register('email')} className="form-input" type="email" placeholder="usuario@dominio.com" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Senha {isEditing ? '(opcional para alterar)' : '*'}</label>
        <input {...register('password')} className="form-input" type="password" placeholder={isEditing ? 'Nova senha opcional' : 'Senha inicial'} />
        <div className="form-hint">Novos usuários serão criados com perfil administrativo no Supabase Auth.</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button type="submit" className="btn btn-teal" disabled={saving}>
          {saving ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
        </button>
        <button type="button" className="btn" onClick={onCancel} style={{ background: 'var(--cream)', color: 'var(--text)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function AdminUsuarios() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'list' },
      })
      if (error) throw error
      setItems(data?.data ?? [])
    } catch (err) {
      toast.error(getEdgeFunctionErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSave = async (values) => {
    const action = editing?.id ? 'update' : 'create'
    if (!editing?.id && !values.password) {
      toast.error('A senha é obrigatória para novo usuário')
      return
    }

    setSaving(true)
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: {
          action,
          id: editing?.id,
          name: values.name,
          email: values.email,
          password: values.password || undefined,
        },
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      toast.success(editing?.id ? 'Usuário atualizado' : 'Usuário criado como admin')
      setEditing(null)
      await fetchUsers()
    } catch (err) {
      toast.error(getEdgeFunctionErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)
    try {
      const { data, error } = await supabase.functions.invoke('admin-users', {
        body: { action: 'delete', id: deleting.id },
      })
      if (error) throw error
      if (data?.error) throw new Error(data.error)
      toast.success('Usuário excluído')
      setDeleting(null)
      await fetchUsers()
    } catch (err) {
      toast.error(getEdgeFunctionErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const title = useMemo(() => (editing ? (editing.id ? 'Editar usuário' : 'Novo usuário') : 'Usuários'), [editing])
  const normalizeRole = (role) => (role === 'admin' ? 'admin' : 'authenticated')

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
          {title}
        </h1>
        <div className="card" style={{ maxWidth: 720 }}>
          <div className="card-body">
            <UserForm item={editing.id ? editing : null} onSave={handleSave} onCancel={() => setEditing(null)} saving={saving} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--teal-xdark)', fontSize: '1.75rem' }}>Usuários</h1>
        <button className="btn btn-teal btn-sm" onClick={() => setEditing({})}>
          <i className="ti ti-user-plus"></i> Novo
        </button>
      </div>

      <p className="section-sub" style={{ marginBottom: 20 }}>
        Cadastre usuários administrativos. A listagem abaixo é carregada diretamente do Supabase Auth.
      </p>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Último login</th>
                <th style={{ width: 140, textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                    <i className="ti ti-loader-2" style={{ fontSize: 20 }}></i>
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
              {!loading && items.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || '—'}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${normalizeRole(user.role) === 'admin' ? 'badge-green' : 'badge-gray'}`}>
                      {normalizeRole(user.role)}
                    </span>
                  </td>
                  <td>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('pt-BR') : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-sm"
                        onClick={() => setEditing(user)}
                        style={{ background: 'var(--teal-xlight)', color: 'var(--teal-dark)', border: 'none' }}
                      >
                        <i className="ti ti-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleting(user)}>
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

      {deleting && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3><i className="ti ti-alert-triangle" style={{ color: '#dc2626', marginRight: 8 }}></i>Confirmar exclusão</h3>
              <button onClick={() => setDeleting(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>
                <i className="ti ti-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Esta ação remove o usuário do Auth do Supabase. Deseja continuar?</p>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setDeleting(null)} style={{ background: 'var(--cream)', color: 'var(--text)' }}>
                Cancelar
              </button>
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
