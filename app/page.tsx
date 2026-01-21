"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

/* ✅ ADDED: burger icons */
function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6l-12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 transition-transform duration-300 ${
        open ? "rotate-180" : "rotate-0"
      }`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left rounded-2xl border border-gray-200 bg-white/70 backdrop-blur px-6 py-5 shadow-sm hover:shadow-md transition-shadow"
      aria-expanded={open}
    >
      <div className="flex items-center justify-between gap-6">
        <h4 className="text-lg font-semibold text-gray-900">{question}</h4>
        <span className="flex items-center gap-3 text-[#9c7c38]">
          <span className="hidden sm:inline text-sm font-medium">
            {open ? "Close" : "Open"}
          </span>
          <span className="grid place-items-center h-10 w-10 rounded-full bg-[#9c7c38]/10 text-[#9c7c38]">
            <ChevronIcon open={open} />
          </span>
        </span>
      </div>

      <div
        className={`grid transition-all duration-400 ease-out ${
          open
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0 mt-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      </div>
    </button>
  );
}

function FeatureCard({
  title,
  text,
  icon,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/70 backdrop-blur p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#9c7c38]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-black text-white grid place-items-center shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="text-2xl font-semibold mb-2">{title}</h4>
          <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center text-sm font-medium text-[#9c7c38] opacity-80 group-hover:opacity-100 transition-opacity">
        Learn more
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  /* ✅ ADDED: mobile menu state */
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuState, setMenuState] = useState<"open" | "closed">("closed");


  const footerLinks = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "About", href: "#about" },
      { label: "FAQ", href: "#faq" },

      /* ✅ ADDED: contact link */
      { label: "Contact", href: "/contact" },

      { label: "Sign In", href: "/login" },
      { label: "Enrol (Sign Up)", href: "/signup" },
      { label: "My Progress", href: "/my-progress" },
      { label: "Overview", href: "/overview" },
    ],
    []
  );

  return (
    <main id="top" className="min-h-screen bg-transparent text-gray-900">
      {/* FANCY BACKGROUND */}
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

      {/* NAVBAR */}
      <header className="max-w-7xl mx-auto px-6 sm:px-10 py-7 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-[80px] w-[85px] rounded-xl bg-white/100 backdrop-blur border border-gray-200 shadow-sm grid place-items-center">
            <Image
              src="/logo.png"
              alt="Al Qadr"
              width={58}
              height={58}
              className="rounded"
              priority
            />
          </div>
        </div>

        {/* ✅ Desktop actions (laptop and bigger) */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/contact"
            className="inline-flex items-center justify-center h-11 px-5 rounded-full text-sm font-medium text-gray-800 hover:bg-white/60 transition-colors"
          >
            Contact
          </a>

          <a
            href="/login"
            className="inline-flex items-center justify-center h-11 px-5 rounded-full text-sm font-medium text-gray-800 hover:bg-white/60 transition-colors"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900 shadow-sm"
          >
            Sign Up
          </a>
        </div>

        {/* ✅ Burger menu (smaller than laptop) */}
        {/* ✅ Burger menu (smaller than laptop) */}
<button
  type="button"
  onClick={() => {
    setMobileOpen(true);
    requestAnimationFrame(() => setMenuState("open"));
  }}
  className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 bg-white/70 backdrop-blur shadow-sm hover:bg-white transition-colors"
  aria-label="Open menu"
>
  <MenuIcon />
</button>

      </header>

      {/* ✅ Mobile menu overlay */}

  {mobileOpen && (
  <div className="fixed inset-0 z-50">
    {/* Backdrop */}
    <div
      onClick={() => {
        setMenuState("closed");
        setTimeout(() => setMobileOpen(false), 600);
      }}
      className={`absolute inset-0 bg-black/40 transition-opacity duration-[600ms] ease-out ${
        menuState === "open" ? "opacity-100" : "opacity-0"
      }`}
    />

    {/* Slide panel */}
    <div
      className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white/80 backdrop-blur border-l border-gray-200 shadow-2xl p-6 transition-transform duration-[600ms] ease-[cubic-bezier(.16,1,.3,1)] ${
        menuState === "open" ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Menu</div>

        <button
          type="button"
          onClick={() => {
            setMenuState("closed");
            setTimeout(() => setMobileOpen(false), 600);
          }}
          className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-8 grid gap-3">
        {[
          { label: "Home", href: "/" },
          { label: "About", href: "#about" },
          { label: "FAQ", href: "#faq" },
          { label: "Contact", href: "/contact" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            onClick={() => {
              setMenuState("closed");
              setTimeout(() => setMobileOpen(false), 600);
            }}
            className="rounded-2xl border border-gray-200 bg-white/70 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-white transition-colors"
          >
            {l.label}
          </a>
        ))}

        <div className="mt-2 h-px bg-gray-200" />

        <a
          href="/login"
          onClick={() => {
            setMenuState("closed");
            setTimeout(() => setMobileOpen(false), 600);
          }}
          className="rounded-2xl border border-gray-200 bg-white/70 px-4 py-4 text-sm font-medium text-gray-900 hover:bg-white transition-colors"
        >
          Sign In
        </a>

        <a
          href="/signup"
          onClick={() => {
            setMenuState("closed");
            setTimeout(() => setMobileOpen(false), 600);
          }}
          className="rounded-2xl bg-black px-4 py-4 text-sm font-semibold text-white hover:bg-gray-900 transition-colors"
        >
          Sign Up
        </a>
      </div>
    </div>
  </div>
)}




      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 backdrop-blur px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-[#9c7c38]" />
              <span className="text-gray-700">
                Northcliff • Hifz Class
              </span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight">
              Preserve the Qur’an.
              <br />
              <span className="text-[#9c7c38]">Elevate the Heart.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl">
              Join the Al Qadr Hifz Program in Northcliff — a journey of memorisation,
              discipline, and spiritual growth. Track your daily Sabak, Dhor, Sabak Dhor and weekly
              goals — all in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="/signup"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-black text-white text-base font-medium hover:bg-gray-900 shadow-sm"
              >
                Begin Your Journey
              </a>
              <a
                href="#about"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-gray-300 bg-white/40 backdrop-blur text-base font-medium hover:bg-white/70 transition-colors"
              >
                Explore Program
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl items-stretch">
              {[
                {
                  k: "Sabak",
                  v: "Daily memorisation",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        d="M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                },
                {
                  k: "Dhor",
                  v: "Strong retention",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        d="M12 6v6l4 2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  ),
                },
                {
                  k: "Targets",
                  v: "Weekly clarity",
                  icon: (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                      <path
                        d="M9 11l3 3L22 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.k}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/60 backdrop-blur px-5 py-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-[88px] flex items-center"
                >
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#9c7c38] via-[#9c7c38]/60 to-transparent" />
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#9c7c38]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-black text-white grid place-items-center shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">{item.k}</div>
                      <div className="mt-0.5 font-semibold">{item.v}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid gap-6">
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur p-8 shadow-lg">
              <p className="text-xl leading-relaxed italic">
                “And We have certainly made the Qur’an easy for remembrance, so is there any who will remember?”
              </p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-gray-500">Surah Al-Qamar • 54:17</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-black text-white p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#9c7c38]/25 blur-2xl" />
              <h3 className="mt-1 text-2xl font-semibold">Preview: Student Dashboard</h3>
              <p className="mt-3 text-white/70 leading-relaxed">
                Secure login. Daily submissions. Weekly goals. A calm system designed for focus — not distraction.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {["Sabak", "Sabak Dhor", "Dhor", "Weekly Goal"].map((t) => (
                  <div
                    key={t}
                    className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                  >
                    <div className="text-sm text-white/80">{t}</div>
                    <div className="mt-1 text-sm font-semibold">—</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="rounded-3xl border border-gray-200 bg-white/60 backdrop-blur p-10 shadow-sm">
            <p className="uppercase tracking-widest text-sm text-[#9c7c38] mb-3">
              About the Madrassah
            </p>

            <h2 className="text-4xl font-semibold tracking-tight">
              A Peaceful & Disciplined Environment for Hifz
            </h2>

            <div className="mt-6 grid md:grid-cols-2 gap-8">
              <p className="text-gray-700 leading-relaxed text-lg">
                Located in Northcliff, the Al Qadr Hifz class offers a peaceful and disciplined environment where students build a deep and lasting connection with the Qur’an.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Through a structured system emphasising focused Sabak, consistent Dhor, and clear weekly targets, students are guided step by step in their memorisation journey — while nurturing discipline, consistency, and good character.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="uppercase tracking-widest text-sm text-[#9c7c38]">
                Program Highlights
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight">
                Designed for Consistency & Excellence
              </h2>
            </div>
            <a
              href="/contact"
              className="inline-flex md:self-end items-center justify-center h-11 px-6 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900"
            >
              Enrol Now
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Structured Memorisation"
              text="Daily Sabak and guided Dhor routines help students progress steadily with strong retention."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <FeatureCard
              title="Weekly Accountability"
              text="Clear weekly targets make progress measurable and keep students motivated and consistent."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M8 7V4m8 3V4M5 11h14M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <FeatureCard
              title="Personal Progress System"
              text="Each student logs in privately and tracks their own Sabak, Dhor, and weekly goal progress."
              icon={
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M4 20a8 8 0 0116 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <p className="uppercase tracking-widest text-sm text-[#9c7c38]">
              Questions & Answers
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid gap-4">
            <FAQItem
              question="Who can join the Al Qadr Hifz Class?"
              answer="Students of all ages and levels are welcome. Beginners receive step-by-step guidance, while advanced students continue to strengthen memorisation and retention."
            />
            <FAQItem
              question="What is the class schedule?"
              answer="Classes run Monday to Friday. Daily sessions focus on new memorisation (Sabak) and revision (Dhor), ensuring a balanced pace that supports long-term retention."
            />
            <FAQItem
              question="Who teaches the class?"
              answer="Ml Shaheed Bhabha, a dedicated and experienced teacher, provides personalised guidance and oversight to every student."
            />
            <FAQItem
              question="How do students submit their daily progress?"
              answer="After signing in, students go to the My Progress page where they enter their Sabak, Sabak Dhor, Dhor, and weekly goal. The system saves it securely and updates the Overview automatically."
            />
           
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white/70 to-white/40 backdrop-blur p-10 shadow-lg overflow-hidden relative">
            <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[#9c7c38]/15 blur-3xl" />
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

            <div className="grid md:grid-cols-12 gap-10 items-center relative">
              <div className="md:col-span-8">
                <p className="uppercase tracking-widest text-sm text-[#9c7c38]">
                  Ready to begin?
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight">
                  Enrol and start tracking your Hifz journey today
                </h2>
                <p className="mt-4 text-gray-700 text-lg leading-relaxed">
                  A focused system for daily Sabak, consistent Dhor, and weekly targets —
                  built for clarity, discipline, and steady progress.
                </p>
              </div>

              <div className="md:col-span-4 flex md:justify-end gap-3">
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-black text-white text-base font-medium hover:bg-gray-900 shadow-sm"
                >
                  Sign Up
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-gray-300 bg-white/50 backdrop-blur text-base font-medium hover:bg-white/80 transition-colors"
                >
                  Sign In
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (fancy + responsive) */}
      <footer className="border-t border-gray-200 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* brand */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-4">
                <div className="h-[64px] w-[64px] rounded-3xl bg-white/70 backdrop-blur border border-gray-200 shadow-sm grid place-items-center">
                  <Image
                    src="/logo.png"
                    alt="Al Qadr"
                    width={46}
                    height={46}
                    className="rounded"
                  />
                </div>
                <div>
                  <div className="font-semibold text-lg">Al Qadr</div>
                  <div className="text-sm text-gray-600">Hifz Class • Northcliff</div>
                </div>
              </div>

              <p className="mt-5 text-sm text-gray-700 leading-relaxed max-w-sm">
                A disciplined and peaceful environment for Qur’anic memorisation.
                Track Sabak, Dhor, and weekly targets through a private student portal.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
               <a
  href="https://wa.me/27606211418"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center h-10 px-4 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm text-gray-800"
>
  WhatsApp
</a>

                <a
                  href="#"
                  className="inline-flex items-center justify-center h-10 px-4 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm text-gray-800"
                >
                  Email
                </a>
               <a
  href="https://www.google.com/maps/search/?api=1&query=49+Mountainview+Drive,+Northcliff,+Randburg,+2115"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center h-10 px-4 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-colors text-sm text-gray-800"
>
  Location
</a>

              </div>
            </div>

            {/* links */}
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-4">
                    Explore
                  </div>
                  <div className="space-y-3">
                    <a href="/" className="block text-sm text-gray-700 hover:text-black">
                      Home
                    </a>
                    <a href="#about" className="block text-sm text-gray-700 hover:text-black">
                      About
                    </a>
                    <a href="#faq" className="block text-sm text-gray-700 hover:text-black">
                      FAQ
                    </a>
                    {/* ✅ ADDED: footer explore contact */}
                    <a href="/contact" className="block text-sm text-gray-700 hover:text-black">
                      Contact
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-4">
                    Student Portal
                  </div>
                  <div className="space-y-3">
                    <a href="/login" className="block text-sm text-gray-700 hover:text-black">
                      Sign In
                    </a>
                    <a href="/signup" className="block text-sm text-gray-700 hover:text-black">
                      Enrol (Sign Up)
                    </a>
                    <a href="/my-progress" className="block text-sm text-gray-700 hover:text-black">
                      My Progress
                    </a>
                    <a href="/overview" className="block text-sm text-gray-700 hover:text-black">
                      Overview
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-4">
                    Program
                  </div>
                  <div className="space-y-3">
                    <a href="#about" className="block text-sm text-gray-700 hover:text-black">
                      Structure
                    </a>
                    <a href="#faq" className="block text-sm text-gray-700 hover:text-black">
                      Requirements
                    </a>
                    <a href="/signup" className="block text-sm text-gray-700 hover:text-black">
                      Enrolment
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-3xl border border-gray-200 bg-gradient-to-br from-white/70 to-white/40 backdrop-blur p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-widest text-[#9c7c38]">
                      Student Portal
                    </div>
                    <div className="mt-1 font-semibold text-lg">
                      Ready to begin your journey?
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      Sign up and start tracking daily progress.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href="/signup"
                      className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-900"
                    >
                      Enrol Now
                    </a>
                    <a
                      href="/login"
                      className="inline-flex items-center justify-center h-11 px-6 rounded-full border border-gray-300 bg-white/70 hover:bg-white transition-colors text-sm font-medium"
                    >
                      Sign In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-10 h-px bg-gray-200" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Al Qadr Hifz Class. All rights reserved.</p>

            <div className="flex items-center gap-4">
              <a href="#top" className="hover:text-black">
                Back to top ↑
              </a>
              <span className="text-gray-300">|</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
