'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import AddUserModal from '@/components/addUser';
import CreateBills from '@/components/CreateBills';
import { Users, UserPlus, Receipt, Crown, Calendar, ArrowRight, Settings } from 'lucide-react';

const GroupPage = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState('');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isCreateBillsModalOpen, setIsCreateBillsModalOpen] = useState(false);
    const router = useRouter();

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`/api/groups/${id}`);
            if (res.data.error) setError(res.data.error);
            else setGroup(res.data);
        } catch (err) {
            setError('Failed to fetch group data.');
        }
    };
    
    useEffect(() => {
        fetchGroup();
    }, [id]);

    const handleUserAdded = () => {
        setIsAddUserModalOpen(false);
        fetchGroup();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={24} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading group...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Group Header */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <Users size={32} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{group.name}</h1>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-blue-500" />
                                            <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-green-500" />
                                            <span>{group.users?.length || 0} members</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {group.description && (
                                <p className="text-lg text-gray-600 max-w-3xl">
                                    {group.description}
                                </p>
                            )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setIsAddUserModalOpen(true)}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <UserPlus size={20} />
                                Add User
                            </button>
                            <button
                                onClick={() => setIsCreateBillsModalOpen(true)}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Receipt size={20} />
                                Create Bill
                            </button>
                        </div>
                    </div>
                </div>

                {/* Group Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Admin Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <Crown size={20} className="text-yellow-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Group Admin</h2>
                        </div>
                        
                        <div 
                            onClick={() => router.push(`/user/${group.admin?.id}`)}
                            className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${group.admin?.name || 'Admin'}`}
                                    alt="Admin Avatar"
                                    className="w-12 h-12 rounded-xl"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">{group.admin?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-600">Group Administrator</p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users size={20} className="text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Group Members</h2>
                            </div>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {group.users?.length || 0}
                            </span>
                        </div>
                        
                        {group.users?.length > 0 ? (
                            <div className="space-y-3">
                                {group.users.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => router.push(`/user/${user.id}`)}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`}
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-lg"
                                            />
                                            <span className="font-medium text-gray-900">
                                                {user.name || user.email}
                                            </span>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={24} className="text-gray-400" />
                                </div>
                                <p className="text-gray-500">No members in this group yet</p>
                                <p className="text-gray-400 text-sm">Add users to get started</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <button
                            onClick={() => setIsAddUserModalOpen(true)}
                            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 text-left"
                        >
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <UserPlus size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Add Member</p>
                                <p className="text-sm text-gray-600">Invite someone to join</p>
                            </div>
                        </button>
                        
                        <button
                            onClick={() => setIsCreateBillsModalOpen(true)}
                            className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 text-left"
                        >
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <Receipt size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Create Bill</p>
                                <p className="text-sm text-gray-600">Add a new expense</p>
                            </div>
                        </button>
                        
                        <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200 text-left">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                <Settings size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Group Settings</p>
                                <p className="text-sm text-gray-600">Manage group preferences</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Modals */}
                <AddUserModal
                    isOpen={isAddUserModalOpen}
                    onClose={handleUserAdded}
                    groupId={group.id}
                />
                <CreateBills
                    isOpen={isCreateBillsModalOpen}
                    onClose={() => setIsCreateBillsModalOpen(false)}
                    adminId={group?.adminId}
                />
            </div>
        </div>
    );
};

export default GroupPage;
