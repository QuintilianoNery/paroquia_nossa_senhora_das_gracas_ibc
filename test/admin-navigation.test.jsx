import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CrudPage from '@features/admin/CrudPage'
import AdminParoquia from '@features/admin/paroquia'
import { supabase } from '@lib/supabase'

const navigateMock = vi.fn()

vi.mock('@lib/toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('@lib/hooks/useCrudOperations', () => ({
  useCrudOperations: () => ({ reorder: vi.fn() }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

function DummyForm({ onSave, saving }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({ name: 'Novo item' })
      }}
    >
      <button type="submit" disabled={saving}>Salvar teste</button>
    </form>
  )
}

function setupCrudSupabase({ failReloadAfterSave = true } = {}) {
  const orderMock = vi
    .fn()
    .mockResolvedValueOnce({ data: [{ id: '1', name: 'Primeiro' }], error: null })

  if (failReloadAfterSave) {
    orderMock.mockResolvedValueOnce({ data: null, error: { message: 'reload-failed' } })
  } else {
    orderMock.mockResolvedValueOnce({ data: [{ id: '1', name: 'Primeiro' }], error: null })
  }

  const selectMock = vi.fn(() => ({ order: orderMock }))
  const insertMock = vi.fn().mockResolvedValue({ error: null })
  const updateEqMock = vi.fn().mockResolvedValue({ error: null })
  const updateMock = vi.fn(() => ({ eq: updateEqMock }))

  supabase.from.mockImplementation(() => ({
    select: selectMock,
    insert: insertMock,
    update: updateMock,
    delete: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
  }))

  return { insertMock, updateMock, updateEqMock }
}

describe('Admin save navigation behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns to list after create even when list refresh fails', async () => {
    setupCrudSupabase({ failReloadAfterSave: true })

    render(
      <MemoryRouter>
        <CrudPage
          table="news"
          title="Notícias"
          columns={[{ key: 'name', label: 'Nome' }]}
          FormComponent={DummyForm}
          orderBy="created_at"
        />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Novo' }))
    expect(screen.getByRole('button', { name: 'Salvar teste' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Salvar teste' }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Salvar teste' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
    })

    expect(screen.getByText('reload-failed')).toBeInTheDocument()
  })

  it('returns to list after edit even when list refresh fails', async () => {
    const { updateEqMock } = setupCrudSupabase({ failReloadAfterSave: true })

    const { container } = render(
      <MemoryRouter>
        <CrudPage
          table="clergy"
          title="Clero"
          columns={[{ key: 'name', label: 'Nome' }]}
          FormComponent={DummyForm}
          orderBy="created_at"
        />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Primeiro')).toBeInTheDocument()
    })

    const editIcon = container.querySelector('.ti-edit')
    expect(editIcon).toBeTruthy()
    fireEvent.click(editIcon.closest('button'))

    expect(screen.getByRole('button', { name: 'Salvar teste' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Salvar teste' }))

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Salvar teste' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
    })

    expect(updateEqMock).toHaveBeenCalled()
    expect(screen.getByText('reload-failed')).toBeInTheDocument()
  })

  it('redirects parish page to dashboard after successful save', async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: { id: 1, title: 'Paróquia' }, error: null })
    const upsertMock = vi.fn().mockResolvedValue({ error: null })

    supabase.from.mockImplementation((table) => {
      if (table === 'parish_profile') {
        return {
          select: vi.fn(() => ({ single: singleMock })),
          upsert: upsertMock,
        }
      }

      return {
        select: vi.fn(() => ({ order: vi.fn().mockResolvedValue({ data: [], error: null }) })),
      }
    })

    render(
      <MemoryRouter>
        <AdminParoquia />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Salvar informações' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Salvar informações' }))

    await waitFor(() => {
      expect(upsertMock).toHaveBeenCalled()
      expect(navigateMock).toHaveBeenCalledWith('/admin')
    })
  })
})
