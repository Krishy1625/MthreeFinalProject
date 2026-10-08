import { useEffect, useState } from 'react';
import FavouritePairs from '../components/FavouritePairs.jsx';

const field = 'w-full rounded-lg border border-white/20 bg-white/95 px-4 py-3 text-[#02022b] outline-none transition focus:border-[#FB923C] focus:ring-2 focus:ring-[#FB923C]/20 disabled:bg-gray-200 disabled:opacity-60';
const label = 'mb-2 block text-sm font-medium text-blue-100';

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
        <section>
          <div className="mb-8">
            <div className="mb-3 h-[3px] w-12 rounded-full bg-[#FB923C]"/>

            <h1 className="text-3xl font-bold text-[#02022b]">
              Currency converter
            </h1>

            <p className="mt-2 text-sm font-medium text-[#24244f]">
              Convert currencies using live exchange rates.
            </p>
          </div>

          <div className="rounded-2xl border border-white/50 bg-[#172554]/75 p-6 shadow-xl backdrop-blur-md sm:p-8">
            {isLoadingCurrencies ? (
                <p role="status" className="py-8 text-center text-blue-100">
                  Loading currencies...
                </p>
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
                        className="self-end rounded-lg border border-[#FB923C]/40 bg-[#FB923C]/15 px-5 py-3 font-semibold text-[#FB923C] transition hover:bg-[#FB923C]/25 disabled:opacity-60"
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
                  {error && <p role="alert" className="mt-5 rounded-lg bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
                  <button
                      type="submit"
                      disabled={isDisabled}
                      className="mt-6 rounded-lg bg-[#1E3A8A] px-7 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isConverting ? 'Converting...' : 'Convert'}
                  </button>
                </form>
            )}
            {!isLoadingCurrencies && currencies.length === 0 && !error && (
                <p role="alert" className="mt-4 text-red-200">
              No currencies are available.
              </p>
            )}
            {result && (
                <div
                    className="mt-6 rounded-xl border border-[#FB923C]/30 bg-[#1E3A8A]/55 p-6"
                    aria-live="polite"
                >
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#FB923C]">
                    Conversion result
                  </p>

                  <p className="text-3xl font-bold text-white">
                    {Number(result.convertedAmount).toFixed(2)} {result.toCurrency}
                  </p>

                  <p className="mt-2 text-sm text-blue-100">
                    {result.amount} {result.fromCurrency} = {Number(result.convertedAmount).toFixed(2)} {result.toCurrency}
                    {' '}(rate: {Number(result.exchangeRate).toFixed(5)})
                  </p>
                </div>
            )}
          </div>
        </section>
        {showNotesDialog && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
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
                  className="my-auto w-full max-w-md rounded-2xl border border-white/30 bg-[#172554] p-6 shadow-2xl"
              >
                <div className="mb-4 h-[3px] w-12 rounded-full bg-[#FB923C]"/>

                <h2 id="conversion-notes-title" className="mb-2 text-xl font-bold text-white">
                  Add a note
                </h2>

                <p className="mb-5 text-sm text-blue-100">
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
                  <p className="mt-1 text-right text-xs text-blue-200">{notes.length}/255</p>

                  {error && (
                      <p role="alert" className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-200">
                        {error}
                      </p>
                  )}
                  <div className="mt-4 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => setShowNotesDialog(false)}
                        disabled={isConverting}
                        className="rounded-lg border border-white/30 px-4 py-2 font-medium text-blue-100 transition hover:bg-white/10 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isConverting}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                      {isConverting ? 'Converting...' : 'Convert and save'}
                    </button>
                  </div>
                </form>
              </section>
            </div>
        )}
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
