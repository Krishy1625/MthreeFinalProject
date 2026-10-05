import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const input = 'mb-4 w-full border-2 border-gray-400 bg-white p-2.5';
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
    <div className="grid min-h-screen place-items-center bg-gray-100 p-5">
      <form onSubmit={submit} className="w-full max-w-sm border-2 border-t-8 border-gray-400 border-t-blue-600 bg-white p-7">
        <h1 className="mb-4 text-xl font-bold">{isRegistering ? 'Create an account' : 'Log in'}</h1>
        <label htmlFor="username" className={label}>Username</label>
        <input id="username" maxLength={30} className={input} value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
        <label htmlFor="password" className={label}>Password</label>
        <input id="password" type="password" minLength={isRegistering ? 8 : undefined} maxLength={72} className={input} value={password} onChange={e => setPassword(e.target.value)} required autoComplete={isRegistering ? 'new-password' : 'current-password'} />
        {isRegistering && (
          <>
            <label htmlFor="confirmPassword" className={label}>Confirm password</label>
            <input id="confirmPassword" type="password" minLength={8} maxLength={72} className={input} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
          </>
        )}
        {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-60">
          {isSubmitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Log in'}
        </button>
        <p className="mt-4 text-center text-sm">
          {isRegistering ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            className="font-semibold text-blue-700 hover:underline"
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
