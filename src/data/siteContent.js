import { ensureUniqueSlug } from '@/lib/slugify';

const communities = [
  {
    id: 'comm-1',
    name: 'Comunidade São José',
    summary: 'Comunidade com forte tradição de catequese e acolhida familiar.',
    story: 'A Comunidade São José nasceu da união de famílias do bairro e mantém a devoção ao padroeiro da Sagrada Família.',
    address: 'Rua São José, 123 - Cachoeiro de Itapemirim/ES',
    google_maps_url: 'https://maps.google.com/?q=Rua+São+José,+123',
    latitude: -20.8467,
    longitude: -41.1123,
    cover_image_url: '',
    gallery: ['foto-1.jpg', 'foto-2.jpg'],
    is_published: true,
    manual_order: 1,
    slug: 'comunidade-sao-jose',
  },
  {
    id: 'comm-2',
    name: 'Comunidade Santa Luzia',
    summary: 'Espiritualidade mariana, juventude e famílias engajadas.',
    story: 'Comunidade fundada com o desejo de levar a luz de Cristo a todos os lares do entorno.',
    address: 'Av. Santa Luzia, 88 - Cachoeiro de Itapemirim/ES',
    google_maps_url: 'https://maps.google.com/?q=Av.+Santa+Luzia,+88',
    latitude: -20.8511,
    longitude: -41.1081,
    cover_image_url: '',
    gallery: ['foto-1.jpg'],
    is_published: true,
    manual_order: 2,
    slug: 'comunidade-santa-luzia',
  },
  {
    id: 'comm-3',
    name: 'Comunidade São Francisco',
    summary: 'Referência em solidariedade, serviço e cuidado com a criação.',
    story: 'A comunidade segue o carisma franciscano e fortalece ações de partilha e ecologia integral.',
    address: 'Rua das Graças, 45 - Cachoeiro de Itapemirim/ES',
    google_maps_url: 'https://maps.google.com/?q=Rua+das+Graças,+45',
    latitude: -20.8438,
    longitude: -41.1167,
    cover_image_url: '',
    gallery: ['foto-1.jpg', 'foto-2.jpg', 'foto-3.jpg', 'foto-4.jpg', 'foto-5.jpg', 'foto-6.jpg'],
    is_published: true,
    manual_order: 3,
    slug: 'comunidade-sao-francisco',
  },
];

const news = [
  {
    id: 'news-1',
    title: 'Festa da Padroeira reúne centenas de fiéis',
    summary: 'A comunidade viveu três dias de novena, missa campal e procissão pelas ruas do bairro.',
    content: 'A festa em honra a Nossa Senhora das Graças reuniu famílias de toda a paróquia em um momento de oração, missão e comunhão.',
    category: 'Evento Especial',
    published_at: '2026-05-15T19:00:00Z',
    cover_image_url: '',
    gallery: ['evento-1.jpg', 'evento-2.jpg'],
    is_published: true,
    slug: 'festa-da-padroeira-reune-centenas-de-fieis',
  },
  {
    id: 'news-2',
    title: 'Primeira Comunhão 2026 com inscrições abertas',
    summary: 'As inscrições seguem até 30 de junho na secretaria paroquial.',
    content: 'A catequese paroquial informa os critérios e a documentação necessária para a inscrição das crianças.',
    category: 'Catequese',
    published_at: '2026-05-08T11:00:00Z',
    cover_image_url: '',
    gallery: ['catequese-1.jpg'],
    is_published: true,
    slug: 'primeira-comunhao-2026-inscricoes-abertas',
  },
  {
    id: 'news-3',
    title: 'Campanha da Pastoral da Criança',
    summary: 'Contribua com alimentos e materiais de higiene para apoiar as famílias assistidas.',
    content: 'A pastoral convida a comunidade para colaborar com a campanha solidária neste mês.',
    category: 'Pastoral Social',
    published_at: '2026-05-02T09:00:00Z',
    cover_image_url: '',
    gallery: ['pastoral-1.jpg'],
    is_published: true,
    slug: 'campanha-da-pastoral-da-crianca',
  },
];

const clergy = [
  {
    id: 'clergy-1',
    name: 'Pe. José Carlos Mendonça',
    role: 'pároco',
    bio: 'Responsável pela condução pastoral da comunidade paroquial.',
    photo_url: '',
    is_current: true,
    manual_order: 1,
  },
  {
    id: 'clergy-2',
    name: 'Pe. André Lima Santos',
    role: 'vigário',
    bio: 'Atuação junto à catequese e à juventude.',
    photo_url: '',
    is_current: false,
    manual_order: 2,
  },
  {
    id: 'clergy-3',
    name: 'Dc. Marcos Antônio Ferreira',
    role: 'diácono',
    bio: 'Diácono permanente com forte presença nas visitas e celebrações.',
    photo_url: '',
    is_current: true,
    manual_order: 1,
  },
];

const parishProfile = [
  {
    id: 'parish-1',
    title: 'Nossa História',
    subtitle: 'Fé, serviço e acolhida desde 1962',
    content:
      'A Paróquia Nossa Senhora das Graças foi fundada em Cachoeiro de Itapemirim e se desenvolveu junto à vida do povo, formando comunidades, pastorais e iniciativas de solidariedade.',
    address: 'Rua Nossa Senhora das Graças, 450 - Cachoeiro de Itapemirim/ES',
    google_maps_url: 'https://maps.google.com/?q=Rua+Nossa+Senhora+das+Graças,+450',
    latitude: -20.8456,
    longitude: -41.1112,
    gallery: ['matriz-1.jpg', 'matriz-2.jpg'],
    is_published: true,
    slug: 'nossa-historia',
  },
];

