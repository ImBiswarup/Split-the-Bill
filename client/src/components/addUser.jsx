'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add User to Group</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email (preferred)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                    />
                    <div className="text-center text-gray-400 text-sm">or</div>
                    <input
                        type="text"
                        placeholder="Name (if email not available)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading || (!email && !name)}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Adding...' : 'Add User'}
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

export default AddUserModal;
