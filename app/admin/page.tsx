"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

function getDateKeySA() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "00";
  const d = parts.find((p) => p.type === "day")?.value ?? "00";
  return `${y}-${m}-${d}`;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 19a8 8 0 110-16 8 8 0 010 16z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StudentRow = {
  uid: string;
  email: string;
};

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [selectedUid, setSelectedUid] = useState<string>("");

  const [filter, setFilter] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const today = useMemo(() => getDateKeySA(), []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setChecking(false);

      if (!u) {
        setIsAdmin(false);
        return;
      }

      const me = await getDoc(doc(db, "users", u.uid));
      const role = me.exists() ? (me.data() as any).role : null;
      setIsAdmin(role === "admin");
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadStudents() {
      if (!isAdmin) return;

      setErr(null);
      setLoadingStudents(true);
      try {
        // Students should have role: "student"
        const q = query(
          collection(db, "users"),
          where("role", "==", "student"),
          orderBy("email"),
          limit(500)
        );
        const snap = await getDocs(q);

        const list: StudentRow[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return { uid: d.id, email: (data.email || "").toLowerCase() };
        });

        setStudents(list);
        // auto select first
        if (!selectedUid && list.length > 0) setSelectedUid(list[0].uid);
      } catch (e: any) {
        setErr(
          e?.message ??
            "Failed to load students. Make sure Firestore rules allow admin to read users."
        );
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.email.includes(q));
  }, [students, filter]);

  const selectedEmail = useMemo(() => {
    const s = students.find((x) => x.uid === selectedUid);
    return s?.email ?? "";
  }, [students, selectedUid]);

  if (checking) {
    return (
      <main className="min-h-screen p-10">
        <div className="rounded-2xl border p-6">Loading…</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen p-10">
        <div className="rounded-2xl border p-6">
          <div className="text-xl font-semibold">Admin</div>
          <p className="mt-2 text-gray-600">Please sign in.</p>
          <div className="mt-4">
            <Link className="underline" href="/login">
              Go to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen p-10">
        <div className="rounded-2xl border p-6">
          <div className="text-xl font-semibold">Not allowed</div>
          <p className="mt-2 text-gray-600">
            Your account is not an admin. Set <code>role: "admin"</code> in Firestore for your user
            doc.
          </p>
          <div className="mt-4 flex gap-3">
            <Link className="underline" href="/">
              Home
            </Link>
            <Link className="underline" href="/my-progress">
              My Progress
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-gray-900">
      {/* background (match your site) */}
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
        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-[64px] w-[64px] rounded-3xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm grid place-items-center">
              <Image src="/logo.png" alt="Al Qadr" width={46} height={46} className="rounded" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Admin Dashboard</div>
              <div className="text-lg font-semibold">Al Qadr</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/overview"
              className="hidden sm:inline-flex items-center justify-center h-11 px-5 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm font-semibold"
            >
              My Overview
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-black text-white hover:bg-gray-900 transition-colors text-sm font-semibold shadow-sm"
            >
              Home
            </Link>
          </div>
        </div>

        {/* header card */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-8 shadow-lg overflow-hidden relative">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#9c7c38]/16 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-[#9c7c38]" />
              <span className="text-gray-700">Today: {today}</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight">
              Select a student and log their work
            </h1>
            <p className="mt-3 text-gray-700 leading-relaxed max-w-2xl">
              No passwords needed. Just select a student and enter today’s Sabak / Dhor.
            </p>

            <div className="mt-7 grid lg:grid-cols-12 gap-6 items-stretch">
              {/* left: filter + select */}
              <div className="lg:col-span-7 rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <span className="grid place-items-center h-10 w-10 rounded-2xl bg-black text-white">
                    <SearchIcon />
                  </span>
                  Student selector
                </div>

                <div className="mt-5 grid gap-3">
                  <label className="text-sm font-medium text-gray-800">Quick filter</label>
                  <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Type part of the email…"
                    className="h-12 rounded-2xl border border-gray-200 bg-white/80 px-4 outline-none focus:ring-2 focus:ring-[#9c7c38]/30"
                  />

                  <label className="mt-2 text-sm font-medium text-gray-800">
                    Choose student ({filtered.length})
                  </label>

                  <div className="relative">
                    <select
                      value={selectedUid}
                      onChange={(e) => setSelectedUid(e.target.value)}
                      className="appearance-none w-full h-12 rounded-2xl border border-gray-200 bg-white/80 px-4 pr-10 outline-none focus:ring-2 focus:ring-[#9c7c38]/30"
                      disabled={loadingStudents}
                    >
                      {filtered.length === 0 ? (
                        <option value="">No students found</option>
                      ) : (
                        filtered.map((s) => (
                          <option key={s.uid} value={s.uid}>
                            {s.email || s.uid}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <ArrowIcon />
                    </div>
                  </div>

                  {err && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {err}
                    </div>
                  )}
                </div>
              </div>

              {/* right: action */}
              <div className="lg:col-span-5 rounded-3xl border border-gray-200 bg-black text-white p-6 shadow-xl relative overflow-hidden">
                <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#9c7c38]/25 blur-2xl" />

                <div className="relative">
                  <div className="text-sm text-white/70">Selected student</div>
                  <div className="mt-1 text-xl font-semibold break-words">
                    {selectedEmail || "—"}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {["Sabak", "Sabak Dhor", "Dhor", "Weekly Goal"].map((t) => (
                      <div key={t} className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3">
                        <div className="text-sm text-white/80">{t}</div>
                        <div className="mt-1 text-sm font-semibold">Log today</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link
                      href={selectedUid ? `/admin/student/${selectedUid}` : "/admin"}
                      className={`inline-flex items-center justify-center h-12 px-6 rounded-2xl font-semibold transition-colors w-full ${
                        selectedUid
                          ? "bg-white text-black hover:bg-white/90"
                          : "bg-white/20 text-white/60 cursor-not-allowed"
                      }`}
                      aria-disabled={!selectedUid}
                    >
                      Open student dashboard →
                    </Link>

                    <div className="mt-3 text-xs text-white/60">
                      Tip: students must have a saved user doc (your signup code already does this).
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loadingStudents && (
              <div className="mt-6 text-sm text-gray-600">Loading students…</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
