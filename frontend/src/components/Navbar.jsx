import { NavLink, useNavigate } from 'react-router-dom';

const link = ({ isActive }) =>
  `px-0.5 py-1.5 border-b-4 ${isActive ? 'text-white border-amber-500' : 'text-blue-100 border-transparent hover:text-white'}`;

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const logout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="flex h-14 items-center gap-3 bg-blue-600 px-3 sm:gap-6 sm:px-6">
      <NavLink to="/home" className={link}>Convert</NavLink>
      <NavLink to="/currencies" className={link}>Currencies</NavLink>
      <NavLink to="/favourites" className={link}>Favourites</NavLink>
      <span className="flex-1" />
      <button onClick={logout} className="bg-amber-500 px-4 py-2 font-semibold hover:bg-amber-400">
        Log out
      </button>
    </nav>
  );
}
