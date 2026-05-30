export default function ImageUploadField({
  label,
  hint,
  value,
  onChange,
  accept = '.png,.jpg,.jpeg,.webp',
  previewLabel = 'Pré-visualização',
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type="file"
        accept={accept}
        className="form-input"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      {hint && <div className="form-hint">{hint}</div>}
      {value && (
        <div style={{ marginTop: 12 }}>
          <div className="form-hint" style={{ marginBottom: 8 }}>{previewLabel}</div>
          <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--white)' }}>
            <img src={value} alt={label} style={{ display: 'block', width: '100%', maxHeight: 240, objectFit: 'cover' }} />
          </div>
        </div>
      )}
    </div>
  )
}
