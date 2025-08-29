'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { BookPlus, Trash, User, Crown, Calendar, Mail, Edit, Users, Receipt, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import CreateGroup from '@/components/createGroup';
import { useAppContext } from '@/context/AppContext';

const UserPage = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const params = useParams();
    const userId = params.id;
    const {getUserFromToken} = useAppContext();
    
    useEffect(() => {
        getUserFromToken();
    }, []);

    const fetchUser = async () => {
        try {
            // Call the Next.js API route instead of going through the backend directly
            const response = await axios.get(`/api/users/${userId}`);
            const user = response.data;
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

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={24} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        </div>
    );
    
    if (!userData) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name || 'User'}`}
                                alt="User Avatar"
                                className="w-24 h-24 rounded-2xl shadow-lg"
                            />
                            {userData.isAdmin && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                    <Crown size={16} className="text-white" />
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                {userData.name || "Unnamed User"}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-blue-500" />
                                    <span>{userData.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-green-500" />
                                    <span>Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                <button 
                                    onClick={() => alert('edit profile')} 
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Edit size={16} />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <BookPlus size={16} />
                                    Create Group
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Groups</p>
                                <p className="text-2xl font-bold text-gray-900">{userData.groups?.length || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Admin Groups</p>
                                <p className="text-2xl font-bold text-gray-900">{userData.adminGroups?.length || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <Crown size={24} className="text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Bills</p>
                                <p className="text-2xl font-bold text-gray-900">{userData.bills?.length || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Receipt size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Groups */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">User Groups</h3>
                        </div>
                        
                        {userData.groups?.length > 0 ? (
                            <div className="space-y-3">
                                {userData.groups.map((group) => (
                                    <Link 
                                        key={group.id} 
                                        href={`/groups/${group.id}`}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group"
                                    >
                                        <span className="font-medium text-gray-900">{group.name}</span>
                                        <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500">No groups assigned</p>
                            </div>
                        )}
                    </div>

                    {/* Admin Groups */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <Crown size={20} className="text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Admin Groups</h3>
                        </div>
                        
                        {userData.adminGroups?.length > 0 ? (
                            <div className="space-y-3">
                                {userData.adminGroups.map((group) => (
                                    <Link 
                                        key={group.id} 
                                        href={`/groups/${group.id}`}
                                        className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors duration-200 group"
                                    >
                                        <span className="font-medium text-gray-900">{group.name}</span>
                                        <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Crown size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500">No admin groups assigned</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Bills */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Receipt size={20} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">User Bills</h3>
                    </div>
                    
                    {userData.bills?.length > 0 ? (
                        <div className="space-y-3">
                            {userData.bills.map((bill) => (
                                <div 
                                    key={bill.id} 
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Receipt size={16} className="text-green-600" />
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {bill.name || `${bill.description} - $${bill.amount}`}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteBill(bill.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                                        title="Delete Bill"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt size={24} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500">No bills assigned</p>
                        </div>
                    )}
                </div>

                {/* Create Group Modal */}
                <CreateGroup
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    adminId={userData.id}
                />
            </div>
        </div>
    );
};

export default UserPage;

