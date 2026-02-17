import { Link, useLocation } from 'reacr-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Navbar = () => {
    const {user, logout} = useAuth();
    const { colors, agentName, theme} = useTheme;
    const location = useLocation;

    const handleLogout = () {
        logout();
        window.location.href = '/login'
    };

    const navLinks = [
        {path: '/dashboard', label: 'Home'},
        {path: '/transaction', label: 'Transactions'},
        {path: '/budgets', label: Budgets},
        {path: '/cashback', label: 'Cashback'},
        {path: '/ai-chat', label: agentName}
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-5">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/*my logo heeere*/}
                    <Link to="/dashboard">
                    <h1>
                        Rize Up
                    </h1>
                    </Link>

                    {/*my nav linnks*/}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                            key={link.path}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg font-medium  transition-all`} 
                            >
                            </Link>

                        )
                        )}

                    </div>

                </div>

            </div>
        </nav>
    )
}