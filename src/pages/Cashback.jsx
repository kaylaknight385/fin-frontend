import { useState, useEffect } from 'react';
import Navbar from '../components/shared/Navbar';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { getCashbackRewards, getTotalCashback } from '../services/cashbackService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { useTheme } from '../hooks/useTheme';

const Cashback = () => {
  const { colors } = useTheme();
  const [rewards, setRewards] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCashback();
  }, []);

  const fetchCashback = async () => {
    try {
      const [rewardsRes, statsRes] = await Promise.all([
        getCashbackRewards(),
        getTotalCashback('all')
      ]);
      setRewards(rewardsRes.data.rewards);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching cashback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cashback Rewards</h1>

        {/* your tootal earned */}
        <div className={`${colors.gradient} text-white rounded-xl shadow-xl p-8 mb-6`}>
          <p className="text-lg opacity-90 mb-2">Total Earned</p>
          <p className="text-5xl font-bold">{stats ? formatCurrency(stats.totalEarned) : '$0.00'}</p>
          <p className="text-sm opacity-75 mt-2">{stats?.totalTransactions || 0} cashback transactions</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : rewards.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
            <p className="text-lg">No cashback yet</p>
            <p className="text-sm mt-2">Make purchases on supported platforms to earn rewards!</p>
          </div>
        ) : (
          <>
            {/* platform stats */}
            {stats?.byPlatform && stats.byPlatform.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {stats.byPlatform.slice(0, 3).map((platform) => (
                  <div key={platform.platform} className="bg-white rounded-xl shadow-md p-6">
                    <p className="font-bold text-gray-800 mb-2">{platform.platformDisplay}</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(platform.totalEarned)}</p>
                    <p className="text-sm text-gray-500">{platform.count} transactions</p>
                  </div>
                ))}
              </div>
            )}

            {/* the rewards list */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Recent Cashback</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {rewards.map((reward) => (
                  <div key={reward._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${colors.primary} rounded-full flex items-center justify-center text-white font-bold`}>
                        {reward.percentage}%
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{reward.platformDisplay}</p>
                        <p className="text-sm text-gray-500">{formatDate(reward.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">+{formatCurrency(reward.amount)}</p>
                      <p className="text-xs text-gray-500">from {formatCurrency(reward.transactionAmount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cashback;