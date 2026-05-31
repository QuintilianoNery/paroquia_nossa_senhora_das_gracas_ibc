import { useEffect, useState } from 'react'
import { toast } from '@lib/toast'

export default function ToastProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const unsub = toast.subscribe((n) => {
      if (n.remove) {
        setItems(prev => prev.filter(x => x.id !== n.id))
      } else {
        setItems(prev => [...prev, n])
      }
    })
    return unsub
  }, [])

  return (
    <>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(it => (
          <div key={it.id} className={`alert alert-${it.type}`} style={{ minWidth: 260 }}>
            {it.message}
          </div>
        ))}
      </div>
    </>
  )
}
