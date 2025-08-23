'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { X, Receipt, DollarSign, FileText } from 'lucide-react';

const CreateBills = ({ isOpen, onClose, adminId }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = {
                userId : adminId,
                amount: amount,
                description,
            };
            
            const res = await axios.post('/api/bills/createBills', payload);

            if (res.status === 200) {
                setSuccess('Bill created successfully!');
                setAmount('');
                setDescription('');
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setError('Failed to create bill.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg mx-4 transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                            <Receipt size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Create Bill</h2>
                            <p className="text-gray-600 text-sm">Add a new expense to track</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                        <X size={18} className="text-gray-600" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-blue-500" />
                            Description
                        </label>
                        <input
                            type="text"
                            placeholder="What was this expense for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <DollarSign size={16} className="text-green-500" />
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-green-600 text-sm font-medium">{success}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !amount || !description}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Bill...
                            </div>
                        ) : (
                            'Create Bill'
                        )}
                    </button>
                </form>

                {/* Cancel Button */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium transition-colors duration-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreateBills;
