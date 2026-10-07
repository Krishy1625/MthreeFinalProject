import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Convert from './pages/Convert.jsx';
import Currencies from './pages/Currencies.jsx';
import Favourites from './pages/Favourites.jsx';
import History from './pages/History.jsx';
import Navbar from './components/Navbar.jsx';


export default function App() {
  const [user, setUser] = useState(null);

  // Pages after login share the navbar; anyone not logged in goes back to login.
    const protect = children =>
        user ? (
            <div className="relative min-h-screen overflow-hidden bg-[#02022b]">

                {/* Top-right shapes */}
                <div className="absolute -right-40 -top-52 h-[650px] w-[650px] rounded-[45%] bg-blue-600/80 rotate-12" />
                <div className="absolute right-16 -top-56 h-[600px] w-[520px] rounded-[45%] bg-blue-900/70 rotate-12" />

                {/* Bottom-left shapes */}
                <div className="absolute -bottom-60 -left-44 h-[650px] w-[650px] rounded-[45%] bg-blue-600/80 -rotate-12" />
                <div className="absolute -bottom-64 left-10 h-[600px] w-[520px] rounded-[45%] bg-blue-900/70 -rotate-12" />

                {/* Actual page */}
                <div className="relative z-10">
                    <Navbar onLogout={() => setUser(null)} />

                    <main className="mx-auto max-w-4xl px-6 py-8">
                        {children}
                    </main>
                </div>

            </div>
        ) : (
            <Navigate to="/" replace />
        );

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={setUser} />} />
      <Route path="/home" element={protect(<Convert user={user} />)} />
      <Route path="/currencies" element={protect(<Currencies />)} />
      <Route path="/favourites" element={protect(<Favourites user={user} />)} />
      <Route path="/history" element={protect(<History user={user} />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}