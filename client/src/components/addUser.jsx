'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { X, UserPlus, Mail, User } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, groupId }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
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
                groupId,
                userName: name,
                email
            };
            console.log("Sending request to add user:", payload);
            const res = await axios.post('/api/users/addUser', payload);

            if (res.status === 200) {
                setSuccess('User added successfully!');
                setEmail('');
                setName('');
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setError('Failed to add user.');
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
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <UserPlus size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Add User</h2>
                            <p className="text-gray-600 text-sm">Invite someone to your group</p>
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
                            <Mail size={16} className="text-blue-500" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <User size={16} className="text-green-500" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white"
                        />
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
                        disabled={loading || (!email && !name)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding User...
                            </div>
                        ) : (
                            'Add User to Group'
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

export default AddUserModal;
