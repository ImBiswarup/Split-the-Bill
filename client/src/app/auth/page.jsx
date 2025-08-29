'use client';

import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Eye, EyeOff, Lock, Mail, User, Shield, ArrowRight, CheckCircle, Sparkles, Zap, TrendingUp, Users } from 'lucide-react';

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
    const { data: session } = useSession();

    // Auto-login when Google session is active
    useEffect(() => {
        if (session?.user) {
            setUser(session.user);
            router.push(`/user/${session.user.id || session.user.email}`);
        }
    }, [session]);

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setFullName('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const existingToken = getCookie('token');
        if (existingToken) {
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
            const res = await axios.post('/api/users/login', { email, password });

            if (res.data.error) {
                setError(res.data.error);
                return;
            }

            if (res.status === 200) {
                setCookie('token', res.data.token, { maxAge: 60 * 60 * 24 });
                setCookie('userId', res.data.user.id, { maxAge: 60 * 60 * 24 });
                setUser(res.data.user);
                router.push(`/user/${res.data.user.id}`);
            }
        } catch (err) {
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
                alert('Signup successful! Please log in.');
                setIsLogin(true);
                setEmail('');
                setPassword('');
                setFullName('');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: <Zap className="w-6 h-6 text-yellow-500" />,
            title: "Lightning Fast",
            description: "Split expenses in seconds, not minutes"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-green-500" />,
            title: "Smart Analytics",
            description: "Track spending patterns and trends"
        },
        {
            icon: <Users className="w-6 h-6 text-blue-500" />,
            title: "Group Management",
            description: "Organize expenses by groups and categories"
        },
        {
            icon: <Shield className="w-6 h-6 text-purple-500" />,
            title: "Secure & Private",
            description: "Bank-level security for your financial data"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Side - Features & Branding */}
                <div className="hidden lg:block">
                    <div className="max-w-lg">
                        {/* Brand Header */}
                        <div className="flex items-center space-x-3 mb-12">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-xl">$</span>
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                                    MoneySplit
                                </h1>
                                <p className="text-sm text-slate-600 font-medium">Pro Edition</p>
                            </div>
                        </div>

                        {/* Main Headline */}
                        <h2 className="text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            Split Expenses
                            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Like a Pro
                            </span>
                        </h2>

                        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                            The ultimate expense management platform for groups, families, and roommates. 
                            Stop arguing over bills and start living in financial harmony.
                        </p>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            {features.map((feature, index) => (
                                <div key={index} className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {feature.icon}
                                        <h3 className="font-semibold text-slate-800 text-sm">{feature.title}</h3>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Social Proof */}
                        <div className="p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">{String.fromCharCode(64 + i)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-semibold text-slate-900">15,000+ users</p>
                                        <p className="text-sm text-slate-600">trust MoneySplit daily</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-2 text-sm font-medium text-slate-700">4.9/5 rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white/80 text-black backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                {isLogin ? 
                                    <Lock size={32} className="text-white" /> : 
                                    <User size={32} className="text-white" />
                                }
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-3">
                                {isLogin ? 'Welcome Back!' : 'Join MoneySplit'}
                            </h3>
                            <p className="text-slate-600">
                                {isLogin ? 'Sign in to continue managing your expenses' : 'Create your account and start splitting bills'}
                            </p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Auth Form */}
                        <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-slate-700">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-slate-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
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
                        <div className="my-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/80 text-slate-500 font-medium">or continue with</span>
                                </div>
                            </div>
                        </div>

                        {/* Google OAuth Button */}
                        <button
                            className="w-full flex items-center justify-center gap-4 border-2 border-slate-200 py-4 rounded-2xl hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-semibold transition-all duration-300 group hover:shadow-md"
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>

                        {/* Toggle Mode */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-600">
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
                            <p className="text-xs text-slate-500">
                                By continuing, you agree to our{' '}
                                <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
