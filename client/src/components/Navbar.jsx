'use client';

import React, { useState } from 'react';
import { Menu, X, User, LogOut, Settings, Home, Users, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isLoading } = useAppContext();
  // console.log('user in navbar', user);
  
  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Groups', href: '/groups', icon: Users },
    { name: 'Expenses', href: '/expenses', icon: CreditCard },
  ];

  const userMenuItems = [
    { name: 'Profile', href: user?.id ? `/user/${user.id}` : '#', icon: User, disabled: !user?.id },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Logout', href: '#', icon: LogOut, action: logout },
  ];

  const handleMenuClick = (item) => {
    if (item.action) {
      item.action();
    }
    if (item.disabled) {
      return; // Don't do anything if item is disabled
    }
    setIsOpen(false);
  };

  // Don't render user menu until we know the user state
  if (isLoading) {
    return (
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MoneySplit
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
                  >
                    <Icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Loading State */}
            <div className="hidden md:flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <div className="animate-pulse bg-gray-200 h-6 w-6 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MoneySplit
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.name || 'User'}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      if (item.disabled) {
                        return (
                          <button
                            key={item.name}
                            disabled
                            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-400 cursor-not-allowed"
                          >
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </button>
                        );
                      }
                      
                      if (item.action) {
                        return (
                          <button
                            key={item.name}
                            onClick={() => handleMenuClick(item)}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </button>
                        );
                      }
                      
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block w-full"
                        >
                          <div className="flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                            <Icon size={18} />
                            <span>{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    if (item.disabled) {
                      return (
                        <button
                          key={item.name}
                          disabled
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-400 cursor-not-allowed"
                        >
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </button>
                      );
                    }
                    
                    if (item.action) {
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleMenuClick(item)}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </button>
                      );
                    }
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
