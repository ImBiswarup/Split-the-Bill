'use client';

import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowRight, CheckCircle, Users, CreditCard, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Home() {
  const { isLoggedIn, user, getUserFromToken } = useAppContext();
  
  useEffect(() => {
    getUserFromToken();
  }, []);

  const features = [
    {
      icon: CreditCard,
      title: "Smart Expense Tracking",
      description: "Automatically categorize and track all your shared expenses with intelligent suggestions."
    },
    {
      icon: Users,
      title: "Group Management",
      description: "Create and manage groups for trips, roommates, or any shared expenses."
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Get insights into spending patterns and settle debts efficiently."
    }
  ];

  const benefits = [
    "No more awkward money conversations",
    "Instant debt calculations",
    "Secure and private",
    "Works offline and syncs automatically",
    "Free forever with no hidden fees",
    "24/7 customer support"
  ];

  const steps = [
    {
      number: "01",
      title: "Create an Account",
      description: "Sign up in seconds with email or Google. No credit card required.",
      icon: Shield
    },
    {
      number: "02",
      title: "Add Your Groups",
      description: "Create groups for trips, roommates, or any shared expenses.",
      icon: Users
    },
    {
      number: "03",
      title: "Track & Split",
      description: "Add expenses and let our smart algorithm handle the rest.",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Trusted by 10,000+ users worldwide
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Split Expenses
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Stop arguing over who owes what. Track group expenses, settle up instantly, 
              and maintain perfect financial harmony with friends, family, and roommates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isLoggedIn && (
                <Link
                  href="/auth"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center"
                >
                  Get Started Free
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              )}
              
              <Link
                href="#features"
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 inline-flex items-center"
              >
                See How It Works
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Shared Expenses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make expense splitting effortless and transparent
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes expense management effortless
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative text-center group">
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={32} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Choose MoneySplit?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join thousands of users who have simplified their shared expenses and 
                eliminated financial stress from their relationships.
              </p>
              
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">$0</div>
                  <div className="text-xl mb-4">Monthly Fee</div>
                  <p className="text-blue-100 mb-6">
                    Start managing your expenses today with our completely free platform
                  </p>
                  {!isLoggedIn && (
                    <Link
                      href="/auth"
                      className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                    >
                      Start Free Today
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Simplify Your Shared Expenses?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed how they handle group finances
          </p>
          
          {!isLoggedIn ? (
            <Link
              href="/auth"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight size={20} className="ml-2" />
            </Link>
          ) : (
            <Link
              href="/expenses"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Go to Dashboard
              <ArrowRight size={20} className="ml-2" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <span className="text-xl font-bold">MoneySplit</span>
              </div>
              <p className="text-gray-400">
                The smartest way to split expenses with friends, family, and roommates.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MoneySplit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
