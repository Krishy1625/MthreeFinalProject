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
      <section className="px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 border-t-4 border-t-orange-400 bg-gradient-to-br from-blue-50 via-white to-orange-50 p-8 shadow-xl">
          <h1 className="mb-4 text-xl font-semibold">Conversion history</h1>
          {isLoading && <p role="status">Loading conversion history...</p>}
          {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
          {!isLoading && !error && history.length === 0 && (
              <p className="text-sm text-gray-600">No conversions have been saved yet.</p>
          )}
          {!isLoading && history.length > 0 && (
              <ul className="divide-y divide-gray-200">
                {history.map(item => (
                    <li key={item.historyId} className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {item.amount} {item.fromCurrencyCode} = {Number(item.convertedAmount).toFixed(2)} {item.toCurrencyCode}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Rate: {Number(item.exchangeRate).toFixed(5)}
                          {' · '}
                          {new Date(item.date).toLocaleString()}
                        </p>
                        {item.notes && <p className="mt-2 rounded-md bg-orange-50 px-3 py-2 text-sm text-gray-700">
                          <span className="font-semibold text-orange-600">Note:</span> {item.notes}
                        </p>}
                      </div>
                      <button
                          type="button"
                          onClick={() => deleteHistory(item.historyId)}
                          disabled={deletingId === item.historyId}
                          className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        {deletingId === item.historyId ? 'Removing...' : 'Remove'}
                      </button>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </section>
);
}
