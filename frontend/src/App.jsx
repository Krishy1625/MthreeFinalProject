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
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#5286ff] via-[#F8FAFC] to-[#f0dec7]">

                {/* Top-right decoration */}
                <div className="absolute -right-52 -top-64 h-[850px] w-[850px] rounded-full bg-blue-500/15" />
                <div className="absolute -right-20 -top-72 h-[700px] w-[820px] rounded-full bg-blue-400/10" />

                {/* Bottom-left decoration */}
                <div className="absolute -bottom-72 -left-52 h-[850px] w-[850px] rounded-full bg-blue-500/15" />
                <div className="absolute -bottom-80 left-0 h-[700px] w-[700px] rounded-full bg-blue-400/10" />

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