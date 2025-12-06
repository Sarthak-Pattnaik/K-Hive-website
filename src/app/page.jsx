"use client";

import { useState } from "react";
import GoogleSignInButton from "../components/GoogleButton";

export default function Home() {
  const [result, setResult] = useState(null);

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleSuccess = (user) => {
    console.log("Logged in user:", user);
  };

  const handleError = (err) => {
    console.error("Google login error:", err);
  };

  const testCheckAuth = async () => {
    const res = await fetch(`${BACKEND}/api/auth/check`, {
      method: "GET",
      credentials: "include", // IMPORTANT
    });
    const data = await res.json();
    setResult(data);
  };

  const testCurrentUser = async () => {
    const res = await fetch(`${BACKEND}/api/auth/user`, {
      method: "GET",
      credentials: "include", // IMPORTANT
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

        <GoogleSignInButton onSuccess={handleSuccess} onError={handleError} />

        {/* TEST BUTTONS */}
        <div className="flex flex-col gap-4 mt-10">
          <button
            onClick={testCheckAuth}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Test /auth/check
          </button>

          <button
            onClick={testCurrentUser}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            Test /auth/current-user
          </button>
        </div>

        {/* SHOW API RESULT */}
        {result && (
          <pre className="mt-6 p-4 bg-gray-100 rounded text-sm max-w-xl overflow-x-auto text-black">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

      </main>
    </div>
  );
}
