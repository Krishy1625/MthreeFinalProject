import { NavLink, useNavigate } from 'react-router-dom';

const link = ({ isActive }) =>
    `px-3 py-2 font-medium transition-colors ${
        isActive
            ? 'text-blue-500 border-b-2 border-blue-500'
            : 'text-blue-100 border-b-2 border-transparent hover:text-blue-400'
    }`;

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const logout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="flex h-16 items-center gap-4 bg-[#04044f] px-6 font-sans shadow-md sm:gap-8 sm:px-8">
      <NavLink to="/home" className={link}>Convert</NavLink>
      <NavLink to="/currencies" className={link}>Currencies</NavLink>
      <NavLink to="/favourites" className={link}>Favourites</NavLink>
      <span className="flex-1" />
      <button onClick={logout} className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-blue-500">
        Log out
      </button>
    </nav>
  );
}