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
      <section>
        {/* Heading */}
        <div className="mb-8">
            <div className="mb-3 h-[3px] w-12 rounded-full bg-[#FB923C]" />

            <h1 className="text-3xl font-bold text-[#02022b]">
              Currencies
            </h1>

            <p className="mt-2 text-sm font-medium text-[#24244f]">
              Browse the currencies available for conversion.
            </p>
        </div>

        {/* Table card */}
        <div
            className="
          overflow-hidden
          rounded-2xl
          border border-white/50
          bg-[#172554]/75
          shadow-xl
          backdrop-blur-md
        "
        >
          {/* Search */}
          <div className="border-b border-white/10 p-5">
            <input
                type="text"
                placeholder="Search by currency name or code..."
                value={search}
                onChange={event => setSearch(event.target.value)}
                className="
              w-full
              rounded-lg
              border border-white/20
              bg-white/90
              px-4 py-3
              text-[#02022b]
              placeholder:text-[#24244f]/50
              outline-none
              transition
              focus:border-[#FB923C]
              focus:ring-2
              focus:ring-[#FB923C]/20
            "
            />
          </div>

          {loading && (
              <p
                  role="status"
                  className="p-8 text-center text-blue-100"
              >
                Loading currencies...
              </p>
          )}

          {error && (
              <p
                  role="alert"
                  className="m-5 rounded-lg bg-red-500/10 p-4 text-red-200"
              >
                {error}
              </p>
          )}

          {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">

                  {/* Header */}
                  <thead className="bg-[#1E3A8A]/55">
                  <tr className="text-sm uppercase tracking-wider text-blue-100">
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
                            border-t border-blue-300/10
                            text-white
                            transition-colors
                            hover:bg-blue-400/10
                          "
                      >
                        {/* Symbol */}
                        <td className="px-6 py-4">
                          <div
                              className="
                                flex h-10 w-10
                                items-center justify-center
                                rounded-lg
                                bg-blue-400/20
                                font-semibold
                                text-blue-100
                              "
                          >
                            {currency.currencySymbol || '-'}
                          </div>
                        </td>

                        {/* Code */}
                        <td className="px-6 py-4">
                      <span
                          className="
                            rounded-md
                            bg-[#FB923C]/15
                            px-3 py-1
                            font-semibold
                            text-[#FB923C]
                          "
                      >
                        {currency.currencyCode}
                      </span>
                        </td>

                        {/* Currency name */}
                        <td className="px-6 py-4 font-medium text-blue-50">
                          {currency.currencyName}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>

                {filteredCurrencies.length === 0 && (
                    <div className="p-10 text-center text-blue-100">
                      No currencies found.
                    </div>
                )}
              </div>
          )}
        </div>
      </section>
  );
}

