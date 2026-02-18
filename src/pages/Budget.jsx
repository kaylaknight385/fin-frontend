import { useState, useEffect } from 'react';
import Navbar from '../components/shared/Navbar';
import Popup from '../components/shared/Popup';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import BlockRain from '../components/shared/BlockRain';
import ShootingStar from '../components/shared/ShootingStar';
import LoveHeartCursor from '../components/shared/LoveHeartCursor';
import SparklesCursor from '../components/shared/SparklesCursor';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService';
import { CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatCurrency';
import { useTheme } from '../hooks/useTheme';

const Budgets = () => {
  const { colors, theme, background, font, cursor } = useTheme();
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: 'food',
    limit: ''
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await getBudgets();
      setBudgets(response.data.budgets);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const budgetData = {
        ...formData,
        limit: parseFloat(formData.limit),
        month: new Date().toISOString().slice(0, 7)
      };
      
      if (editingId) {
        await updateBudget(editingId, budgetData);
      } else {
        await createBudget(budgetData);
      }
      
      setIsPopupOpen(false);
      setEditingId(null);
      setFormData({ category: 'food', limit: '' });
      fetchBudgets();
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget._id);
    setFormData({
      category: budget.category,
      limit: budget.limit.toString()
    });
    setIsPopupOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ category: 'food', limit: '' });
    setIsPopupOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await deleteBudget(id);
        fetchBudgets();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={cursor ? { cursor: `url(${cursor}), auto` } : {}}
    >
      {/* Shooting stars effect for Nova theme */}
      {theme === 'cosmic' && <ShootingStar />}
      
      {/* Sparkles cursor effect for Nova theme */}
      {theme === 'cosmic' && <SparklesCursor />}
      
      {/* Love heart cursor effect for Bloom theme */}
      {theme === 'garden' && <LoveHeartCursor />}
      
      {/* Block rain effect for Pixel theme */}
      {theme === 'neon' && <BlockRain />}
      
      {/* background image */}
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
      
      <div className={`max-w-7xl mx-auto p-6 ${font || ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${colors.cardText}`}>Budgets</h1>
          <button
            onClick={handleAdd}
            className={`${colors.primary} text-white px-6 py-3 rounded-lg font-semibold ${colors.hover} transition-all`}
          >
            + Create Budget
          </button>
        </div>

        {/* summary */}
        {summary && (
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-md p-6 mb-6`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className={`text-sm ${colors.cardText} opacity-70 mb-1`}>Total Budget</p>
                <p className={`text-2xl font-bold ${colors.cardText}`}>{formatCurrency(summary.totalLimit)}</p>
              </div>
              <div>
                <p className={`text-sm ${colors.cardText} opacity-70 mb-1`}>Spent</p>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(summary.totalSpent)}</p>
              </div>
              <div>
                <p className={`text-sm ${colors.cardText} opacity-70 mb-1`}>Remaining</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(summary.remaining)}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className={`flex items-center justify-between text-sm mb-2`}>
                <span className={`${colors.cardText} opacity-70`}>Overall Progress</span>
                <span className={`font-semibold ${colors.cardText}`}>{summary.percentUsed}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${summary.percentUsed > 90 ? 'bg-red-500' : summary.percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(summary.percentUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* your budgets list */}
        {loading ? (
          <LoadingSpinner />
        ) : budgets.length === 0 ? (
          <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-md p-12 text-center ${colors.cardText}`}>
            <p className="text-lg">No budgets yet</p>
            <p className="text-sm opacity-70">Create your first budget to track spending!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map((budget) => {
              const percent = budget.limit > 0 ? Math.round((budget.spent / budget.limit) * 100) : 0;
              const categoryInfo = CATEGORIES.find(c => c.value === budget.category);
              
              return (
                <div key={budget._id} className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-md p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className={`font-bold ${colors.cardText}`}>{categoryInfo?.label || budget.category}</p>
                        <p className={`text-sm ${colors.cardText} opacity-70`}>{formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-blue-400 hover:text-blue-600 transition-all text-xl"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="text-red-500 hover:text-red-700 transition-all"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className={`${colors.cardText} opacity-70`}>Progress</span>
                      <span className={`font-semibold ${colors.cardText}`}>{percent}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className={`text-sm ${colors.cardText} opacity-70 mt-3`}>
                    {formatCurrency(budget.limit - budget.spent)} remaining
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* create/edit budget Popup */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title={editingId ? "Edit Budget" : "Create Budget"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              {CATEGORIES.filter(c => c.value !== 'other').map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Limit</label>
            <input
              type="number"
              step="0.01"
              value={formData.limit}
              onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
              required
              placeholder="300.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 ${colors.primary} text-white py-3 rounded-lg font-semibold ${colors.hover}`}
            >
              {editingId ? 'Update Budget' : 'Create Budget'}
            </button>
          </div>
        </form>
      </Popup>
      </div>
    </div>
  );
};

export default Budgets;