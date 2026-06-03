const subscribers = new Set()

export const toast = {
  show: (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).slice(2, 9)
    const notification = { id, message, type, duration }
    subscribers.forEach(cb => cb({ ...notification }))
    setTimeout(() => subscribers.forEach(cb => cb({ id, remove: true })), duration)
    return id
  },
  success: (m, d) => toast.show(m, 'success', d),
  error: (m, d) => toast.show(m, 'error', d),
  info: (m, d) => toast.show(m, 'info', d),
  subscribe: (cb) => { subscribers.add(cb); return () => subscribers.delete(cb) }
}

export default toast
