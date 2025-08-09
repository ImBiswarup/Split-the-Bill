'use client';

import axios from 'axios';
import React, { useState } from 'react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Bill</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                        min="0"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading || !amount || !description}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Creating...' : 'Create Bill'}
                    </button>
                </form>
                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-gray-500 hover:underline block mx-auto"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default CreateBills;
