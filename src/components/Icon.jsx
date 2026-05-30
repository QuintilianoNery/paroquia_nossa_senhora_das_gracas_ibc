const ICON_PATHS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  lock: 'M8 10V8a4 4 0 1 1 8 0v2m-9 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
  'arrow-right': 'M5 12h14M13 5l7 7-7 7',
  'arrow-left': 'M19 12H5m7-7-7 7 7 7',
  clock: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  book: 'M7 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2Z',
  heart: 'M12 21s-6.5-4.35-9-8.5C1.2 9.4 3.3 5.5 7.4 5.5c2.1 0 3.6 1.1 4.6 2.3 1-1.2 2.5-2.3 4.6-2.3 4.1 0 6.2 3.9 4.4 7-2.5 4.15-9 8.5-9 8.5Z',
  phone: 'M6.5 3.5c1.5 0 2.3.8 3 2l1 2c.4.7.4 1.7 0 2.4l-1 1.4c-.2.3-.2.8 0 1.1 1 1.8 2.6 3.5 4.4 4.4.3.2.8.2 1.1 0l1.4-1c.7-.4 1.7-.4 2.4 0l2 1c1.2.7 2 1.5 2 3 0 1.1-.9 2-2 2-11 0-18-7-18-18 0-1.1.9-2 2-2Z',
  'map-pin': 'M12 22s6-6 6-12a6 6 0 1 0-12 0c0 6 6 12 6 12Z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  news: 'M5 4h14v16H5z M8 8h8M8 12h8M8 16h5',
  'building-church': 'M12 3l7 4v14H5V7l7-4Zm0 4v10M8 9h8M8 13h8',
  calendar: 'M7 3v3M17 3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  users: 'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM4 21a8 8 0 0 1 16 0',
  mail: 'M4 6h16v12H4z M4 7l8 6 8-6',
  send: 'M4 12l16-8-5 16-3-6-8-2Z',
  plus: 'M12 5v14M5 12h14',
  edit: 'M12 20H5v-7l9-9 7 7-9 9ZM9 7l8 8',
  trash: 'M4 7h16M9 7V5h6v2m-7 0 1 14h6l1-14',
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm8 2-4.35-4.35',
  logout: 'M10 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M14 12h7m-3-3 3 3-3 3',
  'external-link': 'M14 5h5v5M10 14 19 5M19 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6',
  star: 'M12 3.5 14.9 9h5.8l-4.7 3.8 1.8 5.9-5.8-3.7-5.8 3.7 1.8-5.9L3.3 9h5.8L12 3.5Z',
  info: 'M12 18v-6M12 8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z',
  image: 'M4 6h16v12H4zM8 11l2.5 2.5L14 10l6 8',
  home: 'M3 12 12 4l9 8v8H3v-8Z',
  layers: 'M12 4 3 9l9 5 9-5-9-5Zm0 6 9 5-9 5-9-5 9-5Z',
  ring: 'M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-16 0-3m0 19 0 3',
  'heart-handshake': 'M7 12.5 4.5 10a3.5 3.5 0 0 1 5-5L12 7.5 14.5 5a3.5 3.5 0 0 1 5 5L17 12.5l-5 5-5-5Z',
  'book-2': 'M7 4h10a2 2 0 0 1 2 2v14H9a4 4 0 0 0-4 4V6a2 2 0 0 1 2-2Z',
  'chevron-up': 'M6 14l6-6 6 6',
  'chevron-down': 'M6 10l6 6 6-6',
  bell: 'M10 21a2 2 0 0 0 4 0m-7-3h10l-1-2v-4a5 5 0 1 0-10 0v4l-1 2Z',
};

export default function Icon({ name, size = 20, className = '' }) {
  const path = ICON_PATHS[name] || ICON_PATHS.info;

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}