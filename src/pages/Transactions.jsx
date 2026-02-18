import { useState, useEffect } from 'react';
import Navbar from '../components/shared/Navbar';
import Popup from '../components/shared/Popup';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import BlockRain from '../components/shared/BlockRain';
import ShootingStar from '../components/shared/ShootingStar';
import LoveHeartCursor from '../components/shared/LoveHeartCursor';
import SparklesCursor from '../components/shared/SparklesCursor';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';
import { CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { useTheme } from '../hooks/useTheme';

const Transactions = () => {
  const { colors, theme, background, font, cursor } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'food',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (editingId) {
        await updateTransaction(editingId, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      
      setIsPopupOpen(false);
      setEditingId(null);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'food',
        date: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
      console.error('Backend error:', error.response?.data);
      alert(error.response?.data?.error || 'Error saving transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
    setIsPopupOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'food',
      date: new Date().toISOString().split('T')[0]
    });
    setIsPopupOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await deleteTransaction(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={cursor ? { cursor: `url(${cursor}), auto` } : {}}
    >
      {/* shooting stars effect for Nova theme */}
      {theme === 'cosmic' && <ShootingStar />}
      
      {/* sparkles cursor effect for Nova theme */}
      {theme === 'cosmic' && <SparklesCursor />}
      
      {/* flower cursor effect for Bloom theme */}
      {theme === 'garden' && <LoveHeartCursor />}
      
      {/* block rain effect for Pixel theme */}
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
        {/* page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-white-3xl font-bold`}>Transactions</h1>
          <button
            onClick={handleAdd}
            className={`${colors.primary} text-white px-6 py-3 rounded-lg font-semibold ${colors.hover} transition-all`}
          >
            + Add Transaction
          </button>
        </div>

        {/* my transactions list */}
        <div className={`${colors.cardBg} backdrop-blur-md rounded-xl shadow-md`}>
          {loading ? (
            <LoadingSpinner />
          ) : transactions.length === 0 ? (
            <div className={`p-12 text-center ${colors.cardText}`}>
              <p className="text-lg">No transactions yet</p>
              <p className="text-sm opacity-70">Add your first transaction to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="p-4 hover:bg-white/5 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${colors.primary} rounded-full flex items-center justify-center text-2xl`}>
                      {CATEGORIES.find(c => c.value === transaction.category)?.emoji}
                    </div>
                    <div>
                      <p className={`font-semibold ${colors.cardText}`}>{transaction.description}</p>
                      <p className={`text-sm ${colors.cardText} opacity-70`}>
                        {CATEGORIES.find(c => c.value === transaction.category)?.label} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`text-xl font-bold ${transaction.type === 'income' ? 'text-green-400' : colors.cardText}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-400 hover:text-blue-600 transition-all text-xl"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-500 hover:text-red-700 transition-all"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* add/edit transaction Popup */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} title={editingId ? "Edit Transaction" : "Add Transaction"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Coffee from cafe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              placeholder="10.50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  formData.type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  formData.type === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.emoji} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </Popup>
      </div>
    </div>
  );
};

export default Transactions;