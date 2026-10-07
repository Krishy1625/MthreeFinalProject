import { useEffect, useState } from 'react';
import FavouritePairs from '../components/FavouritePairs.jsx';

const field = 'w-full border-2 border-gray-400 bg-white p-2.5 disabled:bg-gray-100';
const label = 'mb-1 block text-sm text-gray-500';

async function getErrorMessage(response) {
  const message = await response.text();
  if (!message) return 'Unable to complete conversion.';

  try {
    const data = JSON.parse(message);
    return data.message || 'Unable to complete conversion.';
  } catch {
    return message;
  }
}

export default function Convert({ user }) {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadCurrencies = async () => {
      try {
        const response = await fetch('/api/currencies', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Unable to load currencies.');
        }
        const data = await response.json();
        setCurrencies(data);
        setFrom(data.find(currency => currency.currencyCode === 'GBP')?.currencyCode
          || data[0]?.currencyCode
          || '');
        setTo(data.find(currency => currency.currencyCode === 'USD')?.currencyCode
          || data[1]?.currencyCode
          || data[0]?.currencyCode
          || '');
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load currencies.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCurrencies(false);
        }
      }
    };

    loadCurrencies();
    return () => controller.abort();
  }, []);

  const openNotesDialog = event => {
    event.preventDefault();
    setError('');

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }
    if (!from || !to) {
      setError('Select both currencies.');
      return;
    }
    setNotes('');
    setShowNotesDialog(true);
  };

  const convert = async event => {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsConverting(true);
    try {
      const params = new URLSearchParams({ amount, from, to });
      const response = await fetch(`/api/currencies/convert?${params}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }
      const conversion = await response.json();
      setResult(conversion);
      setShowNotesDialog(false);

      const fromCurrency = currencies.find(currency => currency.currencyCode === from);
      const toCurrency = currencies.find(currency => currency.currencyCode === to);
      const historyResponse = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          fromCurrencyId: fromCurrency.currencyId,
          toCurrencyId: toCurrency.currencyId,
          amount: conversion.amount,
          exchangeRate: conversion.exchangeRate,
          convertedAmount: conversion.convertedAmount,
          notes: notes.trim() || null,
        }),
      });
      if (!historyResponse.ok) {
        throw new Error(`Conversion completed, but saving it to history failed: ${await getErrorMessage(historyResponse)}`);
      }
    } catch (conversionError) {
      setError(conversionError.message || 'Could not connect to the conversion service.');
    } finally {
      setIsConverting(false);
    }
  };

  const isDisabled = isLoadingCurrencies || currencies.length === 0 || isConverting;

  return (
    <>
      <section className="border-2 border-gray-400 p-5">
        <h1 className="mb-3.5 text-lg font-semibold">Currency converter</h1>
        {isLoadingCurrencies ? (
          <p role="status">Loading currencies...</p>
        ) : (
          <form onSubmit={openNotesDialog}>
            <div className="flex flex-wrap gap-3">
              <div className="min-w-36 flex-1">
                <label htmlFor="amount" className={label}>Amount</label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="any"
                  required
                  className={field}
                  value={amount}
                  onChange={event => setAmount(event.target.value)}
                />
              </div>
              <div className="min-w-36 flex-1">
                <label htmlFor="from" className={label}>From</label>
                <select
                  id="from"
                  className={field}
                  value={from}
                  onChange={event => setFrom(event.target.value)}
                  disabled={isDisabled}
                  required
                >
                  {currencies.map(currency => (
                    <option key={currency.currencyCode} value={currency.currencyCode}>
                      {currency.currencyCode} - {currency.currencyName}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                aria-label="Swap currencies"
                onClick={() => {
                  setFrom(to);
                  setTo(from);
                  setResult(null);
                  setError('');
                }}
                disabled={isDisabled}
                className="self-end border-2 border-gray-400 bg-white px-3 py-2.5 hover:bg-gray-100 disabled:opacity-60"
              >
                Swap
              </button>
              <div className="min-w-36 flex-1">
                <label htmlFor="to" className={label}>To</label>
                <select
                  id="to"
                  className={field}
                  value={to}
                  onChange={event => setTo(event.target.value)}
                  disabled={isDisabled}
                  required
                >
                  {currencies.map(currency => (
                    <option key={currency.currencyCode} value={currency.currencyCode}>
                      {currency.currencyCode} - {currency.currencyName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={isDisabled}
              className="mt-4 bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isConverting ? 'Converting...' : 'Convert'}
            </button>
          </form>
        )}
        {!isLoadingCurrencies && currencies.length === 0 && !error && (
          <p role="alert" className="text-red-700">No currencies are available.</p>
        )}
        {result && (
          <div className="mt-4" aria-live="polite">
            <p className="text-2xl font-bold">
              {Number(result.convertedAmount).toFixed(2)} {result.toCurrency}
            </p>
            <p className="text-sm text-gray-500">
              {result.amount} {result.fromCurrency} = {Number(result.convertedAmount).toFixed(2)} {result.toCurrency}
              {' '}(rate: {Number(result.exchangeRate).toFixed(5)})
            </p>
          </div>
        )}
        {showNotesDialog && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            role="presentation"
            onMouseDown={event => {
              if (event.target === event.currentTarget && !isConverting) {
                setShowNotesDialog(false);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="conversion-notes-title"
              className="w-full max-w-md border-2 border-gray-400 bg-white p-5 shadow-xl"
            >
              <h2 id="conversion-notes-title" className="mb-2 text-lg font-semibold">
                Add a note
              </h2>
              <p className="mb-4 text-sm text-gray-600">
                Add an optional note to this conversion before saving it to history.
              </p>
              <form onSubmit={convert}>
                <label htmlFor="conversion-notes" className={label}>Note (optional)</label>
                <textarea
                  id="conversion-notes"
                  maxLength={255}
                  rows={3}
                  className={field}
                  value={notes}
                  onChange={event => setNotes(event.target.value)}
                  disabled={isConverting}
                />
                <p className="mt-1 text-right text-xs text-gray-500">{notes.length}/255</p>
                {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowNotesDialog(false)}
                    disabled={isConverting}
                    className="border border-gray-400 px-4 py-2 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isConverting}
                    className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isConverting ? 'Converting...' : 'Convert and save'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
        </section>
      <FavouritePairs
        userId={user.userId}
        currentPair={{
          from,
          to,
          fromId: currencies.find(currency => currency.currencyCode === from)?.currencyId,
          toId: currencies.find(currency => currency.currencyCode === to)?.currencyId,
        }}
        onUsePair={(fromCode, toCode) => {
          setFrom(fromCode);
          setTo(toCode);
          setResult(null);
          setError('');
        }}
      />
    </>
  );
}
