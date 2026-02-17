import { useState, useEffect } from 'react';
import Navbar from '../components/shared/Navbar';
import Popup from '../components/shared/Popup';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { getTransactions, createTransaction, deleteTransaction, updateTransaction, getTrasaction } from '../services/transactionService';
import { CATEGORIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { useTheme } from '../hooks/useTheme';

const Transactions = () => {
    const {colors} = useTheme();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    const handleDelete = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            try {
                await deleteTransaction(id);
                fetchTransactions();
            }
        }
    } 
}