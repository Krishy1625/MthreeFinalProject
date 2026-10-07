import { NavLink, useNavigate } from 'react-router-dom';

const link = ({ isActive }) =>
    `px-3 py-2 font-medium transition-colors ${
        isActive
            ? 'text-white border-b-2 border-[#FB923C]'
            : 'text-blue-100 border-b-2 border-transparent hover:text-white'
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
      <NavLink to="/history" className={link}>History</NavLink>
      <span className="flex-1" />
      <button onClick={logout} className="rounded-lg bg-[#FB923C] px-5 py-2 font-semibold text-[#02022b] transition-colors hover:bg-orange-300">
        Log out
      </button>
    </nav>
  );
}