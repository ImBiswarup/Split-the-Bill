'use client'

import React, { useEffect, useState } from 'react'
import { PlusCircle, Edit, Trash2, Save, X, DollarSign, FileText, Calendar, Search, Filter, Plus, TrendingUp } from 'lucide-react'
import axios from 'axios'

const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ description: '', amount: '' });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAmount, setFilterAmount] = useState('all');
    const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);
    const [error, setError] = useState('');

    // Fetch all expenses
    const fetchExpenses = async () => {
        try {
            setIsLoadingExpenses(true);
            setError('');
            const res = await axios.get('/api/expenses/getAll');

            // FIX: Extract the actual array
            setExpenses(res.data.expenses || []);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError('Failed to load expenses. Please try again.');
            setExpenses([]);
        } finally {
            setIsLoadingExpenses(false);
        }
    };


    useEffect(() => {
        fetchExpenses();
    }, []);

    // Create expense
    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0) return;

        setLoading(true);
        try {
            const payload = {
                ...newExpense,
                amount: parseFloat(newExpense.amount)
            };
            const res = await axios.post('/api/expenses/create', payload);
            console.log('Added expense:', res.data);
            setExpenses((prev) => [...prev, res.data.expense]);
            setNewExpense({ description: '', amount: '' });
            setShowForm(false);
        } catch (err) {
            console.error('Error adding expense:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete expense
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        try {
            await axios.delete(`/api/expenses/${id}`);
            setExpenses((prev) => prev.filter(exp => exp.id !== id));
        } catch (err) {
            console.error('Error deleting expense:', err);
        }
    };

    // Start editing
    const handleEdit = (expense) => {
        setEditingId(expense.id);
        setEditForm({ description: expense.description, amount: expense.amount.toString() });
    };

    // Save edit
    const handleSaveEdit = async () => {
        try {
            const payload = {
                ...editForm,
                amount: parseFloat(editForm.amount)
            };
            const res = await axios.put(`/api/expenses/${editingId}`, payload);
            setExpenses((prev) =>
                prev.map(exp => exp.id === editingId ? res.data.expense : exp)
            );
            setEditingId(null);
        } catch (err) {
            console.error('Error updating expense:', err);
        }
    };

    // Filter and search expenses
    const filteredExpenses = expenses?.filter(expense => {
        const matchesSearch = expense?.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterAmount === 'all' ||
            (filterAmount === 'low' && expense.amount < 50) ||
            (filterAmount === 'medium' && expense.amount >= 50 && expense.amount < 200) ||
            (filterAmount === 'high' && expense.amount >= 200);

        return matchesSearch && matchesFilter;
    }) || [];

    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                        <DollarSign size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Expense Tracker
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Keep track of your spending and manage your finances with ease
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                                {isLoadingExpenses ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded mt-1"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <DollarSign size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Items</p>
                                {isLoadingExpenses ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded mt-1"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">{filteredExpenses.length}</p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <FileText size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average</p>
                                {isLoadingExpenses ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded mt-1"></div>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-900">
                                        {filteredExpenses.length > 0 ? `$${(totalAmount / filteredExpenses.length).toFixed(2)}` : '$0.00'}
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <TrendingUp size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={isLoadingExpenses}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-black placeholder-gray-400 bg-white"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <select
                                value={filterAmount}
                                onChange={(e) => setFilterAmount(e.target.value)}
                                disabled={isLoadingExpenses}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-black bg-white"
                            >
                                <option value="all">All Amounts</option>
                                <option value="low">Under $50</option>
                                <option value="medium">$50 - $200</option>
                                <option value="high">Over $200</option>
                            </select>

                            <button
                                onClick={() => setShowForm(!showForm)}
                                disabled={isLoadingExpenses}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <Plus size={20} />
                                Add Expense
                            </button>
                        </div>
                    </div>
                </div>

                {/* Add Expense Form */}
                {showForm && (
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Expense</h3>
                        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <input
                                    type="text"
                                    placeholder="What was this expense for?"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="0.00"
                                        value={newExpense.amount}
                                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-end gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Adding...' : 'Add Expense'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Expenses List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
                    </div>

                    {isLoadingExpenses ? (
                        <div className="text-center py-12">
                            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading expenses...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={24} className="text-red-400" />
                            </div>
                            <p className="text-red-600 text-lg mb-2">{error}</p>
                            <p className="text-gray-500 mb-4">Please try refreshing the page or contact support.</p>
                            <button
                                onClick={fetchExpenses}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : filteredExpenses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={24} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">No expenses found</p>
                            <p className="text-gray-400">Add your first expense to get started</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredExpenses.map((expense) => (
                                        <tr key={expense.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            {editingId === expense.id ? (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            value={editForm.description}
                                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0.01"
                                                                value={editForm.amount}
                                                                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                                                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black bg-white"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {new Date(expense.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                                                                title="Save"
                                                            >
                                                                <Save size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingId(null)}
                                                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                                                                title="Cancel"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                                <FileText size={20} className="text-blue-600" />
                                                            </div>
                                                            <span className="font-medium text-gray-900">{expense.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-lg font-semibold text-gray-900">${expense.amount.toFixed(2)}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar size={16} className="mr-2" />
                                                            {new Date(expense.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleEdit(expense)}
                                                                className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                                                                title="Edit"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(expense.id)}
                                                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ExpensesPage
