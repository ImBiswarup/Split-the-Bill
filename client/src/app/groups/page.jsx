'use client'

import { useAppContext } from '@/context/AppContext'
import { Users, PlusCircle, Crown, UserPlus, Settings, Calendar, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import CreateGroup from '@/components/createGroup'

const GroupPage = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [adminGroups, setAdminGroups] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { getUserFromToken, getUserData } = useAppContext();
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = getUserFromToken();
        const getData = async () => {
            try {
                setLoading(true);
                const data = await getUserData(user.id);
                setUserData(data);
                setAdminGroups(data.adminGroups || []);
                setUserGroups(data.groups || []);
                console.log("data in grp page : ", data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            getData();
        }
    }, []);

    // This will be called after a group is successfully created
    const handleGroupCreated = (newGroup) => {
        setAdminGroups((prev) => [...prev, newGroup]);
    };

    const GroupCard = ({ group, isAdmin = false, onClick }) => (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-white" />
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        <Crown size={12} />
                        Admin
                    </div>
                )}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {group.name}
            </h3>
            
            {group.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {group.description}
                </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(group.createdAt).toLocaleDateString()}
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
        </div>
    );

    const EmptyState = ({ title, description, icon: Icon, actionText, onAction }) => (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6">{description}</p>
            {actionText && onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <PlusCircle size={20} />
                    {actionText}
                </button>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your groups...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                        <Users size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Your Groups
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Manage your expense groups and collaborate with friends, family, and roommates
                    </p>
                </div>

                {/* Create Group Button */}
                <div className="text-center mb-12">
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <PlusCircle size={24} />
                        Create New Group
                    </button>
                </div>

                {/* Admin Groups Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Crown size={20} className="text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Groups You Admin</h2>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                            {adminGroups.length}
                        </span>
                    </div>
                    
                    {adminGroups.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {adminGroups.map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    isAdmin={true}
                                    onClick={() => {
                                        window.location.href = `/groups/${group.id}`;
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No Admin Groups Yet"
                            description="Create your first group to start managing shared expenses with others."
                            icon={Users}
                            actionText="Create Group"
                            onAction={() => setIsCreateOpen(true)}
                        />
                    )}
                </div>

                {/* Member Groups Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <UserPlus size={20} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Groups You're In</h2>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {userGroups.length}
                        </span>
                    </div>
                    
                    {userGroups.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {userGroups.map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    isAdmin={false}
                                    onClick={() => {
                                        window.location.href = `/groups/${group.id}`;
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No Member Groups Yet"
                            description="You haven't joined any groups yet. Ask your friends to invite you or create your own group."
                            icon={UserPlus}
                        />
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200 text-left"
                        >
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <PlusCircle size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Create Group</p>
                                <p className="text-sm text-gray-600">Start a new expense group</p>
                            </div>
                        </button>
                        
                        <button className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-200 text-left">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <UserPlus size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Join Group</p>
                                <p className="text-sm text-gray-600">Enter an invite code</p>
                            </div>
                        </button>
                        
                        <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200 text-left">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                <Settings size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Group Settings</p>
                                <p className="text-sm text-gray-600">Manage your groups</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Create Group Modal */}
                <CreateGroup
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    adminId={userData?.id}
                    onGroupCreated={handleGroupCreated}
                />
            </div>
        </div>
    )
}

export default GroupPage
