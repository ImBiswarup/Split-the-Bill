'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { BookPlus, Trash } from 'lucide-react';
import Link from 'next/link';
import AddUserModal from '@/components/addUser';
import CreateGroup from '@/components/createGroup';

const UserPage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const params = useParams();
    const userId = params.id;

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/users/getUserById', {
                params: { id: userId }
            });
            const user = response.data;
            if (!user) {
                setError('User not found');
            } else {
                setUserData(user);
                console.log(`Fetched user data:`, user);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setError('Failed to fetch user data.');
        }
    };
    useEffect(() => {
        fetchUser();
    }, [userId]);

    const handleDeleteBill = async (id) => {
        try {
            const res = await axios.delete('/api/bills/deleteBills', {
                data: { id }
            });
            setUserData((prevData) => ({
                ...prevData,
                bills: prevData.bills.filter(bill => bill.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting bill:", error);
            setError('Failed to delete bill.');
        }
    };


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

                <div className="flex items-center justify-between space-x-4">
                    <button onClick={() => alert('edit profile')} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                        Edit Profile
                    </button>
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        >
                            <BookPlus />
                        </button>
                    </div>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">User Groups</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {userData.groups?.length > 0 ? (
                            userData.groups.map((group) => (
                                <li key={group.id}>
                                    <Link href={`/groups/${group.id}`} className="text-gray-700 hover:underline">
                                        {group.name}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No groups assigned</li>
                        )}
                    </ul>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">User Admin Groups</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {userData.adminGroups?.length > 0 ? (
                            userData.adminGroups.map((group) => (
                                <li key={group.id}>
                                    <Link href={`/groups/${group.id}`} className="text-gray-700 hover:underline">
                                        {group.name}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No admin groups assigned</li>
                        )}
                    </ul>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">User Bills</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        {userData.bills?.length > 0 ? (
                            userData.bills.map((bill) => (
                                <ul onClick={() => console.log(bill.id)} key={bill.id}>
                                    <p className="text-gray-700 hover:underline flex items-center justify-between cursor-pointer my-4">
                                        {bill.name || `${bill.description} - ${bill.amount}`}
                                        <li onClick={() => handleDeleteBill(bill.id)}><Trash /></li>
                                    </p>
                                </ul>
                            ))
                        ) : (
                            <li className="text-gray-500">No bills assigned</li>
                        )}
                    </ul>
                </div>
            </div>

            <CreateGroup
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                groupId={userData.groups[0]?.id}
            />
        </div>
    );
};

export default UserPage;

