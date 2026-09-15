"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Unable to sign in");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <p className="text-sm font-big-shoulders uppercase tracking-[0.2em] text-gray-400 mb-3">
          Backend
        </p>
        <h1 className="text-5xl font-bold font-big-shoulders uppercase tracking-tight text-gray-900 mb-8">
          Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-xs font-big-shoulders uppercase tracking-wider text-gray-500 mb-2">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoFocus
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-900"
              placeholder="Enter admin password"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting || !password}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-big-shoulders uppercase tracking-tight font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {process.env.NODE_ENV !== "production" ? (
          <p className="mt-6 text-sm text-gray-400 font-big-shoulders">
            Local default password is <span className="text-gray-700">admin</span> unless{" "}
            <span className="text-gray-700">ADMIN_PASSWORD</span> is set.
          </p>
        ) : null}
      </div>
    </main>
  );
}
