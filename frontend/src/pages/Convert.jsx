import { useState } from 'react';
// this is justa  placeholder page that will be replaced
//  replace with fetch('/api/currencies') once CurrencyController exists.
const CURRENCIES = ['GBP', 'USD'];
const PER_GBP = { GBP: 1, USD: 1.27};

const field = 'w-full border-2 border-gray-400 bg-white p-2.5';
const label = 'mb-1 block text-sm text-gray-500';

export default function Convert() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('GBP');
  const [to, setTo] = useState('USD');
  const [result, setResult] = useState(null);

  const convert = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) return setResult({ error: 'Enter a valid amount' });
    const rate = PER_GBP[to] / PER_GBP[from];
    const out = (amt * rate).toFixed(2);
    setResult({ text: `${out} ${to}`, rate });
  };

  return (
    <div className="border-2 border-gray-400 p-5">
      <h2 className="mb-3.5 text-lg font-semibold">Converter</h2>
      <div className="flex flex-wrap gap-3">
        <div className="min-w-36 flex-1">
          <label htmlFor="amount" className={label}>Amount</label>
          <input id="amount" type="number" min="0" step="0.01" className={field} value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div className="min-w-36 flex-1">
          <label htmlFor="from" className={label}>From</label>
          <select id="from" className={field} value={from} onChange={e => setFrom(e.target.value)}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="min-w-36 flex-1">
          <label htmlFor="to" className={label}>To</label>
          <select id="to" className={field} value={to} onChange={e => setTo(e.target.value)}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={convert} className="bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">Convert</button>
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
