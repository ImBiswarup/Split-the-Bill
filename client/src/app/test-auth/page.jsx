'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4">Welcome, {session.user?.name || session.user?.email}</h1>
        <p className="mb-4">You are already signed in.</p>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Login to MoneySplit</h1>
      <p className="mb-4">Sign in with your Google account to continue</p>
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  )
}
