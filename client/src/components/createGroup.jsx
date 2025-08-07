'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const CreateGroup = ({ isOpen, onClose, adminId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const params = useParams();
    const userId = params.id;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.post('/api/groups/createGroup', {
                name,
                description,
                adminId: userId
            });

            if (res.status === 201) {
                setSuccess('Group created successfully!');
                setName('');
                setDescription('');
                setTimeout(() => {
                    onClose();
                }, 1000);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Group</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded resize-none"
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Creating...' : 'Create Group'}
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

export default CreateGroup;
