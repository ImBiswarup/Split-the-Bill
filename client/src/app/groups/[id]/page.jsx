'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import AddUserModal from '@/components/addUser';
import CreateBills from '@/components/CreateBills';

const GroupPage = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState('');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isCreateBillsModalOpen, setIsCreateBillsModalOpen] = useState(false);
    const router = useRouter();

    const fetchGroup = async () => {
        try {
            const res = await axios.get('/api/groups/getGroups', { params: { id } });
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
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!group) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 sm:p-8 space-y-6">
                <div className="border-b pb-4 flex flex-col justify-center">
                    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">{group.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{`Group description : ${group.description}` || 'No description'}</p>
                    {/* add users to group */}
                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Add User
                    </button>
                    <AddUserModal
                        isOpen={isAddUserModalOpen}
                        onClose={handleUserAdded}
                        groupId={group.id}
                    />
                    {/* create bills button */}
                    <button
                        onClick={() => setIsCreateBillsModalOpen(true)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Create Bill
                    </button>
                    <CreateBills
                        isOpen={isCreateBillsModalOpen}
                        onClose={() => setIsCreateBillsModalOpen(false)}
                        adminId={group?.adminId}
                    />

                </div>

                <div>
                    <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-2">Admin</h2>
                    <p
                        onClick={() => router.push(`/user/${group.admin?.id}`)}
                        className="text-gray-700 dark:text-gray-300 cursor-pointer hover:underline"
                    >
                        {group.admin?.name || 'Unknown'}
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-medium text-gray-800 dark:text-white mb-2">Members</h2>
                    <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {group.users?.length > 0 ? (
                            group.users.map((user) => (
                                <li
                                    key={user.id}
                                    onClick={() => router.push(`/user/${user.id}`)}
                                    className="cursor-pointer hover:underline"
                                >
                                    {user.name || user.email}
                                </li>
                            ))
                        ) : (
                            <li>No members in this group.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default GroupPage;
