"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

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

function toText(v: unknown) {
  if (v === null || v === undefined) return "";
  return typeof v === "string" ? v : String(v);
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M12 2l1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.8 2.8L22 17l-2.2.2L19 20l-.8-2.8L16 17l2.2-.2L19 13z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminStudentPage() {
  const params = useParams<{ uid: string }>();
  const studentUid = params.uid;

  const router = useRouter();

  const [me, setMe] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [studentEmail, setStudentEmail] = useState<string>("");

  const [sabak, setSabak] = useState("");
  const [sabakDhor, setSabakDhor] = useState("");
  const [dhor, setDhor] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [sabakDhorMistakes, setSabakDhorMistakes] = useState("");
  const [dhorMistakes, setDhorMistakes] = useState("");

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const dateKey = useMemo(() => getDateKeySA(), []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setMe(u);
      setChecking(false);

      if (!u) {
        setIsAdmin(false);
        return;
      }

      const myDoc = await getDoc(doc(db, "users", u.uid));
      const role = myDoc.exists() ? (myDoc.data() as any).role : null;
      setIsAdmin(role === "admin");
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadStudent() {
      // student profile
      const sDoc = await getDoc(doc(db, "users", studentUid));
      if (sDoc.exists()) {
        const data = sDoc.data() as any;
        setStudentEmail(toText(data.email));
        setWeeklyGoal(toText(data.weeklyGoal));
        setSabak(toText(data.currentSabak));
        setSabakDhor(toText(data.currentSabakDhor));
        setDhor(toText(data.currentDhor));
        setSabakDhorMistakes(toText(data.currentSabakDhorMistakes));
        setDhorMistakes(toText(data.currentDhorMistakes));
      }

      // today's log (override if exists)
      const todayDoc = await getDoc(doc(db, "users", studentUid, "logs", dateKey));
      if (todayDoc.exists()) {
        const d = todayDoc.data() as any;
        setSabak(toText(d.sabak));
        setSabakDhor(toText(d.sabakDhor));
        setDhor(toText(d.dhor));
        setWeeklyGoal(toText(d.weeklyGoal));
        setSabakDhorMistakes(toText(d.sabakDhorMistakes));
        setDhorMistakes(toText(d.dhorMistakes));
      }
    }

    if (studentUid) loadStudent();
  }, [studentUid, dateKey]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    setMsg(null);

    try {
      // 1) daily log
      await setDoc(
        doc(db, "users", studentUid, "logs", dateKey),
        {
          dateKey,
          createdAt: serverTimestamp(),
          sabak,
          sabakDhor,
          dhor,
          weeklyGoal,
          sabakDhorMistakes,
          dhorMistakes,
          updatedBy: me?.uid ?? null,
          updatedByEmail: me?.email ?? null,
        },
        { merge: true }
      );

      // 2) snapshot
      await setDoc(
        doc(db, "users", studentUid),
        {
          weeklyGoal,
          currentSabak: sabak,
          currentSabakDhor: sabakDhor,
          currentDhor: dhor,
          currentSabakDhorMistakes: sabakDhorMistakes,
          currentDhorMistakes: dhorMistakes,
          updatedAt: serverTimestamp(),
          lastUpdatedBy: me?.uid ?? null,
        },
        { merge: true }
      );

      setMsg("Saved ✅");
      setTimeout(() => setMsg(null), 2500);
    } catch (err: any) {
      setMsg(err?.message ? `Error: ${err.message}` : "Error saving.");
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <main className="min-h-screen p-10">
        <div className="rounded-2xl border p-6">Loading…</div>
      </main>
    );
  }

  if (!me) {
    return (
      <main className="min-h-screen p-10">
        <div className="rounded-2xl border p-6">
          <div className="text-xl font-semibold">Please sign in</div>
          <div className="mt-3">
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
          <p className="mt-2 text-gray-600">You are not an admin.</p>
          <div className="mt-4 flex gap-3">
            <Link className="underline" href="/">
              Home
            </Link>
            <Link className="underline" href="/admin">
              Admin
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
        {/* top */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin" className="inline-flex items-center gap-3">
            <div className="h-[64px] w-[64px] rounded-3xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm grid place-items-center">
              <Image src="/logo.png" alt="Al Qadr" width={46} height={46} className="rounded" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Admin → Student</div>
              <div className="text-lg font-semibold">Log student work</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm font-semibold"
            >
              Back
            </Link>
            <button
              onClick={() => router.push(`/overview`)}
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-black text-white hover:bg-gray-900 transition-colors text-sm font-semibold shadow-sm"
            >
              My Overview
            </button>
          </div>
        </div>

        {/* header card */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-8 shadow-lg relative overflow-hidden">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#9c7c38]/16 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-[#9c7c38]" />
                  <span className="text-gray-700">Submitting for {dateKey}</span>
                </div>

                <h1 className="mt-5 text-4xl font-semibold tracking-tight break-words">
                  {studentEmail || "Student"}
                </h1>
                <p className="mt-2 text-gray-700">
                  Fill in today’s work and press <span className="font-semibold">Save</span>.
                </p>
              </div>

              <div className="rounded-3xl bg-black text-white p-5 shadow-xl relative overflow-hidden w-full md:w-[360px]">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#9c7c38]/25 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">
                      <SparkIcon />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-white/70">Status</div>
                      <div className="text-sm font-semibold">{msg ?? "Ready to save"}</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <Badge label="Sabak" />
                    <Badge label="Dhor" />
                    <Badge label="Weekly" />
                  </div>
                </div>
              </div>
            </div>

            {/* form grid */}
            <form onSubmit={handleSave} className="mt-8 grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Today’s work</div>
                <div className="mt-5 grid gap-4">
                  <Field label="Sabak" value={sabak} setValue={setSabak} hint="Example: 2 pages / 1 ruku / 5 lines" />
                  <Field label="Sabak Dhor" value={sabakDhor} setValue={setSabakDhor} hint="Revision for current sabak" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Sabak Dhor Mistakes" value={sabakDhorMistakes} setValue={setSabakDhorMistakes} hint="Number" />
                    <Field label="Dhor Mistakes" value={dhorMistakes} setValue={setDhorMistakes} hint="Number" />
                  </div>

                  <Field label="Dhor" value={dhor} setValue={setDhor} hint="Older revision" />
                </div>
              </div>

              <div className="lg:col-span-5 rounded-3xl border border-gray-200 bg-white/70 p-6 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">Targets</div>
                <div className="mt-5 grid gap-4">
                  <Field label="Weekly Sabak Goal" value={weeklyGoal} setValue={setWeeklyGoal} hint="Example: 10 pages" />

                  <button
                    disabled={saving}
                    className="h-12 rounded-2xl bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-60 transition-colors shadow-sm"
                  >
                    {saving ? "Saving..." : "Save for student"}
                  </button>

                  <div className="text-xs text-gray-600">
                    This updates both the daily log and the student snapshot.
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-8 rounded-3xl border border-gray-200 bg-white/60 p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Tip</div>
              <p className="mt-2 text-sm text-gray-700">
                Add this Admin page to your phone home screen so it feels like an app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-2 text-center">
      {label}
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  setValue,
}: {
  label: string;
  hint: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-end justify-between gap-4">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        <span className="text-xs text-gray-500">{hint}</span>
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-12 rounded-2xl border border-gray-200 bg-white/80 px-4 outline-none focus:ring-2 focus:ring-[#9c7c38]/30"
        placeholder="Type here…"
      />
    </label>
  );
}
