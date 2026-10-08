
import { useCallback, useEffect, useState } from 'react';

async function getErrorMessage(response) {
  const text = await response.text();

  if (!text) {
    return `Request failed (HTTP ${response.status}).`;
  }

  try {
    const body = JSON.parse(text);
    return body.message || body.error ||
        `Request failed (HTTP ${response.status}).`;
  } catch {
    return text;
  }
}

export default function History({ user }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [historyToDelete, setHistoryToDelete] = useState(null);

  const loadHistory = useCallback(async signal => {
    const response = await fetch(
        `/api/history/user/${user.userId}`,
        { signal }
    );

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    setHistory(await response.json());
  }, [user.userId]);

  useEffect(() => {
    const controller = new AbortController();

    loadHistory(controller.signal)
        .catch(loadError => {
          if (loadError.name !== 'AbortError') {
            setError(
                loadError.message || 'Unable to load conversion history.'
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });

    return () => controller.abort();
  }, [loadHistory]);

  // Delete only after confirmation
  const deleteHistory = async historyId => {
    setError('');
    setDeletingId(historyId);

    try {
      const response = await fetch(`/api/history/${historyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setHistory(current =>
          current.filter(item => item.historyId !== historyId)
      );

      setHistoryToDelete(null);
    } catch (deleteError) {
      setError(
          deleteError.message || 'Unable to delete this history entry.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
      <>
        <section>
          <div className="mb-8">
            <div className="mb-3 h-[3px] w-12 rounded-full bg-[#FB923C]" />

            <h1 className="text-3xl font-bold text-[#02022b]">
              Conversion history
            </h1>

            <p className="mt-2 text-sm font-medium text-[#24244f]">
              View and manage your saved conversions.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/50 bg-[#172554]/75 p-5 shadow-xl backdrop-blur-md">
            {isLoading && (
                <p
                    role="status"
                    className="p-8 text-center text-blue-100"
                >
                  Loading conversion history...
                </p>
            )}

            {error && (
                <p
                    role="alert"
                    className="mb-4 rounded-lg bg-red-500/10 p-4 text-sm text-red-200"
                >
                  {error}
                </p>
            )}

            {!isLoading && !error && history.length === 0 && (
                <p className="p-8 text-center text-blue-100">
                  No conversions have been saved yet.
                </p>
            )}

            {!isLoading && history.length > 0 && (
                <ul>
                  {history.map(item => (
                      <li
                          key={item.historyId}
                          className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-300/10 bg-[#1E3A8A]/55 p-5 transition-colors hover:bg-blue-400/20"
                      >
                        <div>
                          <p className="text-lg font-bold text-white">
                            {item.amount} {item.fromCurrencyCode} ={' '}
                            {Number(item.convertedAmount).toFixed(2)}{' '}
                            {item.toCurrencyCode}
                          </p>

                          <p className="mt-1 text-sm text-blue-100">
                            Rate: {Number(item.exchangeRate).toFixed(5)}
                            {' · '}
                            {new Date(item.date).toLocaleString()}
                          </p>

                          {item.notes && (
                              <p className="mt-3 rounded-md bg-[#FB923C]/15 px-3 py-2 text-sm text-blue-50">
                        <span className="font-semibold text-[#FB923C]">
                          Note:
                        </span>{' '}
                                {item.notes}
                              </p>
                          )}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                              setError('');
                              setHistoryToDelete(item);
                            }}
                            disabled={deletingId !== null}
                            className="rounded-lg border border-red-300/40 bg-red-500/10 px-4 py-2 font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                        >
                          {deletingId === item.historyId
                              ? 'Removing...'
                              : 'Remove'}
                        </button>
                      </li>
                  ))}
                </ul>
            )}
          </div>
        </section>

        {/* Custom deletion confirmation dialog */}
        {historyToDelete && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
                role="presentation"
                onMouseDown={event => {
                  if (
                      event.target === event.currentTarget &&
                      deletingId === null
                  ) {
                    setHistoryToDelete(null);
                  }
                }}
            >
              <section
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="delete-history-title"
                  aria-describedby="delete-history-description"
                  className="my-auto w-full max-w-md rounded-2xl border border-white/30 bg-[#172554] p-6 shadow-2xl"
              >
                <div className="mb-4 h-[3px] w-12 rounded-full bg-[#FB923C]" />

                <h2
                    id="delete-history-title"
                    className="mb-3 text-xl font-bold text-white"
                >
                  Delete conversion?
                </h2>

                <p
                    id="delete-history-description"
                    className="text-sm text-blue-100"
                >
                  Are you sure you want to delete this conversion?
                </p>

                <p className="mt-3 rounded-lg bg-[#1E3A8A]/55 px-4 py-3 text-sm font-semibold text-[#FB923C]">
                  {historyToDelete.amount}{' '}
                  {historyToDelete.fromCurrencyCode}
                  {' → '}
                  {Number(historyToDelete.convertedAmount).toFixed(2)}{' '}
                  {historyToDelete.toCurrencyCode}
                </p>

                <p className="mt-3 text-sm text-blue-200">
                  This action cannot be undone.
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-200"
                    >
                      {error}
                    </p>
                )}

                <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                  <button
                      type="button"
                      onClick={() => setHistoryToDelete(null)}
                      disabled={deletingId !== null}
                      className="rounded-lg border border-white/30 px-4 py-2 font-medium text-blue-100 transition hover:bg-white/10 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                      type="button"
                      onClick={() =>
                          deleteHistory(historyToDelete.historyId)
                      }
                      disabled={deletingId !== null}
                      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {deletingId !== null
                        ? 'Removing...'
                        : 'Remove'}
                  </button>
                </div>
              </section>
            </div>
        )}
      </>
  );
}