const schedules = [
  { id: 'sched-1', title: 'Matriz', day_label: 'Segunda-feira', time_label: '7h00', location: 'Igreja Matriz', category: 'missa', manual_order: 1, is_published: true },
  { id: 'sched-2', title: 'Matriz', day_label: 'Quarta-feira', time_label: '7h00 · 19h30', location: 'Igreja Matriz', category: 'missa', manual_order: 2, is_published: true },
  { id: 'sched-3', title: 'Atendimento', day_label: 'Seg a Sex', time_label: '8h às 11h30 · 14h às 17h30', location: 'Secretaria', category: 'atendimento', manual_order: 1, is_published: true },
];

const usefulLinks = [
  { id: 'link-1', title: 'Liturgia Diária', url: 'https://liturgia.cancaonova.com', description: 'Leituras do dia', category: 'liturgia', manual_order: 1, open_in_new_tab: true, is_published: true },
  { id: 'link-2', title: 'CNBB', url: 'https://www.cnbb.org.br', description: 'Conferência Nacional dos Bispos do Brasil', category: 'formacao', manual_order: 2, open_in_new_tab: true, is_published: true },
  { id: 'link-3', title: 'Canção Nova', url: 'https://www.cancaonova.com', description: 'Evangelização e conteúdos de formação', category: 'formacao', manual_order: 3, open_in_new_tab: true, is_published: true },
];

const liturgyLinks = [
  { id: 'liturgy-1', title: 'Santo do Dia', url: 'https://santo.cancaonova.com', description: 'Referência diária de oração', manual_order: 1, open_in_new_tab: true, is_published: true },
];

const pastorals = [
  { id: 'past-1', title: 'Pastoral da Criança', description: 'Acompanhamento e cuidado com crianças e famílias.', image_url: '', manual_order: 1, is_published: true },
  { id: 'past-2', title: 'Pastoral Familiar', description: 'Fortalecimento da vida familiar à luz do Evangelho.', image_url: '', manual_order: 2, is_published: true },
  { id: 'past-3', title: 'Catequese', description: 'Preparação para os sacramentos da iniciação cristã.', image_url: '', manual_order: 3, is_published: true },
];

const pages = [
  { id: 'page-1', title: 'Casamentos', slug: 'casamentos', content: 'Informações sobre documentos e preparação para o sacramento.', page_key: 'casamentos', is_published: true },
  { id: 'page-2', title: 'Pedidos de Oração', slug: 'pedidos-de-oracao', content: 'Espaço para intenções e oração comunitária.', page_key: 'pedidos-de-oracao', is_published: true },
];

const socialLinks = [
  { id: 'social-1', network: 'Instagram', url: '#', icon: 'instagram', manual_order: 1, is_published: true },
  { id: 'social-2', network: 'Facebook', url: '#', icon: 'facebook', manual_order: 2, is_published: true },
  { id: 'social-3', network: 'YouTube', url: '#', icon: 'youtube', manual_order: 3, is_published: true },
];

export const publicContent = {
  alert: 'Corpus Christi - Missa Solene no dia 19/06 às 19h. Ver horários completos.',
  hero: {
    eyebrow: 'Cachoeiro de Itapemirim - ES',
    title: 'Bem-vindo à Nossa Senhora das Graças',
    subtitle: 'Uma comunidade de fé, amor e serviço. Venha participar das celebrações, pastorais e da vida da nossa paróquia.',
    ctas: [
      { label: 'Horários das Missas', to: '/horarios', tone: 'primary' },
      { label: 'Nossa História', to: '/paroquia', tone: 'ghost' },
    ],
  },
  quickLinks: [
    { label: 'Horários', to: '/horarios', icon: 'clock' },
    { label: 'Sacramentos', to: '/paroquia', icon: 'book' },
    { label: 'Pastorais', to: '/pastorais', icon: 'heart' },
    { label: 'Contato', to: '/contato', icon: 'phone' },
  ],
  highlights: [
    { title: 'Casamentos', description: 'Informe-se sobre os documentos e preparação para o sacramento do matrimônio.', icon: 'ring', to: '/contato' },
    { title: 'Seja Dizimista', description: 'Contribua para o crescimento da nossa paróquia e das obras de caridade.', icon: 'heart-handshake', to: '/pastorais' },
    { title: 'Pastorais', description: 'Conheça os grupos de serviço e movimento que atuam em nossa paróquia.', icon: 'users', to: '/pastorais' },
    { title: 'Formação e Links', description: 'Liturgia diária, homilias, sites católicos e materiais de formação espiritual.', icon: 'book-2', to: '/links' },
    { title: 'Notícias', description: 'Fique por dentro das novidades, eventos e celebrações da nossa comunidade.', icon: 'news', to: '/noticias' },
    { title: 'Comunidades', description: 'Conheça as comunidades vinculadas à paróquia e sua história de fé.', icon: 'building-church', to: '/comunidades' },
  ],
};

export const demoCollections = {
  parish_profile: parishProfile,
  communities,
  clergy,
  news,
  mass_schedules: schedules,
  office_hours: schedules.filter((item) => item.category === 'atendimento'),
  useful_links: usefulLinks,
  liturgy_links: liturgyLinks,
  pastorals,
  pages,
  social_links: socialLinks,
};

export function getSeedCollection(key) {
  return structuredClone(demoCollections[key] ?? []);
}

export function getSeedWithUniqueSlugs(key) {
  const items = getSeedCollection(key);
  const used = [];
  return items.map((item) => {
    if (!item.slug && (item.title || item.name)) {
      item.slug = ensureUniqueSlug(item.title || item.name, used);
    }
    if (item.slug) {
      used.push(item.slug);
    }
    return item;
  });
}