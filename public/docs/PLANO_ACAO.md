# 📋 Plano de Ação — Paróquia NSG

Checklist priorizado para implementar recomendações da revisão técnica.

---

## 🚨 AÇÕES IMEDIATAS (24 horas)

### 1. Segurança — Invalidar Chaves Expostas
- [ ] **Entrar no painel Supabase** → Settings → API
- [ ] **Copiar a ANON_KEY atual** (para saber qual invalidar)
- [ ] **Rolar para ANON KEYS** e invalidar a chave exposta
- [ ] **Gerar nova ANON_KEY**
- [ ] **Atualizar `.env` localmente**
- [ ] **Não fazer commit do `.env`**
- [ ] **Verificar GitHub history:**
  ```bash
  git log --all --source --oneline -S "VITE_SUPABASE_ANON_KEY"
  ```
  Se aparecer em histórico, será necessário fazer `git filter-branch` ou usar BFG Repo-Cleaner.

### 2. Adicionar `.gitignore` Correto
- [ ] Abrir arquivo `.gitignore`
- [ ] Verificar se contém `.env`
- [ ] Se não, adicionar linhas:
  ```
  .env
  .env.local
  .env.*.local
  ```
- [ ] Fazer commit:
  ```bash
  git add .gitignore
  git commit -m "chore: add .env to gitignore"
  ```

### 3. Criar `.env.example`
- [ ] Criar arquivo `c:\...\paroquia_nossa_senhora_das_gracas_ibc\.env.example`
- [ ] Adicionar conteúdo (ver arquivo RECOMENDACOES_CODIGO.md)
- [ ] Fazer commit

---

## 🔴 CRÍTICA (3-7 dias)

### 4. Implementar RLS com Validação de Admin
- [ ] Conectar ao SQL Editor do Supabase
- [ ] Executar migration `006_fix_rls_admin.sql` (ver RECOMENDACOES_CODIGO.md)
- [ ] Verificar se políticas foram criadas:
  ```sql
  SELECT * FROM pg_policies WHERE tablename IN (
    'parish_profile', 'communities', 'news', 'clergy', 'pastorals'
  );
  ```

### 5. Corrigir AuthContext.jsx
- [ ] Abrir `src/features/auth/AuthContext.jsx`
- [ ] Implementar timeout de sessão (30 minutos)
- [ ] Adicionar `isAdmin` ao contexto
- [ ] Adicionar tratamento de erro em `getSession()`
- [ ] Testar logout automático após 30 min de inatividade

### 6. Corrigir ProtectedRoute.jsx
- [ ] Abrir `src/features/auth/ProtectedRoute.jsx`
- [ ] Aceitar prop `requireAdmin = true`
- [ ] Verificar se `isAdmin` é true antes de renderizar
- [ ] Teste: Tentar acessar `/admin` com usuário não-admin
  - Deve redirecionar para `/`

### 7. Criar Hooks Customizados
- [ ] Criar `src/lib/hooks/useSupabaseQuery.js`
- [ ] Criar `src/lib/hooks/useCrudOperations.js`
- [ ] Adicionar ambos a um arquivo `index.js`:
  ```jsx
  export { useSupabaseQuery, useSupabaseQuerySingle } from './useSupabaseQuery'
  export { useCrudOperations } from './useCrudOperations'
  ```
- [ ] Testes: Usar em um componente pequeno (ex: Pastorais.jsx)

---

## 🟠 ALTA (1-2 semanas)

### 8. Implementar Toast Service
- [ ] Criar `src/lib/toast.js`
- [ ] Criar `src/components/ToastProvider.jsx`
- [ ] Adicionar `<ToastProvider>` em `main.jsx`
- [ ] Substituir `alert()` por `toast.error()` em:
  - [ ] CrudPage.jsx
  - [ ] Formulários de admin
  - [ ] Contato.jsx

### 9. Corrigir uploadMedia.js
- [ ] Adicionar validação de tamanho (5MB max)
- [ ] Adicionar validação de tipo de arquivo
- [ ] Melhorar mensagens de erro
- [ ] Testes: Tentar upload de arquivo muito grande
  - Deve mostrar erro claro

### 10. Corrigir Comunidades.jsx
- [ ] Adicionar flag `isMounted` para cleanup
- [ ] Adicionar `try/catch` adequado
- [ ] Mostrar erro se fetch falhar
- [ ] Testes: Desligar internet, recarregar
  - Deve mostrar placeholder

### 11. Corrigir AdminDashboard.jsx
- [ ] Usar `Promise.all()` para múltiplas queries
- [ ] Adicionar `try/catch`
- [ ] Adicionar `finally` para parar loading
- [ ] Testes: Verificar se todas as queries são executadas

### 12. Implementar Error Boundary
- [ ] Criar `src/components/ErrorBoundary.jsx`
- [ ] Usar em `App.jsx`
- [ ] Testes: Simular erro em componente
  - Deve mostrar página de erro sem derrubar app

---

## 🟡 MÉDIA (2-4 semanas)

