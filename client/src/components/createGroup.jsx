'use client';

import axios from 'axios';
import React, { useState } from 'react';
import { X, Users, Hash, FileText } from 'lucide-react';

const CreateGroup = ({ isOpen, onClose, adminId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post('/api/groups/createGroup', {
                name,
                description,
                adminId: adminId
            });

            if (res.status === 201) {
                setSuccess('Group created successfully!');
                setName('');
                setDescription('');
                setTimeout(() => {
                    onClose();
                }, 1000);
                window.location.reload();
            } else {
                setError('Failed to create group.');
            }
        } catch (err) {
            console.error(err);
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
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <Users size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Create Group</h2>
                            <p className="text-gray-600 text-sm">Start managing shared expenses</p>
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
                            <Hash size={16} className="text-green-500" />
                            Group Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-blue-500" />
                            Description
                        </label>
                        <textarea
                            placeholder="Describe your group's purpose"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black placeholder-gray-400 bg-white resize-none"
                            required
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
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Group...
                            </div>
                        ) : (
                            'Create Group'
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

export default CreateGroup;
