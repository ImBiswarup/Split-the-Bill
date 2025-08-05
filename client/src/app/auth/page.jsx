'use client';

import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const {user, setUser} = useAppContext();

    const router = useRouter();

    const toggleMode = () => setIsLogin(!isLogin);

    const handleLogin = async (e) => {
        e.preventDefault(); 
        const res = await axios.post('/api/users/login', {
            email,
            password
        });
        setUser(res.data?.user);
        localStorage.setItem('user', JSON.stringify(res.data?.user));
        if (res.data.error) {
            alert(res.data.error);
        }
        if (res.status === 200) {
            alert('Login successful!');
            router.push(`/user/${res.data.user.id}`);
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const res = await axios.post('/api/users/signup', {
            email,
            password,
            fullName
        });
        if (res.data.error) {
            alert(res.data.error);
        }
        if (res.status === 201) {
            alert('Signup successful! Please login.');
            setIsLogin(true);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    {isLogin ? 'Login to Your Account' : 'Create a New Account'}
                </h2>

                <form className="space-y-4 text-black">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        onClick={isLogin ? handleLogin : handleSignup}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="flex items-center justify-center space-x-2">
                    <span className="text-gray-400 text-sm">or</span>
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 text-black transition"
                    onClick={() => alert('Google login not implemented yet')}
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Continue with Google
                </button>

                <p className="text-sm text-center text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={toggleMode} className="text-blue-600 hover:underline font-medium">
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
