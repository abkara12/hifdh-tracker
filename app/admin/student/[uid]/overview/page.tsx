"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

function toText(v: unknown) {
  if (v === null || v === undefined) return "";
  return typeof v === "string" ? v : String(v);
}

type LogRow = {
  id: string;
  dateKey: string;
  sabak: string;
  sabakDhor: string;
  dhor: string;
  weeklyGoal: string;
  sabakDhorMistakes: string;
  dhorMistakes: string;

  weeklyGoalWeekKey?: string;
  weeklyGoalStartDateKey?: string;
  weeklyGoalCompletedDateKey?: string;
  weeklyGoalDurationDays?: string;
  weeklyGoalCompleted?: boolean;
};

function Shell({
  title,
  subtitle,
  rightSlot,
  children,
}: {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen text-gray-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#efe8da] via-[#f7f4ee] to-white" />
        <div className="absolute -top-56 left-[-10%] h-[780px] w-[780px] rounded-full bg-[#9c7c38]/25 blur-3xl" />
        <div className="absolute top-[-20%] right-[-15%] h-[900px] w-[900px] rounded-full bg-black/15 blur-3xl" />
        <div className="absolute -bottom-72 left-[20%] h-[980px] w-[980px] rounded-full bg-[#9c7c38]/18 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(-45deg, rgba(0,0,0,0.18) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            backgroundPosition: "0 0, 36px 36px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_12%,transparent_55%,rgba(0,0,0,0.10))]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-10 py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="uppercase tracking-widest text-xs text-[#9c7c38]">
              Admin → Student Overview
            </p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-tight break-words">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-gray-700 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            ) : null}
          </div>

          {rightSlot ? <div className="w-full sm:w-auto">{rightSlot}</div> : null}
        </div>

        <div className="mt-7 sm:mt-8">{children}</div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#9c7c38]/12 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="text-xs uppercase tracking-widest text-[#9c7c38]">{label}</div>
      <div className="mt-2 text-lg sm:text-2xl font-semibold text-gray-900 break-words">
        {value || "—"}
      </div>
      {sub ? <div className="mt-2 text-sm text-gray-600">{sub}</div> : null}
    </div>
  );
}

