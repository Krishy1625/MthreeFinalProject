import { useEffect, useState } from 'react';

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadCurrencies = async () => {
      try {
        const response = await fetch('/api/currencies', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Could not load currencies.');
        }

        const availableCurrencies = await response.json();
        if (!Array.isArray(availableCurrencies)) {
          throw new Error('The currency list could not be read.');
        }

        setCurrencies(availableCurrencies);
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load currencies.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCurrencies();
    return () => controller.abort();
  }, []);

  return (
    <section className="overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
        <h1 className="text-xl font-semibold text-gray-900">Top 25 currencies</h1>
        <p className="mt-1 text-sm text-gray-600">
          Browse the currencies available in the conversion catalog.
        </p>
      </div>

      {loading && <p role="status" className="px-5 py-6 text-sm text-gray-600 sm:px-6">Loading currencies...</p>}
      {error && <p role="alert" className="px-5 py-6 text-sm text-red-700 sm:px-6">{error}</p>}
      {!loading && !error && (
        <>
          <p className="px-5 pt-4 text-sm text-gray-600 sm:px-6">
            {currencies.length} currencies
          </p>
          <div className="overflow-x-auto px-5 pb-5 pt-3 sm:px-6">
            <table className="w-full min-w-96 text-left text-sm">
              <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="py-3 pr-4 font-medium">Code</th>
                  <th scope="col" className="py-3 pr-4 font-medium">Currency</th>
                  <th scope="col" className="py-3 text-right font-medium">Symbol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currencies.map(currency => (
                  <tr key={currency.currencyCode}>
                    <td className="whitespace-nowrap py-3 pr-4 font-semibold text-gray-900">
                      {currency.currencyCode}
                    </td>
                    <td className="py-3 pr-4 text-gray-700">{currency.currencyName}</td>
                    <td className="whitespace-nowrap py-3 text-right text-gray-700">
                      {currency.currencySymbol || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {currencies.length === 0 && (
              <p className="py-5 text-sm text-gray-600">No currencies are currently available.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
