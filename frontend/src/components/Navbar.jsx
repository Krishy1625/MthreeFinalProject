import { NavLink, useNavigate } from 'react-router-dom';

const link = ({ isActive }) =>
    `relative px-3 py-5 font-medium transition-colors ${
        isActive
            ? 'text-[#FB923C]'
            : 'text-[#5c6d94] hover:text-[#02022b]'
    } ${
        isActive
            ? 'after:absolute after:bottom-3 after:left-1 after:right-1 after:h-[3px] after:rounded-full after:bg-[#FB923C]'
            : ''
    }`;

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const logout = () => {
    onLogout();
    navigate('/');
  };

  return (
        <nav
            className="
                relative
                flex h-16 items-center gap-4
                bg-white
                px-6
                shadow-sm
                after:absolute
                after:bottom-0
                after:left-0
                after:right-0
                after:h-[2px]
                after:rounded-full
                after:bg-[#FB923C]
                sm:gap-8 sm:px-8
              "
        >
      <NavLink to="/home" className={link}>Convert</NavLink>
      <NavLink to="/currencies" className={link}>Currencies</NavLink>
      <NavLink to="/favourites" className={link}>Favourites</NavLink>
      <NavLink to="/history" className={link}>History</NavLink>
      <span className="flex-1" />
      <button onClick={logout} className="rounded-lg bg-[#6092FF] px-5 py-2 font-semibold text-white transition hover:bg-blue-500">
        Log out
      </button>
    </nav>
  );
}