export default function AdminStudentOverviewPage() {
  const params = useParams<{ uid: string }>();
  const studentUid = params.uid;

  const [me, setMe] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [studentEmail, setStudentEmail] = useState("");

  const [snapshot, setSnapshot] = useState({
    weeklyGoal: "",
    weeklyGoalWeekKey: "",
    weeklyGoalStartDateKey: "",
    weeklyGoalCompletedDateKey: "",
    weeklyGoalDurationDays: "",

    currentSabak: "",
    currentSabakDhor: "",
    currentDhor: "",
    currentSabakDhorMistakes: "",
    currentDhorMistakes: "",
  });

  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setMe(u);

      if (!u) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      try {
        const myDoc = await getDoc(doc(db, "users", u.uid));
        const role = myDoc.exists() ? (myDoc.data() as any).role : null;
        setIsAdmin(role === "admin");
      } finally {
        setChecking(false);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    async function loadStudent() {
      const sDoc = await getDoc(doc(db, "users", studentUid));
      if (sDoc.exists()) {
        const data = sDoc.data() as any;

        setStudentEmail(toText(data.email));

        setSnapshot({
          weeklyGoal: toText(data.weeklyGoal),
          weeklyGoalWeekKey: toText(data.weeklyGoalWeekKey),
          weeklyGoalStartDateKey: toText(data.weeklyGoalStartDateKey),
          weeklyGoalCompletedDateKey: toText(data.weeklyGoalCompletedDateKey),
          weeklyGoalDurationDays:
            data.weeklyGoalDurationDays !== undefined && data.weeklyGoalDurationDays !== null
              ? String(data.weeklyGoalDurationDays)
              : "",

          currentSabak: toText(data.currentSabak),
          currentSabakDhor: toText(data.currentSabakDhor),
          currentDhor: toText(data.currentDhor),
          currentSabakDhorMistakes: toText(data.currentSabakDhorMistakes),
          currentDhorMistakes: toText(data.currentDhorMistakes),
        });
      }
    }

    async function loadAllLogs() {
      setLoadingLogs(true);
      try {
        const qy = query(
          collection(db, "users", studentUid, "logs"),
          orderBy("dateKey", "desc")
        );
        const snap = await getDocs(qy);

        const rows: LogRow[] = snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            id: d.id,
            dateKey: toText(x.dateKey || d.id),
            sabak: toText(x.sabak),
            sabakDhor: toText(x.sabakDhor),
            dhor: toText(x.dhor),
            weeklyGoal: toText(x.weeklyGoal),
            sabakDhorMistakes: toText(x.sabakDhorMistakes),
            dhorMistakes: toText(x.dhorMistakes),

            weeklyGoalWeekKey: toText(x.weeklyGoalWeekKey),
            weeklyGoalStartDateKey: toText(x.weeklyGoalStartDateKey),
            weeklyGoalCompletedDateKey: toText(x.weeklyGoalCompletedDateKey),
            weeklyGoalDurationDays:
              x.weeklyGoalDurationDays !== undefined && x.weeklyGoalDurationDays !== null
                ? String(x.weeklyGoalDurationDays)
                : "",
            weeklyGoalCompleted: x.weeklyGoalCompleted === true,
          };
        });

        setLogs(rows);
      } finally {
        setLoadingLogs(false);
      }
    }

    if (studentUid) {
      loadStudent();
      loadAllLogs();
    }
  }, [studentUid]);

  if (checking) {
    return (
      <Shell title="Loading…" subtitle="Opening student overview…">
        <div className="rounded-3xl border border-gray-200 bg-white/60 backdrop-blur p-6 shadow-sm">
          <div className="h-6 w-2/3 bg-black/10 rounded-2xl animate-pulse" />
          <div className="mt-4 h-12 bg-black/10 rounded-2xl animate-pulse" />
        </div>
      </Shell>
    );
  }

  if (!me) {
    return (
      <Shell title="Please sign in" subtitle="You must sign in to view this page.">
        <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
          <Link className="underline" href="/login">
            Go to login
          </Link>
        </div>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell title="Access denied" subtitle="This account is not marked as admin.">
        <div className="rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 shadow-sm">
          <div className="text-sm text-gray-600">Signed in as</div>
          <div className="mt-1 font-semibold">{me.email}</div>
        </div>
      </Shell>
    );
  }

  const goalStatus = snapshot.weeklyGoalCompletedDateKey
    ? `Completed in ${snapshot.weeklyGoalDurationDays || "—"} day(s)`
    : snapshot.weeklyGoal
    ? "In progress"
    : "No goal set";

  return (
    <Shell
      title={studentEmail ? studentEmail : "Student"}
      subtitle="Full student data (snapshot + weekly goal + full history)"
      rightSlot={
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link
            href="/admin"
            className="inline-flex w-full sm:w-auto items-center justify-center h-11 px-5 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm font-semibold"
          >
            Back
          </Link>
          <Link
            href={`/admin/student/${studentUid}`}
            className="inline-flex w-full sm:w-auto items-center justify-center h-11 px-5 rounded-full bg-black text-white hover:bg-gray-900 transition-colors text-sm font-semibold shadow-sm"
          >
            Log Work
          </Link>
        </div>
      }
    >
      {/* Snapshot cards */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Weekly Goal" value={snapshot.weeklyGoal} sub={snapshot.weeklyGoalWeekKey || ""} />
        <StatCard label="Goal Status" value={goalStatus} sub={`Started: ${snapshot.weeklyGoalStartDateKey || "—"}`} />
        <StatCard label="Goal Completed" value={snapshot.weeklyGoalCompletedDateKey || "—"} sub={`Duration: ${snapshot.weeklyGoalDurationDays ? `${snapshot.weeklyGoalDurationDays} day(s)` : "—"}`} />

        <StatCard label="Current Sabak" value={snapshot.currentSabak} />
        <StatCard label="Current Sabak Dhor" value={snapshot.currentSabakDhor} />
        <StatCard label="Current Dhor" value={snapshot.currentDhor} />
        <StatCard label="Sabak Dhor Mistakes" value={snapshot.currentSabakDhorMistakes} />
        <StatCard label="Dhor Mistakes" value={snapshot.currentDhorMistakes} />
        <StatCard label="Total Logs" value={String(logs.length)} sub="All saved days" />
      </div>

      {/* ALL Logs */}
      <div className="mt-8 rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="text-sm text-gray-600">History</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">
              All logs
            </div>
            <div className="mt-1 text-sm text-gray-700">
              Showing {logs.length} total entries.
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-xs font-semibold text-gray-700 w-fit">
            <span className="h-2 w-2 rounded-full bg-[#9c7c38]" />
            Full history
          </div>
        </div>

        {loadingLogs ? (
          <div className="mt-6 grid gap-3">
            <div className="h-16 bg-black/10 rounded-2xl animate-pulse" />
            <div className="h-16 bg-black/10 rounded-2xl animate-pulse" />
            <div className="h-16 bg-black/10 rounded-2xl animate-pulse" />
          </div>
        ) : logs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white/70 p-5 text-sm text-gray-700">
            No logs yet for this student.
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {logs.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-200 bg-white/70 p-5 hover:bg-white transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="font-semibold text-gray-900">{r.dateKey}</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-600">
                      Mistakes: SD {r.sabakDhorMistakes || "—"} • D {r.dhorMistakes || "—"}
                    </span>

                    {r.weeklyGoalCompleted ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Goal completed ({r.weeklyGoalDurationDays || "—"} day(s))
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                  <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-2">
                    <div className="text-xs text-gray-500">Sabak</div>
                    <div className="font-semibold">{r.sabak || "—"}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-2">
                    <div className="text-xs text-gray-500">Sabak Dhor</div>
                    <div className="font-semibold">{r.sabakDhor || "—"}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-white/70 px-3 py-2">
                    <div className="text-xs text-gray-500">Dhor</div>
                    <div className="font-semibold">{r.dhor || "—"}</div>
                  </div>
                </div>

                {r.weeklyGoal ? (
                  <div className="mt-3 rounded-xl border border-gray-200 bg-white/70 px-3 py-2">
                    <div className="text-xs text-gray-500">Weekly Goal Snapshot</div>
                    <div className="font-semibold">{r.weeklyGoal}</div>
                    <div className="mt-1 text-xs text-gray-600">
                      {r.weeklyGoalWeekKey ? `Week: ${r.weeklyGoalWeekKey}` : ""}
                      {r.weeklyGoalStartDateKey ? ` • Started: ${r.weeklyGoalStartDateKey}` : ""}
                      {r.weeklyGoalCompletedDateKey ? ` • Completed: ${r.weeklyGoalCompletedDateKey}` : ""}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
