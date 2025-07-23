import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="border rounded px-4 py-2" required />
          <input type="password" placeholder="Password" className="border rounded px-4 py-2" required />
          <button type="submit" className="bg-primary text-primary-foreground rounded px-4 py-2 font-semibold hover:bg-primary/80 transition">Sign In</button>
        </form>
      </div>
    </div>
  );
} 