import { useCallback, useEffect, useState } from 'react';

async function responseError(response) {
  const text = await response.text();
  const statusMessage = `Request failed (HTTP ${response.status}).`;
  if (!text) return statusMessage;
  try {
    const body = JSON.parse(text);
    if (body.message) return body.message;
    if (body.error) {
      return `${body.error} (HTTP ${response.status})${body.path ? `: ${body.path}` : ''}.`;
    }
    return statusMessage;
  } catch {
    return text;
  }
}

export default function FavouritePairs({
  userId,
  currentPair,
  onUsePair,
  title = 'Favourite currency pairs',
}) {
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const pairIsSaved = favourites.some(favourite =>
    favourite.fromCurrencyId === currentPair?.fromId
      && favourite.toCurrencyId === currentPair?.toId);

  const loadFavourites = useCallback(async signal => {
    const response = await fetch(`/api/favourites/user/${userId}`, { signal });
    if (!response.ok) {
      throw new Error(await responseError(response));
    }
    setFavourites(await response.json());
  }, [userId]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError('');
    loadFavourites(controller.signal)
      .catch(loadError => {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load favourite pairs.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [loadFavourites]);

  const saveFavourite = async () => {
    setError('');
    setMessage('');
    setIsSaving(true);
    try {
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fromCurrencyId: currentPair.fromId,
          toCurrencyId: currentPair.toId,
        }),
      });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }
      await loadFavourites();
      setMessage('Favourite pair saved.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to save this favourite pair.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeFavourite = async favouriteId => {
    setError('');
    setMessage('');
    setRemovingId(favouriteId);
    try {
      const response = await fetch(`/api/favourites/${favouriteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }
      setFavourites(current => current.filter(favourite => favourite.favId !== favouriteId));
    } catch (removeError) {
      setError(removeError.message || 'Unable to remove this favourite pair.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
      <section className="mt-10">
        <div className="mb-8">
          <div className="mb-3 h-[3px] w-12 rounded-full bg-[#FB923C]" />

          <h2 className="text-3xl font-bold text-[#02022b]">
            {title}
          </h2>

          <p className="mt-2 text-sm font-medium text-[#24244f]">
            Save and manage your favourite currency pairs.
          </p>
        </div>

        <div className="rounded-2xl border border-white/50 bg-[#172554]/75 p-6 shadow-xl backdrop-blur-md">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {currentPair?.from && currentPair?.to && (
              <button
                  type="button"
                  onClick={saveFavourite}
                  disabled={isSaving || isLoading || pairIsSaved}
                  className="rounded-lg border border-[#FB923C]/40 bg-[#FB923C]/15 px-5 py-2.5 font-semibold text-[#FB923C] transition hover:bg-[#FB923C]/25 disabled:opacity-60"
              >
                {isSaving
                    ? 'Saving...'
                    : pairIsSaved
                        ? `${currentPair.from} / ${currentPair.to} already saved`
                        : `Save ${currentPair.from} / ${currentPair.to}`}
              </button>
          )}
          </div>

          {error && <p role="alert" className="mb-4 rounded-lg bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
          {message && <p role="status" className="mb-4 rounded-lg bg-green-500/10 p-4 text-sm text-green-200">{message}</p>}
          {isLoading ? (
              <p role="status" className="py-6 text-center text-blue-100">
                Loading favourite pairs...
              </p>
          ) : favourites.length === 0 ? (
              <p className="rounded-xl border border-white/15 bg-[#1E3A8A]/55 p-6 text-center text-sm text-blue-100">You have no favourite currency pairs yet.</p>
          ) : (
              <ul className="space-y-3">
                {favourites.map(favourite => (
                    <li key={favourite.favId} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/15 bg-[#1E3A8A]/55 p-4">
              <div>
                <p className="text-lg font-bold text-white">
                  {favourite.fromCurrencyCode} / {favourite.toCurrencyCode}
                </p>
                <p className="mt-1 text-sm text-blue-100">
                  {favourite.fromCurrencyName} to {favourite.toCurrencyName}
                </p>
              </div>
              <div className="flex gap-2">
                {onUsePair && (
                  <button
                    type="button"
                    onClick={() => onUsePair(favourite.fromCurrencyCode, favourite.toCurrencyCode)}
                    className="rounded-lg border border-blue-300/40 bg-blue-400/10 px-4 py-2 font-medium text-blue-100 transition hover:bg-blue-400/20"
                  >
                    Use pair
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFavourite(favourite.favId)}
                  disabled={removingId === favourite.favId}
                  className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 font-medium text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                >
                  {removingId === favourite.favId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
        </div>
    </section>
  );
}
