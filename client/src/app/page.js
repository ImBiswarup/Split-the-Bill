'use client';

import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { isLoggedIn } = useAppContext();
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-24 sm:py-24 bg-gradient-to-br from-blue-100 to-blue-300">
        <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
          Manage Expenses Effortlessly
        </h1>
        <p className="text-base sm:text-lg max-w-md sm:max-w-2xl mb-8">
          Track group expenses, settle up instantly, and stop arguing over who owes what.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/auth"
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-base font-medium text-center transition ${isLoggedIn ? 'hidden' : ''}`}
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="border border-blue-600 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-full text-base font-medium text-center transition"
          >
            Learn More
          </a>
        </div>
      </section>

      <section id="features" className="py-16 px-4 sm:px-6 bg-white">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">Why Use Our App?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition text-center">
            <Image src="/icons/bill.svg" alt="Bill" width={40} height={40} className="mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Split Bills Instantly</h3>
            <p className="text-sm text-gray-600">Add expenses and divide them fairly among friends, family, or roommates.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition text-center">
            <Image src="/icons/history.svg" alt="History" width={40} height={40} className="mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Track History</h3>
            <p className="text-sm text-gray-600">See past splits, who paid what, and settle debts transparently.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition text-center">
            <Image src="/icons/people.svg" alt="Group" width={40} height={40} className="mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Perfect for Groups</h3>
            <p className="text-sm text-gray-600">Use it for trips, shared homes, or group outings. Keep things simple and clear.</p>
          </div>
        </div>
      </section>
      <section className="bg-blue-50 py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-10">How It Works</h2>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-blue-600 text-4xl font-bold mb-2">1</div>
            <h4 className="text-lg font-semibold mb-2">Create an Account</h4>
            <p className="text-sm text-gray-600">Sign up with email or Google and get started in seconds.</p>
          </div>
          <div>
            <div className="text-blue-600 text-4xl font-bold mb-2">2</div>
            <h4 className="text-lg font-semibold mb-2">Add Expenses</h4>
            <p className="text-sm text-gray-600">Input who paid, how much, and who shares the cost.</p>
          </div>
          <div>
            <div className="text-blue-600 text-4xl font-bold mb-2">3</div>
            <h4 className="text-lg font-semibold mb-2">Settle Up</h4>
            <p className="text-sm text-gray-600">Everyone sees who owes what. No confusion, just fairness.</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-100 py-10 text-center text-xs text-gray-500 px-4">
        <p>&copy; {new Date().getFullYear()} MoneySplit | Made with 💸</p>
        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
            GitHub
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
