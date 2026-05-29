import { Link, NavLink } from 'react-router-dom'

export function Container({ children, className = '' }) {
  return <div className={`container ${className}`.trim()}>{children}</div>
}

export function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  )
}

export function Button({ as = 'button', children, className = '', ...props }) {
  const classes = `btn ${className}`.trim()
  if (as === 'link') return <Link className={classes} {...props}>{children}</Link>
  return <button className={classes} {...props}>{children}</button>
}

export function Card({ children, className = '' }) {
  return <article className={`card ${className}`.trim()}>{children}</article>
}

export function AdminNavLink({ to, children }) {
  return (
    <NavLink to={to} className={({ isActive }) => `admin-nav__link ${isActive ? 'is-active' : ''}`}>
      {children}
    </NavLink>
  )
}
