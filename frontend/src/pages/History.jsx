import { useCallback, useEffect, useState } from 'react';

async function getErrorMessage(response) {
  const text = await response.text();
  if (!text) return `Request failed (HTTP ${response.status}).`;
  try {
    const body = JSON.parse(text);
    return body.message || body.error || `Request failed (HTTP ${response.status}).`;
  } catch {
    return text;
  }
}

export default function History({ user }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadHistory = useCallback(async signal => {
    const response = await fetch(`/api/history/user/${user.userId}`, { signal });
    if (!response.ok) throw new Error(await getErrorMessage(response));
    setHistory(await response.json());
  }, [user.userId]);

  useEffect(() => {
    const controller = new AbortController();
    loadHistory(controller.signal)
      .catch(loadError => {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load conversion history.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [loadHistory]);

  const deleteHistory = async historyId => {
    setError('');
    setDeletingId(historyId);
    try {
      const response = await fetch(`/api/history/${historyId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await getErrorMessage(response));
      setHistory(current => current.filter(item => item.historyId !== historyId));
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete this history entry.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="border-2 border-gray-400 p-5">
      <h1 className="mb-4 text-xl font-semibold">Conversion history</h1>
      {isLoading && <p role="status">Loading conversion history...</p>}
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {!isLoading && !error && history.length === 0 && (
        <p className="text-sm text-gray-600">No conversions have been saved yet.</p>
      )}
      {!isLoading && history.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {history.map(item => (
            <li key={item.historyId} className="flex flex-wrap items-start justify-between gap-4 py-4">
              <div>
                <p className="font-semibold">
                  {item.amount} {item.fromCurrencyCode} = {Number(item.convertedAmount).toFixed(2)} {item.toCurrencyCode}
                </p>
                <p className="text-sm text-gray-600">
                  Rate: {Number(item.exchangeRate).toFixed(5)}
                  {' · '}
                  {new Date(item.date).toLocaleString()}
                </p>
                {item.notes && <p className="mt-1 text-sm">Note: {item.notes}</p>}
              </div>
              <button
                type="button"
                onClick={() => deleteHistory(item.historyId)}
                disabled={deletingId === item.historyId}
                className="border border-red-600 px-3 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {deletingId === item.historyId ? 'Removing...' : 'Remove'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
