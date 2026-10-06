import { useEffect, useState } from 'react';

const PER_GBP = { GBP: 1, USD: 1.27 };

const field = 'w-full border-2 border-gray-400 bg-white p-2.5';
const label = 'mb-1 block text-sm text-gray-500';

export default function Convert() {
  const [amount, setAmount] = useState('100');
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [currencyError, setCurrencyError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await fetch('/api/currencies');
        if (!response.ok) {
          throw new Error('Could not load currencies.');
        }

        const availableCurrencies = await response.json();
        setCurrencies(availableCurrencies);
        const codes = availableCurrencies.map(currency => currency.currencyCode);
        setFrom(codes.includes('GBP') ? 'GBP' : codes[0] ?? '');
        setTo(codes.includes('USD') ? 'USD' : codes[0] ?? '');
      } catch (error) {
        setCurrencyError(error.message || 'Could not load currencies.');
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadCurrencies();
  }, []);

  const convert = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) return setResult({ error: 'Enter a valid amount' });
    if (PER_GBP[from] === undefined || PER_GBP[to] === undefined) {
      return setResult({ error: 'Conversion rates are not available for this currency.' });
    }
    const rate = PER_GBP[to] / PER_GBP[from];
    const out = (amt * rate).toFixed(2);
    setResult({ text: `${out} ${to}`, rate });
  };

  const currencyOptions = currencies.map(currency => (
    <option key={currency.currencyCode} value={currency.currencyCode}>
      {currency.currencyCode} — {currency.currencyName}
      {currency.currencySymbol ? ` (${currency.currencySymbol})` : ''}
    </option>
  ));

  return (
    <div className="border-2 border-gray-400 p-5">
      <h2 className="mb-3.5 text-lg font-semibold">Converter</h2>
      {loadingCurrencies && <p role="status" className="mb-3 text-sm text-gray-500">Loading currencies...</p>}
      {currencyError && <p role="alert" className="mb-3 text-sm text-red-600">{currencyError}</p>}
      <div className="flex flex-wrap gap-3">
        <div className="min-w-36 flex-1">
          <label htmlFor="amount" className={label}>Amount</label>
          <input id="amount" type="number" min="0" step="0.01" className={field} value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="min-w-36 flex-1">
          <label htmlFor="from" className={label}>From</label>
          <select id="from" className={field} value={from} onChange={e => setFrom(e.target.value)} disabled={loadingCurrencies || !!currencyError}>
            {currencyOptions}
          </select>
        </div>
        <div className="min-w-36 flex-1">
          <label htmlFor="to" className={label}>To</label>
          <select id="to" className={field} value={to} onChange={e => setTo(e.target.value)} disabled={loadingCurrencies || !!currencyError}>
            {currencyOptions}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={convert} disabled={loadingCurrencies || !!currencyError || currencies.length === 0} className="bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">Convert</button>
      </div>
      {result && (
        <p className="mt-4 text-2xl font-bold">
          {result.error ?? (
            <>
              {result.text}{' '}
              <span className="text-sm font-normal text-gray-500">(1 {from} = {result.rate.toFixed(5)} {to})</span>
            </>
          )}
        </p>
      )}
    </div>
  );
}
