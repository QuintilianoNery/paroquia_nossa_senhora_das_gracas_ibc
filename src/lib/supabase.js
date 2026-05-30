import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️  Variáveis de ambiente do Supabase não configuradas.')
  console.error('Copie .env.example para .env e preencha com suas credenciais.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
