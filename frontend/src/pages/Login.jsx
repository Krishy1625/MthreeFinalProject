import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const input = 'mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100';
const label = 'mb-1 block text-sm text-gray-500';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/users/${isRegistering ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isRegistering
          ? { username, password, confirmPassword }
          : { username, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Unable to complete your request.');
      }
      onLogin(result);
      navigate('/home');
    } catch (requestError) {
      setError(requestError.message || 'Could not connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-slate-50 to-orange-100 px-4">
      <form onSubmit={submit}
            className="w-full max-w-md rounded-2xl border border-gray-200 border-t-4 border-t-orange-400 bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">{isRegistering ? 'Create an account' : 'Log in'}</h1>

        <p className="mb-6 text-sm text-gray-500">
          {isRegistering
              ? 'Create an account to start converting currencies.'
              : 'Log in to continue to your currency converter.'}
        </p>
        <label htmlFor="username" className={label}>Username</label>
        <input id="username" maxLength={30} className={input} value={username}
               onChange={e => setUsername(e.target.value)} required autoComplete="username"/>
        <label htmlFor="password" className={label}>Password</label>
        <input id="password" type="password" minLength={isRegistering ? 8 : undefined} maxLength={72} className={input}
               value={password} onChange={e => setPassword(e.target.value)} required
               autoComplete={isRegistering ? 'new-password' : 'current-password'}/>
        {isRegistering && (
            <>
              <label htmlFor="confirmPassword" className={label}>Confirm password</label>
              <input id="confirmPassword" type="password" minLength={8} maxLength={72} className={input}
                     value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                     autoComplete="new-password"/>
            </>
        )}
        {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-60">
          {isSubmitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Log in'}
        </button>
        <p className="mt-4 text-center text-sm">
          {isRegistering ? 'Already have an account?' : 'New here?'}{' '}
          <button
              type="button"
              className="font-semibold text-orange-500 transition hover:text-orange-600 hover:underline"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
          >
            {isRegistering ? 'Log in' : 'Create an account'}
          </button>
        </p>
      </form>
    </div>
  );
}
