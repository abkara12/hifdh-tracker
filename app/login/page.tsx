"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/my-progress");
    } catch (error: any) {
      setErr(error?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-gray-900">
      {/* background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#efe8da] via-[#f7f4ee] to-white" />
        <div className="absolute -top-56 left-[-10%] h-[780px] w-[780px] rounded-full bg-[#9c7c38]/30 blur-3xl" />
        <div className="absolute top-[-20%] right-[-15%] h-[900px] w-[900px] rounded-full bg-black/20 blur-3xl" />
        <div className="absolute -bottom-72 left-[20%] h-[980px] w-[980px] rounded-full bg-[#9c7c38]/22 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(-45deg, rgba(0,0,0,0.18) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            backgroundPosition: "0 0, 36px 36px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_15%,transparent_55%,rgba(0,0,0,0.12))]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10">
        {/* top */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-[80px] w-[85px] rounded-xl bg-white/100 backdrop-blur border border-gray-200 shadow-sm grid place-items-center">
                          <Image  src="/logo.png"
                          alt="Al Qadr"
                          width={58}
                          height={58}
                          className="rounded" />
                        </div>
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            New student? <span className="text-[#9c7c38]">Create account</span>
          </Link>
        </div>

        <div className="mt-10 grid lg:grid-cols-12 gap-8 items-stretch">
          {/* left */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-black text-white p-9 shadow-xl relative overflow-hidden">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#9c7c38]/25 blur-2xl" />
              <p className="uppercase tracking-widest text-xs text-white/70">
                Welcome back
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                Continue your Hifz journey
              </h1>
              <p className="mt-4 text-white/70 leading-relaxed">
                Log in to update your daily progress and stay consistent with your weekly target.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {["Sabak", "Sabak Dhor", "Dhor", "Weekly Goal"].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl bg-white/10 border border-white/10 px-4 py-4"
                  >
                    <div className="text-sm text-white/80">{t}</div>
                    <div className="mt-1 text-sm font-semibold">Track & improve</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* right form */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-8 shadow-lg">
              <h2 className="text-2xl font-semibold tracking-tight">Sign In</h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter your email and password to continue.
              </p>

              {err && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-800">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    placeholder="student@email.com"
                    className="mt-2 w-full h-12 rounded-2xl border border-gray-200 bg-white/80 px-4 outline-none focus:ring-2 focus:ring-[#9c7c38]/40"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-800">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    placeholder="Your password"
                    className="mt-2 w-full h-12 rounded-2xl border border-gray-200 bg-white/80 px-4 outline-none focus:ring-2 focus:ring-[#9c7c38]/40"
                  />
                </div>

                <button
                  disabled={loading}
                  className="mt-2 h-12 rounded-2xl bg-black text-white font-semibold hover:bg-gray-900 transition-colors shadow-sm disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-700">
                Don’t have an account?{" "}
                <Link href="/signup" className="font-semibold text-[#9c7c38] hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-gray-200 bg-white/60 backdrop-blur p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Need to enrol?</div>
              <p className="mt-1 text-sm text-gray-700">
                Visit <Link className="text-[#9c7c38] font-semibold hover:underline" href="/contact">Contact</Link> for the Ustadh details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

