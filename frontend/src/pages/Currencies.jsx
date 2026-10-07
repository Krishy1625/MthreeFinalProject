import { useEffect, useState } from 'react';

export default function Currencies() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

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

  const filteredCurrencies = currencies.filter(currency => {
    const query = search.toLowerCase();

    return (
        currency.currencyCode.toLowerCase().includes(query) ||
        currency.currencyName.toLowerCase().includes(query)
    );
  });

  return (
      <section className="text-white">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Currencies
          </h1>

          <p className="mt-2 text-sm text-blue-200">
            Browse the currencies available for conversion.
          </p>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl border border-blue-800/50 bg-blue-950/60 shadow-2xl backdrop-blur-md">

          {/* Search */}
          <div className="border-b border-blue-800/50 p-5">
            <input
                type="text"
                placeholder="Search by currency name or code..."
                value={search}
                onChange={event => setSearch(event.target.value)}
                className="
              w-full
              rounded-lg
              border border-blue-800
              bg-[#02022b]
              px-4 py-3
              text-white
              placeholder-blue-300/50
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
            "
            />
          </div>

          {/* Loading */}
          {loading && (
              <p
                  role="status"
                  className="p-8 text-center text-blue-200"
              >
                Loading currencies...
              </p>
          )}

          {/* Error */}
          {error && (
              <p
                  role="alert"
                  className="m-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300"
              >
                {error}
              </p>
          )}

          {/* Currency table */}
          {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">

                  <thead className="bg-blue-900/40 text-sm uppercase tracking-wider text-blue-200">
                  <tr>
                    <th className="px-6 py-4">
                      Symbol
                    </th>

                    <th className="px-6 py-4">
                      Code
                    </th>

                    <th className="px-6 py-4">
                      Currency
                    </th>
                  </tr>
                  </thead>

                  <tbody>
                  {filteredCurrencies.map(currency => (
                      <tr
                          key={currency.currencyCode}
                          className="
                      border-t border-blue-900/50
                      transition-colors
                      hover:bg-blue-600/10
                    "
                      >
                        <td className="px-6 py-4">
                          <div className="
                        flex h-10 w-10
                        items-center justify-center
                        rounded-lg
                        bg-blue-600/20
                        text-lg font-semibold
                        text-blue-300
                      ">
                            {currency.currencySymbol || '-'}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                      <span className="
                        rounded-md
                        bg-[#FB923C]/15
                        px-3 py-1
                        font-semibold
                        text-[#FB923C]
                      ">
                        {currency.currencyCode}
                      </span>
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-200">
                          {currency.currencyName}
                        </td>
                      </tr>
                  ))}
                  </tbody>

                </table>

                {filteredCurrencies.length === 0 && (
                    <div className="p-10 text-center text-blue-200">
                      No currencies found.
                    </div>
                )}
              </div>
          )}
        </div>
      </section>
  );
}
