import { collectionByKey } from '@/config/collections';
import { getSeedCollection } from '@/data/siteContent';
import { ensureUniqueSlug } from '@/lib/slugify';
import { isSupabaseConfigured, supabase } from './supabase';

const localStore = Object.fromEntries(Object.keys(collectionByKey).map((key) => [key, getSeedCollection(key)]));

function clone(value) {
  return structuredClone(value);
}

function getCollectionItems(key) {
  return localStore[key] ?? [];
}

function setCollectionItems(key, items) {
  localStore[key] = items;
}

function sortRecords(records, definition) {
  const ordered = clone(records);
  const sorters = definition.order?.length ? definition.order : [{ field: 'created_at', direction: 'desc' }];

  ordered.sort((left, right) => {
    for (const sorter of sorters) {
      const leftValue = left[sorter.field];
      const rightValue = right[sorter.field];

      if (leftValue === rightValue) {
        continue;
      }

      if (leftValue == null) return sorter.direction === 'asc' ? 1 : -1;
      if (rightValue == null) return sorter.direction === 'asc' ? -1 : 1;

      const comparison = String(leftValue).localeCompare(String(rightValue), 'pt-BR', {
        numeric: true,
        sensitivity: 'base',
      });

      return sorter.direction === 'asc' ? comparison : -comparison;
    }

    return 0;
  });

  return ordered;
}

function normalizeRecord(definition, record, existingItems = []) {
  const nextRecord = { ...record };
  const existingSlugs = existingItems.map((item) => item[definition.slugField || 'slug']).filter(Boolean);
  const slugField = definition.slugField;
  const titleField = definition.titleField;

  if (slugField && !nextRecord[slugField] && (nextRecord[titleField] || nextRecord.name)) {
    nextRecord[slugField] = ensureUniqueSlug(nextRecord[titleField] || nextRecord.name, existingSlugs);
  }

  if (!nextRecord.id) {
    nextRecord.id = crypto.randomUUID();
    nextRecord.created_at = new Date().toISOString();
  }

  nextRecord.updated_at = new Date().toISOString();
  return nextRecord;
}

function getTableName(key) {
  return collectionByKey[key]?.table ?? key;
}

export async function fetchCollection(key) {
  const definition = collectionByKey[key];
  if (!definition) {
    throw new Error(`Coleção desconhecida: ${key}`);
  }

  if (isSupabaseConfigured && supabase) {
    let query = supabase.from(getTableName(key)).select('*');
    definition.order?.forEach((orderItem, index) => {
      query = query.order(orderItem.field, { ascending: orderItem.direction === 'asc', foreignTable: undefined, nullsFirst: false });
      if (index === 0 && definition.order.length > 1) {
        query = query.order(definition.order[1].field, { ascending: definition.order[1].direction === 'asc', nullsFirst: false });
      }
    });

    const { data, error } = await query;
    if (error) {
      throw error;
    }

    return data ?? [];
  }

  return sortRecords(getCollectionItems(key), definition);
}

export async function saveCollectionItem(key, record) {
  const definition = collectionByKey[key];
  if (!definition) {
    throw new Error(`Coleção desconhecida: ${key}`);
  }

  const currentItems = await fetchCollection(key);
  const normalized = normalizeRecord(definition, record, currentItems);

  if (isSupabaseConfigured && supabase) {
    if (record.id) {
      const { error } = await supabase.from(getTableName(key)).update(normalized).eq('id', record.id);
      if (error) throw error;
      return normalized;
    }

    const { error } = await supabase.from(getTableName(key)).insert(normalized);
    if (error) throw error;
    return normalized;
  }

  const existingIndex = currentItems.findIndex((item) => item.id === normalized.id);
  const nextItems = [...currentItems];
  if (existingIndex >= 0) {
    nextItems[existingIndex] = { ...nextItems[existingIndex], ...normalized };
  } else {
    nextItems.unshift(normalized);
  }
  setCollectionItems(key, sortRecords(nextItems, definition));
  return normalized;
}

export async function deleteCollectionItem(key, id) {
  const definition = collectionByKey[key];
  if (!definition) {
    throw new Error(`Coleção desconhecida: ${key}`);
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from(getTableName(key)).delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  setCollectionItems(
    key,
    getCollectionItems(key).filter((item) => item.id !== id),
  );
  return true;
}

export async function moveCollectionItem(key, id, direction) {
  const definition = collectionByKey[key];
  if (!definition) {
    throw new Error(`Coleção desconhecida: ${key}`);
  }

  const items = await fetchCollection(key);
  const index = items.findIndex((item) => item.id === id);
  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [moved] = nextItems.splice(index, 1);
  nextItems.splice(targetIndex, 0, moved);

  const reordered = nextItems.map((item, itemIndex) => ({
    ...item,
    manual_order: itemIndex + 1,
  }));

  if (isSupabaseConfigured && supabase) {
    for (const item of reordered) {
      await supabase.from(getTableName(key)).update({ manual_order: item.manual_order }).eq('id', item.id);
    }
  } else {
    setCollectionItems(key, reordered);
  }

  return reordered;
}

export function getDefaultRecord(key) {
  const definition = collectionByKey[key];
  if (!definition) {
    throw new Error(`Coleção desconhecida: ${key}`);
  }

  const defaults = definition.fields.reduce((accumulator, field) => {
    if (field.type === 'checkbox') {
      accumulator[field.name] = true;
      return accumulator;
    }

    if (field.type === 'gallery') {
      accumulator[field.name] = '';
      return accumulator;
    }

    accumulator[field.name] = '';
    return accumulator;
  }, {});

  return defaults;
}