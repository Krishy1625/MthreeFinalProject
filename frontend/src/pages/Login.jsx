import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const input = 'mb-4 w-full border-2 border-gray-400 bg-white p-2.5';
const label = 'mb-1 block text-sm text-gray-500';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();
    // TODO: replace with a call to your Spring login endpoint, e.g.
    // fetch('/api/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username, password }) })
    onLogin({ username });
    navigate('/home');
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gray-100 p-5">
      <form onSubmit={submit} className="w-full max-w-sm border-2 border-t-8 border-gray-400 border-t-blue-600 bg-white p-7">
        <h1 className="mb-4 text-xl font-bold">Log in</h1>
        <label htmlFor="username" className={label}>Username</label>
        <input id="username" className={input} value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
        <label htmlFor="password" className={label}>Password</label>
        <input id="password" type="password" className={input} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        <button type="submit" className="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">Log in</button>
      </form>
    </div>
  );
}
