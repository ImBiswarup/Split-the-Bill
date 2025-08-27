'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { X, Receipt, DollarSign, FileText, Users, Split } from 'lucide-react';

const CreateBills = ({ isOpen, onClose, adminId, groupId, groupMembers = [] }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [billType, setBillType] = useState(groupId ? 'group' : 'individual'); // Default based on props

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let payload;
            let endpoint;

            if (billType === 'group' && groupId) {
                // Group bill - will be automatically split
                payload = {
                    ownerId: adminId,
                    amount: amount,
                    description,
                };
                endpoint = `/api/groups/${groupId}/bills`;
            } else {
                // Individual bill
                payload = {
                    userId: adminId,
                    amount: amount,
                    description,
                };
                endpoint = '/api/bills/createBills';
            }
            
            const res = await axios.post(endpoint, payload);

            if (res.status === 200) {
                if (billType === 'group') {
                    const { splitAmount, memberCount } = res.data;
                    setSuccess(`Group bill created successfully! Split among ${memberCount} members: $${splitAmount.toFixed(2)} each`);
                } else {
                    setSuccess('Bill created successfully!');
                }
                setAmount('');
                setDescription('');
                setTimeout(() => {
                    onClose();
                }, 2000);
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

    const isGroupBill = billType === 'group' && groupId;
    const totalMembers = groupMembers.length + 1; // +1 for admin
    const splitAmount = amount ? (parseFloat(amount) / totalMembers) : 0;

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
                            <p className="text-gray-600 text-sm">
                                {isGroupBill ? 'Add a new group expense' : 'Add a new personal expense'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                        <X size={18} className="text-gray-600" />
                    </button>
                </div>

                {/* Bill Type Selection (only show if both options are available) */}
                {groupId && (
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Bill Type</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setBillType('individual')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    billType === 'individual'
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Receipt size={16} />
                                Personal
                            </button>
                            <button
                                type="button"
                                onClick={() => setBillType('group')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                                    billType === 'group'
                                        ? 'bg-green-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Users size={16} />
                                Group
                            </button>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-blue-500" />
                            Description
                        </label>
                        <input
                            type="text"
                            placeholder={isGroupBill ? "What was this group expense for?" : "What was this expense for?"}
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

                    {/* Group Bill Split Preview */}
                    {isGroupBill && amount && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Split size={16} className="text-green-600" />
                                <span className="font-semibold text-green-800">Split Preview</span>
                            </div>
                            <div className="text-sm text-green-700">
                                <p>Total: <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span></p>
                                <p>Members: <span className="font-semibold">{totalMembers}</span></p>
                                <p>Each person pays: <span className="font-semibold">${splitAmount.toFixed(2)}</span></p>
                            </div>
                        </div>
                    )}

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
                            isGroupBill ? 'Create Group Bill' : 'Create Bill'
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
