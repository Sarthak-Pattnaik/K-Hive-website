"use client";

import React from "react";
import Image from "next/image";

export default function GoogleSignInButton({ onSuccess = () => {}, onError = () => {} }) {
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const openPopupAndWait = () => {
    try {
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const popup = window.open(
        `${BACKEND}/api/auth/google`,
        "google_oauth_popup",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error("Popup blocked. Allow popups for this site.");
      }

      // Polling: wait for popup to be closed and then check auth on backend
      const interval = setInterval(async () => {
        if (popup.closed) {
          clearInterval(interval);
          try {
            const res = await fetch(`${BACKEND}/auth/check`, {
              method: "GET",
              credentials: "include", // important to send cookies
              headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (data?.success && data?.authenticated) {
              onSuccess(data.user);
            } else {
              onError(data);
            }
          } catch (err) {
            onError(err);
          }
        }
      }, 500);
    } catch (err) {
      onError(err);
    }
  };

  return (
    <button
      onClick={openPopupAndWait}
      className="flex items-center gap-3 rounded-full border px-4 py-2 hover:shadow-md transition"
      aria-label="Sign in with Google"
    >
      <Image src="/google-logo.png" alt="Google" width={20} height={20} />
      <span className="text-sm font-medium">Sign in with Google</span>
    </button>
  );
}
