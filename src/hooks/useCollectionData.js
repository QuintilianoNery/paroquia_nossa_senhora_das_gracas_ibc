import { useEffect, useState } from 'react';
import { fetchCollection } from '@/services/cmsService';

export function useCollectionData(collectionKey, initialValue = []) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const items = await fetchCollection(collectionKey);
        if (mounted) {
          setData(items);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.message || 'Falha ao carregar os dados.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [collectionKey]);

  return { data, loading, error };
}