import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { colors, agentName, font, theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Home'},
    { path: '/transactions', label: 'Transactions'},
    { path: '/budgets', label: 'Budgets'},
    { path: '/cashback', label: 'Rewards'},
    { path: '/ai-chat', label: agentName},
  ];

  return (
    <nav 
      className={`${colors.gradient} shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95`}
      style={theme === 'cosmic' ? { 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -2px 8px rgba(212, 175, 55, 0.3)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* my logo heeere */}
          <Link to="/dashboard">
            <h1 className={`text-2xl font-bold text-white font-play-pretend drop-shadow-lg`}>
              Rize Up 
            </h1>
          </Link>

          {/* nav links */}
          <div className={`hidden md:flex items-center gap-2 ${font || ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  location.pathname === link.path
                    ? `bg-white/30 backdrop-blur-sm text-white shadow-lg`
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* usssser info + logout */}
          <div className={`flex items-center gap-4 ${font || ''}`}>
            <div className="hidden md:flex items-center gap-2">
              <div className={`w-8 h-8 ${colors.accent} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-medium">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all text-sm font-medium border border-white/30"
            >
              Logout
            </button>
          </div>
        </div>

        {/* moooobile nav - RESPONSIVE */}
        <div className={`flex md:hidden justify-around mt-3 pt-3 border-t border-white/20 ${font || ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 text-xs ${
                location.pathname === link.path
                  ? 'text-white'
                  : 'text-white/70'
              }`}
            >
              <span className="text-xl">{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;