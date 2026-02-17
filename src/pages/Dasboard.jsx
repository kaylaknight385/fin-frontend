import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/shared/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const { colors, agentName } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* welcome banner */}
        <div className={`${colors.gradient} text-white rounded-2xl shadow-xl p-8 mb-6`}>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.username}! </h1>
          <p className="text-lg opacity-90">Your finance buddy {agentName} is ready to help you manage your money</p>
        </div>

        {/* quick money stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-500 text-sm mb-1">Balance</p>
            <p className="text-3xl font-bold text-gray-800">${user?.balance?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-500 text-sm mb-1">This Month</p>
            <p className="text-3xl font-bold text-gray-800">$0.00</p>
            <p className="text-xs text-gray-400 mt-1">Coming soon</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-500 text-sm mb-1">Cashback Earned</p>
            <p className="text-3xl font-bold text-green-600">$0.00</p>
            <p className="text-xs text-gray-400 mt-1">Coming soon</p>
          </div>
        </div>

        {/* lil placeholder message */}
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4"> Dashboard features coming soon!</p>
          <p className="text-gray-500 text-sm">Transactions, budgets, and more will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;