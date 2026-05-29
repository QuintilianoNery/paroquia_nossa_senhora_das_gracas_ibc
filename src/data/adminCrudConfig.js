export const adminNavItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/comunidades', label: 'Comunidades' },
  { to: '/admin/noticias', label: 'Notícias' },
  { to: '/admin/clero', label: 'Clero' },
  { to: '/admin/horarios', label: 'Missas' },
  { to: '/admin/secretaria', label: 'Secretaria' },
  { to: '/admin/links', label: 'Links' },
  { to: '/admin/pastorais', label: 'Pastorais' },
  { to: '/admin/configuracoes', label: 'Configurações' }
]

export const adminCrudConfig = {
  communities: {
    table: 'communities',
    title: 'Comunidades',
    description: 'Cadastro real com slug, mapa, história, imagem e controle de publicação.',
    slugSourceField: 'name',
    orderBy: 'manual_order',
    ascending: true,
    listFields: ['name', 'slug', 'manual_order', 'is_published'],
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', helpText: 'Pode ser gerado automaticamente a partir do nome.' },
      { name: 'history', label: 'História', type: 'textarea', rows: 5 },
      { name: 'address', label: 'Endereço', type: 'text' },
      { name: 'google_maps_url', label: 'Google Maps URL', type: 'text' },
      { name: 'latitude', label: 'Latitude', type: 'number' },
      { name: 'longitude', label: 'Longitude', type: 'number' },
      { name: 'saint_story_url', label: 'URL da história do padroeiro', type: 'text' },
      { name: 'hero_image_url', label: 'Imagem de destaque', type: 'text' },
      { name: 'manual_order', label: 'Ordem manual', type: 'number' },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  },
  news: {
    table: 'news',
    title: 'Notícias',
    description: 'Cadastro de notícias com slug, resumo, conteúdo e data de publicação.',
    slugSourceField: 'title',
    orderBy: 'published_at',
    ascending: false,
    listFields: ['title', 'slug', 'published_at', 'is_published'],
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'summary', label: 'Resumo', type: 'textarea', rows: 4 },
      { name: 'content', label: 'Conteúdo', type: 'textarea', rows: 8 },
      { name: 'cover_image_url', label: 'Imagem de capa', type: 'text' },
      { name: 'published_at', label: 'Data de publicação', type: 'datetime-local' },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  },
  clergy: {
    table: 'clergy',
    title: 'Clero',
    description: 'Cadastro de pároco, vigário e diácono com destaque do atual.',
    orderBy: 'manual_order',
    ascending: true,
    listFields: ['name', 'role', 'is_current', 'is_published'],
    fields: [
      { name: 'name', label: 'Nome', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea', rows: 5 },
      { name: 'photo_url', label: 'Foto', type: 'text' },
      {
        name: 'role',
        label: 'Função',
        type: 'select',
        options: [
          { label: 'Pároco', value: 'paroco' },
          { label: 'Vigário', value: 'vigario' },
          { label: 'Diácono', value: 'diacono' }
        ]
      },
      { name: 'is_current', label: 'Atual', type: 'checkbox' },
      { name: 'manual_order', label: 'Ordem manual', type: 'number' },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  },
  mass_schedules: {
    table: 'mass_schedules',
    title: 'Horários de missa',
    description: 'Cadastro real de celebrações por comunidade, dia da semana e local.',
    orderBy: 'created_at',
    ascending: false,
    listFields: ['weekday', 'celebration', 'schedule_time', 'community_id', 'is_published'],
    relations: [
      {
        field: 'community_id',
        table: 'communities',
        labelField: 'name',
        valueField: 'id',
        orderBy: 'name',
        ascending: true
      }
    ],
    fields: [
      {
        name: 'community_id',
        label: 'Comunidade',
        type: 'select',
        relation: 'community_id',
        placeholder: 'Selecione uma comunidade'
      },
      { name: 'weekday', label: 'Dia da semana', type: 'text', required: true },
      { name: 'celebration', label: 'Celebração', type: 'text', required: true },
      { name: 'schedule_time', label: 'Horário', type: 'text', required: true },
      { name: 'place', label: 'Local', type: 'text' },
      { name: 'notes', label: 'Observações', type: 'textarea', rows: 4 },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  },
  office_hours: {
    table: 'office_hours',
    title: 'Horários da secretaria',
    description: 'Cadastro de atendimento paroquial, secretaria e serviços.',
    orderBy: 'created_at',
    ascending: false,
    listFields: ['label', 'schedule_text', 'is_published'],
    fields: [
      { name: 'label', label: 'Título', type: 'text', required: true },
      { name: 'schedule_text', label: 'Texto do horário', type: 'textarea', rows: 5, required: true },
      { name: 'notes', label: 'Observações', type: 'textarea', rows: 4 },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  },
  useful_links: {
    table: 'useful_links',
    title: 'Links úteis e liturgia',
    description: 'Cadastro de links externos com categoria e ordenação manual.',
    orderBy: 'manual_order',
    ascending: true,
    listFields: ['title', 'category', 'manual_order', 'is_published'],
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea', rows: 4 },
      { name: 'category', label: 'Categoria', type: 'text' },
      { name: 'manual_order', label: 'Ordem manual', type: 'number' },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  },
  pastorals: {
    table: 'pastorals',
    title: 'Pastorais',
    description: 'Cadastro de pastorais e movimentos com imagem opcional.',
    orderBy: 'manual_order',
    ascending: true,
    listFields: ['title', 'manual_order', 'is_published'],
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea', rows: 5 },
      { name: 'image_url', label: 'Imagem', type: 'text' },
      { name: 'manual_order', label: 'Ordem manual', type: 'number' },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  },
  parish_profile: {
    table: 'parish_profile',
    title: 'Configurações gerais',
    description: 'Registro único da paróquia com contato, localização e texto institucional.',
    singleton: true,
    orderBy: 'created_at',
    ascending: false,
    listFields: ['title', 'phone', 'email', 'is_published'],
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'content', label: 'Conteúdo', type: 'textarea', rows: 6 },
      { name: 'address', label: 'Endereço', type: 'text' },
      { name: 'google_maps_url', label: 'Google Maps URL', type: 'text' },
      { name: 'latitude', label: 'Latitude', type: 'number' },
      { name: 'longitude', label: 'Longitude', type: 'number' },
      { name: 'phone', label: 'Telefone', type: 'text' },
      { name: 'email', label: 'E-mail', type: 'text' },
      { name: 'is_published', label: 'Publicado', type: 'checkbox' }
    ]
  }
}