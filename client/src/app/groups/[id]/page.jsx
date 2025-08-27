'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import AddUserModal from '@/components/addUser';
import CreateBills from '@/components/CreateBills';
import { Users, UserPlus, Receipt, Calendar } from 'lucide-react';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAppContext } from '@/context/AppContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_OPTIONS = {
    style: {
        base: {
            color: "#000",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            "::placeholder": { color: "#888" },
        },
        invalid: { color: "#ff6b6b" },
    },
};

function BillPaymentForm({ amount, billId, isPaid, onPaymentSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { user } = useAppContext();

    console.log('User:', user?.id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post('/api/create-payment-intent', { amount: amount * 100, billId });
            const { clientSecret } = res.data;

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });

            if (error) {
                setMessage(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                try {
                    await axios.put(`/api/bills/update-bills`, {
                        billId,
                        userId: user.id,
                        status: true,
                        amount
                    });

                } catch (err) {
                    console.error("Failed to update bill status:", err);
                }
                setMessage("🎉 Payment successful!");
                onPaymentSuccess && onPaymentSuccess();
            }
        } catch (err) {
            const apiError = err?.response?.data?.error || err?.message || "Payment failed. Please try again.";
            setMessage(apiError);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-3 sm:p-4 rounded-xl shadow-md flex flex-col gap-3 mt-3 sm:mt-4">
            {!isPaid && (
                <div className="bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
                    <CardElement options={CARD_OPTIONS} />
                </div>
            )}
            <button
                type="submit"
                disabled={!stripe || loading || isPaid}
                className={`py-2 px-4 rounded-lg transition text-sm sm:text-base font-medium ${
                    isPaid 
                        ? 'bg-green-600 text-white cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
                {isPaid ? "Already Paid" : (loading ? "Processing..." : `Pay $${amount}`)}
            </button>
            {/* {isPaid && !message && (
                <p className="text-center text-sm text-green-600 font-medium">✓ Already Paid</p>
            )} */}
            {message && <p className={`text-center text-xs sm:text-sm ${message.includes("successful") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
        </form>
    );
}

const GroupPage = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState('');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isCreateBillsModalOpen, setIsCreateBillsModalOpen] = useState(false);
    const router = useRouter();

    const { user } = useAppContext();
    console.log('User:', user?.id);

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`/api/groups/${id}`);
            console.log('group bills : ', res.data.bills);
            console.log('User:', user);

            if (res.data.error) {
                setError(res.data.error);
            } else {
                const updatedBills = res.data.bills?.map(bill => {
                    const userSplit = bill.splits?.find(s => s.userId === user?.id);
                    return {
                        ...bill,
                        splits: userSplit ? [userSplit] : [],
                        userSplit: userSplit || null
                    };
                });

                setGroup({
                    ...res.data,
                    bills: updatedBills
                });
            }
        } catch (err) {
            setError('Failed to fetch group data.');
        }
    };


    useEffect(() => {
        if (user?.id) {
            fetchGroup();
        }
    }, [id, user]);

    const handleUserAdded = () => {
        setIsAddUserModalOpen(false);
        fetchGroup();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16 sm:pt-20 pb-6 sm:pb-10">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6 lg:p-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <Users size={20} className="sm:w-6 sm:h-6 text-red-500" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-2">Error</h2>
                        <p className="text-sm sm:text-base text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16 sm:pt-20 pb-6 sm:pb-10">
                <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
                    <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">Loading group...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16 sm:pt-20 pb-6 sm:pb-10">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">

                {/* Group Header */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-6">
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <Users size={24} className="sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{group.name}</h1>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="sm:w-4 sm:h-4 text-blue-500" />
                                            <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="sm:w-4 sm:h-4 text-green-500" />
                                            <span>{group.users?.length || 0} members</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {group.description && (
                                <p className="text-base sm:text-lg text-gray-600 max-w-3xl">{group.description}</p>
                            )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setIsAddUserModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                            >
                                <UserPlus size={18} className="sm:w-5 sm:h-5" /> Add User
                            </button>
                            <button
                                onClick={() => setIsCreateBillsModalOpen(true)}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                            >
                                <Receipt size={18} className="sm:w-5 sm:h-5" /> Create Bill
                            </button>
                        </div>
                    </div>
                </div>

                {/* Group Bills Section */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mt-6 lg:mt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Receipt size={16} className="sm:w-5 sm:h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Your Bills</h3>
                        </div>
                    </div>

                    {group.bills && group.bills.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                            {group.bills.map((bill) => {
                                if (!bill.userSplit) return null; 
                                return (
                                    <div key={bill.id} className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">{bill.description}</h4>
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">By:</span> {bill.owner?.name || 'Unknown'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">Total:</span> ${bill?.amount || 'Unknown'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="font-medium">Date:</span> {new Date(bill.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <div className="text-lg sm:text-2xl font-bold text-green-600">
                                                    Your share: ${bill.userSplit.amount.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Status Badge */}
                                        <div className="mb-3">
                                            <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                                                bill.userSplit.isPaid 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {bill.userSplit.isPaid ? '✓ Paid' : '⏳ Pending Payment'}
                                            </span>
                                        </div>

                                        {/* Stripe Payment Form for user share */}
                                        <Elements stripe={stripePromise}>
                                            <BillPaymentForm
                                                amount={bill.userSplit.amount}
                                                billId={bill.id}
                                                isPaid={bill.userSplit.isPaid}
                                                onPaymentSuccess={fetchGroup}
                                            />
                                        </Elements>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 sm:py-12">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Receipt size={20} className="sm:w-6 sm:h-6 text-gray-400" />
                            </div>
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No bills assigned to you</h4>
                            <p className="text-sm sm:text-base text-gray-500 mb-4">You don't owe anything yet.</p>
                        </div>
                    )}
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
                    groupId={group?.id}
                    groupMembers={group?.users || []}
                />
            </div>
        </div>
    );
};

export default GroupPage;
