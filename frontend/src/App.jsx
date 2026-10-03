import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Convert from './pages/Convert.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  const [user, setUser] = useState(null);

  // Pages after login share the navbar; anyone not logged in goes back to login.
  const protect = children =>
    user ? (
      <>
        <Navbar onLogout={() => setUser(null)} />
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </>
    ) : (
      <Navigate to="/" replace />
    );

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={setUser} />} />
      <Route path="/home" element={protect(<Convert />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