### 13. Refatorar CrudPage.jsx
- [ ] Dividir em componentes menores:
  - [ ] `CrudList.jsx` — Apenas listagem
  - [ ] `CrudForm.jsx` — Apenas formulário
  - [ ] `useCrudPage.js` — Lógica
- [ ] Remover lógica de reordenação para hook separado
- [ ] Adicionar confirmação de exclusão

### 14. Criar Camada de Serviços
- [ ] Criar `src/lib/services/`
- [ ] Criar serviços para cada tabela:
  - [ ] communitiesService.js
  - [ ] newsService.js
  - [ ] clergyService.js
  - [ ] parishService.js
  - [ ] pastoralsService.js
  - [ ] massSchedulesService.js
  - [ ] usefulLinksService.js
- [ ] Usar serviços em componentes em vez de queries diretas

### 15. Migrar para CSS Modules
- [ ] Criar `src/styles/*.module.css`
- [ ] Migrar estilos de `style={{...}}` para classes
- [ ] Priorizar componentes frequentemente usados

### 16. Adicionar Validação de Slug Único
- [ ] Implementar `refine()` em schemas Zod
- [ ] Verificar duplicação antes de insert/update
- [ ] Testar: Tentar criar dois items com mesmo slug
  - Deve mostrar erro

### 17. Adicionar Índices ao Banco
- [ ] Conectar ao SQL Editor
- [ ] Executar:
  ```sql
  create index idx_news_published_published_at 
    on public.news(is_published, published_at DESC);
  
  create index idx_communities_published_order 
    on public.communities(is_published, manual_order);
  ```

---

## 🟢 BAIXA (1+ mês)

### 18. TypeScript (Opcional)
- [ ] Instalar @types/react, @types/node
- [ ] Converter componentes críticos para .tsx
- [ ] Adicionar tsconfig.json

### 19. Testes Unitários
- [ ] Instalar Vitest ou Jest
- [ ] Testar hooks customizados
- [ ] Testar funções de serviço
- [ ] Coverage: Mínimo 70%

### 20. Otimizar Performance
- [ ] Implementar React.memo() em componentes reutilizáveis
- [ ] Usar useCallback em event handlers
- [ ] Adicionar code splitting para admin routes
- [ ] Lazy load imagens

### 21. PWA
- [ ] Adicionar web manifest
- [ ] Service worker para offline
- [ ] Adicionar ao home screen

---

## ✅ Checklist de Testes

Após cada implementação, verificar:

### Autenticação
- [ ] Login com credenciais válidas funciona
- [ ] Login com credenciais inválidas mostra erro
- [ ] Logout limpa sessão
- [ ] Refresh da página mantém autenticação
- [ ] 30 minutos de inatividade faz logout automático
- [ ] Usuário não-admin não consegue acessar `/admin`

### CRUD
- [ ] Criar novo item salva no banco
- [ ] Editar item atualiza no banco
- [ ] Deletar item remove do banco
- [ ] Validações de formulário funcionam
- [ ] Slug não permite duplicação
- [ ] Imagem é enviada corretamente
- [ ] Tamanho máximo de imagem é validado

### Performance
- [ ] Não há memory leaks (DevTools)
- [ ] useEffect cleanup funciona
- [ ] Não há renderizações desnecessárias
- [ ] Queries não são duplicadas

### Segurança
- [ ] Nenhum console.log com dados sensíveis
- [ ] RLS impede leitura de dados privados
- [ ] RLS impede escrita de dados por não-admin
- [ ] Não há exposição de secrets no frontend

---

## 📅 Timeline Sugerida

```
Semana 1 (Maio 30 - Junho 6)
├─ Seg: Ações imediatas (segurança)
├─ Ter-Qua: RLS, AuthContext, ProtectedRoute
├─ Qui-Sex: Hooks customizados, Toast

Semana 2-3 (Junho 7-20)
├─ Corrigir componentes (Comunidades, Dashboard)
├─ Refatorar CrudPage
├─ Implementar Error Boundary

Semana 4 (Junho 21-27)
├─ Camada de serviços
├─ CSS Modules
├─ Índices de banco

Semana 5+ (Junho 28+)
├─ TypeScript
├─ Testes
├─ Optimizações
```

---

## 🔗 Referências de Ajuda

### Supabase
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth Reference](https://supabase.com/docs/reference/javascript/auth-getsession)
- [Storage](https://supabase.com/docs/reference/javascript/storage-createbucket)

### React
- [Hooks Best Practices](https://react.dev/reference/react)
- [useEffect Cleanup](https://react.dev/reference/react/useEffect#returning-a-cleanup-function)
- [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

### Segurança
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## 📞 Suporte

Se tiver dúvidas sobre a implementação:
1. Consulte os arquivos REVISAO_TECNICA.md e RECOMENDACOES_CODIGO.md
2. Procure exemplos em componentes similares
3. Teste incrementalmente (una funcionalidade por vez)
4. Use console.log() para debug (remova depois!)

---

**Última atualização:** 30 de maio de 2026  
**Responsável:** Engenheira de Software  
**Status:** ⏳ Aguardando implementação
