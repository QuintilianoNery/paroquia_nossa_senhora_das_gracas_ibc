import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

type AdminUserPayload = {
  id?: string
  name?: string
  email?: string
  password?: string
  role?: 'admin'
}

function normalizeRole(role: unknown) {
  return role === 'admin' ? 'admin' : 'authenticated'
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

function getClients(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const authorization = req.headers.get('Authorization') ?? ''

  const userClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: authorization ? { Authorization: authorization } : {},
    },
  })

  const adminClient = createClient(supabaseUrl, serviceRoleKey)

  return { userClient, adminClient }
}

async function assertAdmin(req: Request) {
  const { userClient } = getClients(req)
  const { data, error } = await userClient.rpc('is_admin')
  if (error) throw new Error('Unable to verify admin access')
  if (!data) throw new Error('Forbidden')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    await assertAdmin(req)

    const { adminClient } = getClients(req)

    if (req.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405)
    }

    const payload = (await req.json()) as AdminUserPayload & { action?: string; query?: string }
    const action = payload.action ?? 'list'

    if (action === 'list') {
      const query = payload.query?.toLowerCase().trim() ?? ''
      const { data, error } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 200 })
      if (error) throw error

      const users = (data.users ?? []).map((user) => ({
        id: user.id,
        name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? '',
        email: user.email ?? '',
        role: normalizeRole(user.app_metadata?.role),
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      }))

      const filtered = query
        ? users.filter((user) =>
            [user.name, user.email, user.role].some((value) => value.toLowerCase().includes(query))
          )
        : users

      return json({ data: filtered })
    }

    if (action === 'create') {
      if (!payload.email || !payload.password) {
        return json({ error: 'Nome, email e senha são obrigatórios' }, 400)
      }

      const { data, error } = await adminClient.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
          name: payload.name ?? '',
          full_name: payload.name ?? '',
        },
        app_metadata: {
          role: 'admin',
        },
      })

      if (error) throw error

      return json({
        data: {
          id: data.user?.id,
          name: data.user?.user_metadata?.name ?? payload.name ?? '',
          email: data.user?.email ?? payload.email,
          role: 'admin',
        },
      }, 201)
    }

    if (action === 'update') {
      if (!payload.id) return json({ error: 'ID é obrigatório' }, 400)

      const updates: Record<string, unknown> = {
        user_metadata: {
          name: payload.name ?? '',
          full_name: payload.name ?? '',
        },
        app_metadata: {
          role: 'admin',
        },
      }

      if (payload.email) updates.email = payload.email
      if (payload.password) updates.password = payload.password

      const { data, error } = await adminClient.auth.admin.updateUserById(payload.id, updates)
      if (error) throw error

      return json({
        data: {
          id: data.user?.id,
          name: data.user?.user_metadata?.name ?? payload.name ?? '',
          email: data.user?.email ?? payload.email ?? '',
          role: normalizeRole(data.user?.app_metadata?.role) === 'admin' ? 'admin' : 'authenticated',
        },
      })
    }

    if (action === 'delete') {
      if (!payload.id) return json({ error: 'ID é obrigatório' }, 400)
      const { error } = await adminClient.auth.admin.deleteUser(payload.id)
      if (error) throw error
      return json({ ok: true })
    }

    return json({ error: 'Method not allowed' }, 405)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro inesperado'
    const status = message === 'Forbidden' ? 403 : 500
    return json({ error: message }, status)
  }
})
