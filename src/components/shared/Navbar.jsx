import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { colors, agentName, theme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navLinks = [
    { path: '/dashboard', label: 'Home'},
    { path: '/transactions', label: 'Transactions'},
    { path: '/budgets', label: 'Budgets'},
    { path: '/cashback', label: 'Rewards'},
    { path: '/ai-chat', label: agentName},
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* my logo heeere */}
          <Link to="/dashboard">
            <h1 className={`text-2xl font-bold ${colors.text} font-play-pretend`}>
              Rize Up 
            </h1>
          </Link>

          {/* nav links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  location.pathname === link.path
                    ? `${colors.primary} text-white`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* usssser info + logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className={`w-8 h-8 ${colors.primary} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 font-medium">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* moooobile nav - RESPONSIVE */}
        <div className="flex md:hidden justify-around mt-3 pt-3 border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 text-xs ${
                location.pathname === link.path
                  ? colors.text
                  : 'text-gray-500'
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