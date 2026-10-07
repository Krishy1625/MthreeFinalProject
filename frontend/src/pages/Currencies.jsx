import { useEffect, useState } from 'react';

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await fetch('/api/currencies');
        if (!response.ok) {
          throw new Error('Unable to load currencies.');
        }
        const data = await response.json();
        setCurrencies(data);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load currencies.');
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  return (
    <section className="border-2 border-gray-400 p-5">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Top 25 Currencies</h1>
      </div>

      {loading && <p role="status">Loading currencies...</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th scope="col" className="px-3 py-2">Symbol</th>
                  <th scope="col" className="px-3 py-2">Code</th>
                  <th scope="col" className="px-3 py-2">Currency</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map(currency => (
                  <tr key={currency.currencyCode} className="border-b border-gray-200">
                    <td className="px-3 py-2">{currency.currencySymbol || '-'}</td>
                    <td className="px-3 py-2 font-medium">{currency.currencyCode}</td>
                    <td className="px-3 py-2">{currency.currencyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
