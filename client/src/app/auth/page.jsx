'use client';

import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { setCookie, getCookie } from 'cookies-next/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { setUser } = useAppContext();
    const router = useRouter();

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setFullName('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (getCookie('token')) {
            console.log('User already logged in, redirecting to user page...');
            router.push(`/user/${getCookie('userId')}`);
            return;
        }

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/users/login', {
                email,
                password
            });
            
            if (res.data.error) {
                setError(res.data.error);
                return;
            }
            
            if (res.status === 200) {
                console.log('Login successful!');
                console.log('User data:', res.data);
                setCookie('token', res.data.token);
                console.log('Token:', getCookie('token'));
                setUser(res.data.user);
                router.push(`/user/${res.data.user.id}`);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!email || !password || !fullName) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/users/signup', {
                email,
                password,
                name: fullName
            });
            
            if (res.data.error) {
                setError(res.data.error);
                return;
            }
            
            if (res.status === 201) {
                setError('');
                alert('Signup successful! Please login.');
                setIsLogin(true);
                setEmail('');
                setPassword('');
                setFullName('');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        "Split expenses with friends and family",
        "Track shared bills and payments",
        "Generate detailed expense reports",
        "Secure and private data handling"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Features */}
                <div className="hidden lg:block">
                    <div className="max-w-md">
                        <div className="flex items-center space-x-2 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">$</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                MoneySplit
                            </span>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            The Smartest Way to
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Split Expenses
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Stop arguing over who owes what. Track group expenses, settle up instantly, 
                            and maintain perfect financial harmony.
                        </p>
                        
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                                    <span className="text-gray-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                            <div className="flex items-center space-x-3 mb-3">
                                <Shield size={20} className="text-blue-600" />
                                <span className="font-semibold text-gray-900">Trusted by 10,000+ users</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Your financial data is encrypted and secure. We never share your information with third parties.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full max-w-md mx-auto text-black">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                {isLogin ? <Lock size={28} className="text-white" /> : <User size={28} className="text-white" />}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-gray-600">
                                {isLogin ? 'Sign in to your account to continue' : 'Join thousands of users managing shared expenses'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                                    </>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">or</span>
                                </div>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 py-3 rounded-xl hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-medium transition-all duration-200 group"
                            onClick={() => alert('Google login not implemented yet')}
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>

                        {/* Toggle Mode */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button 
                                    onClick={toggleMode} 
                                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>

                        {/* Terms */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                By continuing, you agree to our{' '}
                                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
