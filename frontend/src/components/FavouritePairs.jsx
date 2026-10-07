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
    <section className="mt-6 border-2 border-gray-400 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {currentPair?.from && currentPair?.to && (
          <button
            type="button"
            onClick={saveFavourite}
            disabled={isSaving || isLoading || pairIsSaved}
            className="bg-amber-500 px-4 py-2 font-semibold hover:bg-amber-400 disabled:opacity-60"
          >
            {isSaving
              ? 'Saving...'
              : pairIsSaved
                ? `${currentPair.from} / ${currentPair.to} already saved`
                : `Save ${currentPair.from} / ${currentPair.to}`}
          </button>
        )}
      </div>

      {error && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="mb-3 text-sm text-green-700">{message}</p>}
      {isLoading ? (
        <p role="status">Loading favourite pairs...</p>
      ) : favourites.length === 0 ? (
        <p className="text-sm text-gray-600">You have no favourite currency pairs yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {favourites.map(favourite => (
            <li key={favourite.favId} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">
                  {favourite.fromCurrencyCode} / {favourite.toCurrencyCode}
                </p>
                <p className="text-sm text-gray-600">
                  {favourite.fromCurrencyName} to {favourite.toCurrencyName}
                </p>
              </div>
              <div className="flex gap-2">
                {onUsePair && (
                  <button
                    type="button"
                    onClick={() => onUsePair(favourite.fromCurrencyCode, favourite.toCurrencyCode)}
                    className="border border-blue-600 px-3 py-1.5 text-blue-700 hover:bg-blue-50"
                  >
                    Use pair
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFavourite(favourite.favId)}
                  disabled={removingId === favourite.favId}
                  className="border border-red-600 px-3 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {removingId === favourite.favId ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
