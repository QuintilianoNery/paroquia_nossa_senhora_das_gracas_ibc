import { useEffect, useMemo, useState } from 'react';
import { collectionByKey } from '@/config/collections';
import { deleteCollectionItem, fetchCollection, getDefaultRecord, moveCollectionItem, saveCollectionItem } from '@/services/cmsService';
import Button from '@/components/Button';
import Badge from '@/components/Badge';
import Card from '@/components/Card';
import SectionHeader from '@/components/SectionHeader';
import Icon from '@/components/Icon';

function formatValue(value, field) {
  if (field.type === 'checkbox') {
    return value ? 'Sim' : 'Não';
  }

  if (field.type === 'gallery') {
    return Array.isArray(value) ? `${value.length} imagem(ns)` : String(value || '').split('\n').filter(Boolean).length + ' imagem(ns)';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value || '—';
}

function normalizeInputValue(field, rawValue) {
  if (field.type === 'checkbox') {
    return rawValue;
  }

  if (field.type === 'number') {
    return rawValue === '' ? '' : Number(rawValue);
  }

  if (field.type === 'gallery') {
    return rawValue;
  }

  return rawValue;
}

function getGalleryCount(value) {
  if (Array.isArray(value)) {
    return value.length;
  }

  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean).length;
}

export default function AdminCollectionPage({ collectionKey }) {
  const definition = collectionByKey[collectionKey];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(() => getDefaultRecord(collectionKey));

  useEffect(() => {
    if (!definition) {
      setError('Coleção inválida.');
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchCollection(collectionKey);
        if (!mounted) return;
        setItems(data);
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message || 'Falha ao carregar dados.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    setFormData(getDefaultRecord(collectionKey));
    setEditingId(null);

    return () => {
      mounted = false;
    };
  }, [collectionKey, definition]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) {
      return items;
    }

    const term = search.toLowerCase();
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [items, search]);

  function handleChange(fieldName, value) {
    setFormData((current) => ({ ...current, [fieldName]: value }));
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setFormData({ ...getDefaultRecord(collectionKey), ...item });
  }

  function handleReset() {
    setEditingId(null);
    setFormData(getDefaultRecord(collectionKey));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const nextRecord = await saveCollectionItem(collectionKey, {
        ...formData,
        id: editingId ?? formData.id,
      });
      const refreshed = await fetchCollection(collectionKey);
      setItems(refreshed);
      handleReset();
      setFormData({ ...getDefaultRecord(collectionKey), ...nextRecord });
    } catch (requestError) {
      setError(requestError.message || 'Falha ao salvar registro.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Excluir este registro?');
    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError('');
    try {
      await deleteCollectionItem(collectionKey, id);
      setItems(await fetchCollection(collectionKey));
      if (editingId === id) {
        handleReset();
      }
    } catch (requestError) {
      setError(requestError.message || 'Falha ao excluir registro.');
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(id, direction) {
    setSaving(true);
    setError('');
    try {
      await moveCollectionItem(collectionKey, id, direction);
      setItems(await fetchCollection(collectionKey));
    } catch (requestError) {
      setError(requestError.message || 'Falha ao reordenar registro.');
    } finally {
      setSaving(false);
    }
  }

  if (!definition) {
    return <div className="panel-empty">Coleção não encontrada.</div>;
  }

  return (
    <section className="panel-section">
      <SectionHeader
        eyebrow="Área administrativa"
        title={definition.label}
        description={definition.description}
        action={
          <div className="panel-actions-row">
            <Badge tone={definition.sortable ? 'gold' : 'blue'}>{definition.sortable ? 'Ordenável' : 'CRUD simples'}</Badge>
            <Badge tone="neutral">{filteredItems.length} registro(s)</Badge>
          </div>
        }
      />

      <div className="panel-grid">
        <Card className="panel-form-card">
          <div className="panel-card-head">
            <h2>{editingId ? 'Editar registro' : 'Novo registro'}</h2>
            <Button variant="ghost" onClick={handleReset} type="button">
              Limpar
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            {definition.fields.map((field) => {
              const value = formData[field.name] ?? (field.type === 'checkbox' ? false : '');

              if (field.type === 'checkbox') {
                return (
                  <label key={field.name} className="field field-checkbox">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(event) => handleChange(field.name, event.target.checked)}
                    />
                    <span>
                      <strong>{field.label}</strong>
                      {field.help ? <small>{field.help}</small> : null}
                    </span>
                  </label>
                );
              }

              if (field.type === 'select') {
                return (
                  <label key={field.name} className="field">
                    <span>{field.label}</span>
                    <select value={value} onChange={(event) => handleChange(field.name, event.target.value)}>
                      <option value="">Selecione</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {field.help ? <small>{field.help}</small> : null}
                  </label>
                );
              }

              if (field.type === 'textarea' || field.type === 'gallery') {
                const galleryCount = field.type === 'gallery' ? getGalleryCount(value) : 0;
                return (
                  <label key={field.name} className="field">
                    <span>{field.label}</span>
                    <textarea
                      rows={field.type === 'gallery' ? 4 : 5}
                      placeholder={field.type === 'gallery' ? 'Uma imagem por linha' : ''}
                      value={Array.isArray(value) ? value.join('\n') : value}
                      onChange={(event) => handleChange(field.name, normalizeInputValue(field, event.target.value))}
                    />
                    {field.help ? <small>{field.help}</small> : null}
                    {field.type === 'gallery' && galleryCount > 5 ? (
                      <small className="warning-text">A galeria excede 5 imagens. Isso pode impactar a performance.</small>
                    ) : null}
                  </label>
                );
              }

              return (
                <label key={field.name} className="field">
                  <span>{field.label}</span>
                  <input
                    type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                    value={value}
                    placeholder={field.placeholder || ''}
                    onChange={(event) => handleChange(field.name, normalizeInputValue(field, event.target.value))}
                  />
                  {field.help ? <small>{field.help}</small> : null}
                </label>
              );
            })}

            <div className="form-actions">
              <Button type="submit" loading={saving}>
                {editingId ? 'Salvar alterações' : 'Criar registro'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="panel-list-card">
          <div className="panel-card-head">
            <h2>Registros</h2>
            <label className="search-box">
              <Icon name="search" size={16} />
              <input type="search" placeholder="Buscar" value={search} onChange={(event) => setSearch(event.target.value)} />
            </label>
          </div>

          {error ? <div className="alert-inline">{error}</div> : null}
          {loading ? <p className="panel-muted">Carregando registros...</p> : null}

          <div className="admin-table">
            {filteredItems.map((item) => (
              <article key={item.id} className="admin-row">
                <div className="admin-row-main">
                  <strong>{item[definition.titleField] || item.name || item.title || 'Registro sem título'}</strong>
                  <span>{definition.fields.slice(0, 4).map((field) => `${field.label}: ${formatValue(item[field.name], field)}`).join(' · ')}</span>
                </div>
                <div className="admin-row-actions">
                  {definition.sortable ? (
                    <>
                      <Button variant="icon" type="button" onClick={() => handleMove(item.id, 'up')} ariaLabel="Mover para cima">
                        <Icon name="chevron-up" size={16} />
                      </Button>
                      <Button variant="icon" type="button" onClick={() => handleMove(item.id, 'down')} ariaLabel="Mover para baixo">
                        <Icon name="chevron-down" size={16} />
                      </Button>
                    </>
                  ) : null}
                  <Button variant="ghost" type="button" onClick={() => handleEdit(item)}>
                    <Icon name="edit" size={16} />
                    Editar
                  </Button>
                  <Button variant="danger" type="button" onClick={() => handleDelete(item.id)}>
                    <Icon name="trash" size={16} />
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
            {!loading && filteredItems.length === 0 ? <div className="panel-empty">Nenhum registro encontrado.</div> : null}
          </div>
        </Card>
      </div>
    </section>
  );
}