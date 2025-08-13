'use client'

import { useAppContext } from '@/context/AppContext'
import { Users, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import CreateGroup from '@/components/createGroup' // adjust the path if needed

const GroupPage = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [adminGroups, setAdminGroups] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { getUserFromToken, getUserData } = useAppContext();
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const user = getUserFromToken();
        const getData = async () => {
            const data = await getUserData(user.id);
            setUserData(data);
            setAdminGroups(data.adminGroups);
            setUserGroups(data.groups);
            console.log("data in grp page : ", data);
            console.log('admin groups: ', adminGroups);
        };
        if (user) {
            getData();
        }
    }, []);

    // This will be called after a group is successfully created
    const handleGroupCreated = (newGroup) => {
        setUserGroups((prev) => [...prev, newGroup]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 mt-[3rem]">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    Your Groups
                </h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
                               hover:bg-blue-700 transition"
                >
                    <PlusCircle size={20} />
                    Create Group
                </button>
            </div>
            <h2 className='text-xl font-semibold text-white mb-2'>Admin Group</h2>
            {adminGroups.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {adminGroups.map((group) => (
                        <div
                            onClick={() => {
                                window.location.href = `/groups/${group.id}`;
                            }}
                            key={group.id}
                            className="bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl py-2 px-2 items-center 
                                       hover:scale-[1.02] hover:shadow-xl transition-all duration-300
                                       border border-white/20 flex gap-x-4 cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold text-white mb-2">
                                <Users />
                            </h2>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {group.name}
                            </h2>
                        </div>
                    ))}
                </div>
            ) : null}

            <h2 className='text-xl font-semibold text-white mb-2 mt-4'>Members Group</h2>
            {userGroups.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userGroups.map((group) => (
                        <div
                            onClick={() => {
                                window.location.href = `/groups/${group.id}`;
                            }}
                            key={group.id}
                            className="bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl py-2 px-2 items-center 
                                       hover:scale-[1.02] hover:shadow-xl transition-all duration-300
                                       border border-white/20 flex gap-x-4 cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold text-white mb-2">
                                <Users />
                            </h2>
                            <h2 className="text-xl font-semibold text-white mb-2">
                                {group.name}
                            </h2>
                        </div>
                    ))}
                </div>

            ) : (
                <div className="text-center text-gray-400 text-lg">
                    You haven’t joined any groups yet.
                </div>
            )}

            <CreateGroup
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                adminId={userData?.id}
                onGroupCreated={handleGroupCreated}
            />
        </div>
    )
}

export default GroupPage
