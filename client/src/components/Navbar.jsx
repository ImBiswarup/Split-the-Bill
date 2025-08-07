'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppContext();
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Groups', href: '/groups' },
    { name: 'Expenses', href: '/expenses' },
    { name: user ? 'Profile' : 'Login', href: user ? `/user/${user.id}` : '/auth' },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-blue-600">
            <Link href="/">Money Manager</Link>
          </div>

          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-500 transition font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} color='black' /> : <Menu size={24} color='black' />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-4 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-blue-500 transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
