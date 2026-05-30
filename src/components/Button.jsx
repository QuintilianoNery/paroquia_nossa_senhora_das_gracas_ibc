import { cloneElement, isValidElement } from 'react';

export default function Button({ children, variant = 'primary', type = 'button', loading = false, onClick, ariaLabel, className = '', asChild = false, ...rest }) {
  const buttonClassName = `button button-${variant} ${className}`.trim();

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: `${buttonClassName} ${children.props.className || ''}`.trim(),
    });
  }

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
      disabled={loading || rest.disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {loading ? <span className="button-spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}