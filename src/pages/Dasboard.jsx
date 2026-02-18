import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import { getTransactions, getTransactionStats } from '../services/transactionService';
import { getBudgets } from '../services/budgetService';
import { getTotalCashback } from '../services/cashbackService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { THEMES } from '../utils/constants';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const { theme, colors, agentName, changeTheme } = useTheme();
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

  // Theme change
  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
    // update user object in localStorage here
    const updatedUser = { ...user, theme: newTheme };
    updateUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* theme switcher - DEMO ONLY */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
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
        <div className={`${colors.gradient} text-white rounded-2xl shadow-xl p-8 mb-6 transition-all duration-500`}>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-lg opacity-90">Your AI buddy {agentName} is here to help you Rize Up!</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* ur balaance */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-medium">Balance</p>
              <div className={`w-10 h-10 ${colors.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                $
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{formatCurrency(user?.balance || 0)}</p>
            <p className="text-xs text-gray-400 mt-1">Available to spend</p>
          </div>

          {/* monthly spending */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-medium">This Month</p>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                -
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats ? formatCurrency(stats.totalExpenses) : formatCurrency(0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Total expenses</p>
          </div>

          {/* ur earned cashback */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-medium">Cashback</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                +
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(cashbackTotal)}</p>
            <p className="text-xs text-gray-400 mt-1">Earned this month</p>
          </div>
        </div>

        {/* qwuick actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/transactions')}
              className={`p-4 border-2 ${colors.border} rounded-xl hover:shadow-lg transition-all text-center`}
            >
              <div className={`w-12 h-12 ${colors.primary} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                T
              </div>
              <p className="text-sm font-semibold text-gray-700">Transactions</p>
            </button>
            <button
              onClick={() => navigate('/budgets')}
              className={`p-4 border-2 ${colors.border} rounded-xl hover:shadow-lg transition-all text-center`}
            >
              <div className={`w-12 h-12 ${colors.primary} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                B
              </div>
              <p className="text-sm font-semibold text-gray-700">Budgets</p>
            </button>
            <button
              onClick={() => navigate('/cashback')}
              className={`p-4 border-2 ${colors.border} rounded-xl hover:shadow-lg transition-all text-center`}
            >
              <div className={`w-12 h-12 ${colors.primary} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                R
              </div>
              <p className="text-sm font-semibold text-gray-700">Rewards</p>
            </button>
            <button
              className={`p-4 border-2 ${colors.border} rounded-xl hover:shadow-lg transition-all text-center`}
            >
              <div className={`w-12 h-12 ${colors.primary} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                AI
              </div>
              <p className="text-sm font-semibold text-gray-700">Chat with {agentName}</p>
            </button>
          </div>
        </div>

        {/*  recent transactions */}
        {recentTransactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
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
  );
};

export default Dashboard;