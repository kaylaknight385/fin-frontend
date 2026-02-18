import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import BlockRain from '../components/shared/BlockRain';
import ShootingStar from '../components/shared/ShootingStar';
import { getTransactions, getTransactionStats } from '../services/transactionService';
import { getBudgets } from '../services/budgetService';
import { getTotalCashback } from '../services/cashbackService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { THEMES } from '../utils/constants';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const { theme, colors, agentName, changeTheme, background, font, cursor } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [cashbackTotal, setCashbackTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, transactionsRes, cashbackRes] = await Promise.all([
        getTransactionStats(),
        getTransactions(),
        getTotalCashback('month')
      ]);
      
      setStats(statsRes.data);
      setRecentTransactions(transactionsRes.data.transactions.slice(0, 5));
      setCashbackTotal(cashbackRes.data.totalEarned);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // theme change
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    // update user object in localStorage here
    const updatedUser = { ...user, theme: newTheme };
    updateUser(updatedUser);
  };

  // Border class for cards - animated for Bloom theme
  const cardBorder = theme === 'garden' ? 'bloom-border' : theme === 'cosmic' ? 'nova-border' : 'border border-white/10';

  return (
    <div 
      className="min-h-screen relative"
      style={cursor ? { cursor: `url(${cursor}), auto` } : {}}
    >
      {/* Shooting stars effect for Nova theme */}
      {theme === 'cosmic' && <ShootingStar />}
      
      {/* Block rain effect for Pixel theme */}
      {theme === 'neon' && <BlockRain />}
      
      {/* background image for Nova theme */}
      {background && (
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
      
      <div className="relative z-10">
        <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* theme switcher - DEMO ONLY */}
        <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-md p-4 mb-6 ${cardBorder}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Demo: Switch Themes</p>
              <p className="text-xs text-gray-500">Current: {theme} - {agentName}</p>
            </div>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    theme === t.id
                      ? `bg-gradient-to-br ${t.gradient} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* welcome banner */}
        <div className={`${colors.gradient} text-white rounded-2xl shadow-xl p-8 mb-6 transition-all duration-500 ${font || ''} backdrop-blur-sm`}>
          <h1 className="text-5xl font-bold mb-2">Welcome back, {user?.username}!</h1>
          <p className="text-4lg opacity-90">{agentName} is here to help you Rize Up!</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* ur balaance */}
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-all ${cardBorder}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${colors.cardText} font-medium`}>Balance</p>
              <div className={`w-10 h-10 ${colors.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                $
              </div>
            </div>
            <p className={`text-3xl font-bold ${colors.cardText}`}>{formatCurrency(user?.balance || 0)}</p>
            <p className={`text-xs ${colors.cardText} opacity-70 mt-1`}>Available to spend</p>
          </div>

          {/* monthly spending */}
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-all ${cardBorder}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${colors.cardText} font-medium`}>This Month</p>
              <div className="w-10 h-10 bg-red-500/80 rounded-full flex items-center justify-center text-white font-bold">
                -
              </div>
            </div>
            <p className={`text-3xl font-bold ${colors.cardText}`}>
              {stats ? formatCurrency(stats.totalExpenses) : formatCurrency(0)}
            </p>
            <p className={`text-xs ${colors.cardText} opacity-70 mt-1`}>Total expenses</p>
          </div>

          {/* ur earned cashback */}
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-lg p-6 hover:shadow-xl transition-all ${cardBorder}`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${colors.cardText} font-medium`}>Cashback</p>
              <div className="w-10 h-10 bg-green-500/80 rounded-full flex items-center justify-center text-white font-bold">
                +
              </div>
            </div>
            <p className={`text-3xl font-bold ${theme === 'garden' ? colors.cardText : 'text-green-400'}`}>{formatCurrency(cashbackTotal)}</p>
            <p className={`text-xs ${colors.cardText} opacity-70 mt-1`}>Earned this month</p>
          </div>
        </div>

        {/* budget & stocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* budget overview */}
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-lg p-6 ${cardBorder}`}>
            <h2 className={`text-xl font-bold ${colors.cardText} mb-4`}>Budget Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${colors.cardText}`}>Food & Dining</span>
                  <span className={`text-sm ${colors.cardText} opacity-80`}>$320 / $500</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className={`${colors.primary} h-2 rounded-full`} style={{ width: '64%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${colors.cardText}`}>Entertainment</span>
                  <span className={`text-sm ${colors.cardText} opacity-80`}>$150 / $200</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className={`${colors.primary} h-2 rounded-full`} style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${colors.cardText}`}>Shopping</span>
                  <span className={`text-sm ${colors.cardText} opacity-80`}>$280 / $400</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className={`${colors.primary} h-2 rounded-full`} style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/budgets')}
              className={`mt-4 w-full bg-white/10 hover:bg-white/20 ${colors.cardText} py-2 rounded-lg transition-all text-sm font-medium`}
            >
              View All Budgets
            </button>
          </div>

          {/* Stocks */}
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-lg p-6 ${cardBorder}`}>
            <h2 className={`text-xl font-bold ${colors.cardText} mb-4`}>Stocks Watchlist</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    AAPL
                  </div>
                  <div>
                    <p className={`${colors.cardText} font-semibold text-sm`}>Apple Inc.</p>
                    <p className={`${colors.cardText} opacity-70 text-xs`}>$178.45</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">+2.3%</p>
                  <p className={`${colors.cardText} opacity-70 text-xs`}>+$4.12</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    TSLA
                  </div>
                  <div>
                    <p className={`${colors.cardText} font-semibold text-sm`}>Tesla Inc.</p>
                    <p className={`${colors.cardText} opacity-70 text-xs`}>$245.67</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-bold text-sm">-1.2%</p>
                  <p className={`${colors.cardText} opacity-70 text-xs`}>-$2.98</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    BTC
                  </div>
                  <div>
                    <p className={`${colors.cardText} font-semibold text-sm`}>Bitcoin</p>
                    <p className={`${colors.cardText} opacity-70 text-xs`}>$43,250</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">+5.7%</p>
                  <p className={`${colors.cardText} opacity-70 text-xs`}>+$2,340</p>
                </div>
              </div>
            </div>
            <button
              className={`mt-4 w-full bg-white/10 hover:bg-white/20 ${colors.cardText} py-2 rounded-lg transition-all text-sm font-medium`}
            >
              Manage Watchlist
            </button>
          </div>
        </div>

        {/*  recent transactions */}
        {recentTransactions.length > 0 && (
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-lg p-6 ${cardBorder}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${colors.cardText}`}>Recent Activity</h2>
              <button
                onClick={() => navigate('/transactions')}
                className={`${colors.text} hover:underline text-sm font-semibold`}
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${colors.primary} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                      {transaction.category.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-800'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;