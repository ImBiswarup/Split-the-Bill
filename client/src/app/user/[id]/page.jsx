'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const UserPage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const params = useParams();
    const userId = params.id;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/users/getUsers');
                const user = response.data.find(user => user.id === userId);
                if (!user) {
                    setError('User not found');
                } else {
                    setUserData(user);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError('Failed to fetch user data.');
            }
        };
        fetchUser();
    }, [userId]);

    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
    if (!userData) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex my-8 justify-center px-4 py-8">
            <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex flex-col items-center">
                    <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name || 'User'}`}
                        alt="User Avatar"
                        className="w-24 h-24 rounded-full mb-4"
                    />
                    <h2 className="text-2xl font-semibold text-gray-800">{userData.name || "Unnamed User"}</h2>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Role:</span>
                        <span className="font-medium text-gray-800">
                            {userData.isAdmin ? 'Admin' : 'User'}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Created:</span>
                        <span className="text-gray-800">
                            {new Date(userData.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
