"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Dumbbell, Users, BarChart3, CreditCard, ClipboardList,
  Building2, CheckCircle, ArrowRight, Menu, X, Star,
  Zap, Shield, Globe, ChevronRight, TrendingUp, Bell,
  UserCheck, Smartphone, Lock, HeartPulse
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Nav ──────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Features", "Pricing", "Testimonials", "FAQ"];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm" : "bg-transparent"
    )}>
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900 text-[15px]">FitSaaS</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5">
            Sign in
          </Link>
          <Link href="/login"
            className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
            Start free trial
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-5 py-4 space-y-3">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="block text-sm text-gray-600 py-1.5 font-medium"
              onClick={() => setMobileOpen(false)}>
              {l}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-gray-100">
            <Link href="/login" className="text-sm text-center text-gray-600 py-2 font-medium">Sign in</Link>
            <Link href="/login" className="text-sm text-center bg-blue-600 text-white py-2.5 rounded-xl font-medium">
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Counter animation ────────────────────────────────────────
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = to / 50;
        const t = setInterval(() => {
          start += step;
          if (start >= to) { setVal(to); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 30);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color }: {
  icon: React.ElementType; title: string; desc: string; color: string;
}) {
  return (
    <div className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50/50 transition-all duration-300">
      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Pricing Card ─────────────────────────────────────────────
function PricingCard({ name, price, period, desc, features, highlight, cta }: {
  name: string; price: string; period: string; desc: string;
  features: string[]; highlight?: boolean; cta: string;
}) {
  return (
    <div className={cn(
      "relative rounded-2xl p-7 flex flex-col transition-all duration-300",
      highlight
        ? "bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-[1.02]"
        : "bg-white border border-gray-100 hover:border-blue-100 hover:shadow-lg"
    )}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <div className="mb-5">
        <p className={cn("text-xs font-semibold uppercase tracking-widest mb-2", highlight ? "text-blue-200" : "text-blue-600")}>{name}</p>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-bold">{price}</span>
          <span className={cn("text-sm mb-1.5", highlight ? "text-blue-200" : "text-gray-400")}>{period}</span>
        </div>
        <p className={cn("text-sm", highlight ? "text-blue-100" : "text-gray-500")}>{desc}</p>
      </div>
      <ul className="space-y-2.5 flex-1 mb-6">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <CheckCircle className={cn("h-4 w-4 mt-0.5 flex-shrink-0", highlight ? "text-blue-200" : "text-blue-500")} />
            <span className={highlight ? "text-blue-50" : "text-gray-600"}>{f}</span>
          </li>
        ))}
      </ul>
      <Link href="/login"
        className={cn(
          "text-center py-3 rounded-xl text-sm font-semibold transition-colors",
          highlight
            ? "bg-white text-blue-600 hover:bg-blue-50"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}>
        {cta}
      </Link>
    </div>
  );
}

// ─── Dashboard Preview ─────────────────────────────────────────
function DashboardMockup() {
  const bars = [45, 65, 55, 80, 70, 95, 85, 100, 90, 75, 88, 92];
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-blue-100/60 overflow-hidden">
      {/* Top bar */}
      <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="flex-1 mx-4 h-5 bg-gray-200 rounded-full text-[10px] text-gray-400 flex items-center px-3">
          app.fitsaas.com/dashboard
        </div>
      </div>
      <div className="flex h-72">
        {/* Sidebar */}
        <div className="w-36 bg-gray-50 border-r border-gray-100 p-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-4 px-1">
            <div className="h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-800">FitSaaS</span>
          </div>
          {[
            { icon: BarChart3, label: "Dashboard", active: true },
            { icon: Users, label: "Members" },
            { icon: Dumbbell, label: "Trainers" },
            { icon: Building2, label: "Branches" },
            { icon: CreditCard, label: "Payments" },
            { icon: ClipboardList, label: "Attendance" },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} className={cn(
              "flex items-center gap-1.5 px-2 py-1.5 rounded-lg mb-0.5 text-[10px] font-medium",
              active ? "bg-blue-600 text-white" : "text-gray-500"
            )}>
              <Icon className="h-3 w-3" />{label}
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-4 bg-white overflow-hidden">
          <p className="text-[11px] font-semibold text-gray-800 mb-3">Overview</p>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Members", val: "1,284", color: "text-blue-600" },
              { label: "Revenue", val: "₹9.7L", color: "text-emerald-600" },
              { label: "Attendance", val: "342", color: "text-purple-600" },
              { label: "Dues", val: "₹38K", color: "text-red-500" },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                <p className="text-[8px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                <p className={cn("text-[13px] font-bold mt-0.5", s.color)}>{s.val}</p>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[9px] text-gray-400 mb-2 font-medium">Monthly Revenue</p>
            <div className="flex items-end gap-1 h-16">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{
                  height: `${h}%`,
                  background: i >= 9 ? "#2563eb" : "#dbeafe"
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function LandingPage() {
  const features = [
    { icon: Users, title: "Member management", desc: "Track 100s of members with profiles, plans, attendance history, dues, emergency contacts and medical notes — all in one place.", color: "bg-blue-50 text-blue-600" },
    { icon: ClipboardList, title: "Attendance tracking", desc: "Manual check-in, QR code, and biometric-ready. See who's in the gym right now with a live daily dashboard.", color: "bg-purple-50 text-purple-600" },
    { icon: CreditCard, title: "Payments & invoicing", desc: "Auto-generate invoices, track pending dues, send reminders, and see your revenue at a glance. Cash, UPI, card — all covered.", color: "bg-emerald-50 text-emerald-600" },
    { icon: Building2, title: "Multi-branch support", desc: "Own multiple locations? Manage all branches from one account with isolated data, separate staff, and consolidated reports.", color: "bg-amber-50 text-amber-600" },
    { icon: Dumbbell, title: "Trainer management", desc: "Assign trainers to members, track their schedule, attendance, salary, and performance ratings across all branches.", color: "bg-rose-50 text-rose-600" },
    { icon: BarChart3, title: "Reports & analytics", desc: "Revenue trends, membership growth, attendance heatmaps, trainer performance — downloadable, clear, and always up to date.", color: "bg-teal-50 text-teal-600" },
    { icon: HeartPulse, title: "Workout & diet plans", desc: "Create workout templates with sets, reps, and notes. Build meal plans with macros and assign them directly to members.", color: "bg-indigo-50 text-indigo-600" },
    { icon: Bell, title: "Smart notifications", desc: "Auto-alerts for membership expiry, pending fees, and birthdays. Your front desk will never miss a follow-up again.", color: "bg-orange-50 text-orange-600" },
  ];

  const plans = [
    {
      name: "Starter",
      price: "₹999",
      period: "/month",
      desc: "Perfect for a single gym location just getting started.",
      features: [
        "Up to 200 members",
        "1 branch",
        "5 staff accounts",
        "Attendance tracking",
        "Basic reports",
        "Email support",
      ],
      cta: "Start free trial",
    },
    {
      name: "Growth",
      price: "₹2,499",
      period: "/month",
      desc: "For growing gyms that need more power and branches.",
      features: [
        "Up to 1,000 members",
        "3 branches",
        "Unlimited staff",
        "Workout & diet plans",
        "Advanced analytics",
        "QR code attendance",
        "Priority support",
      ],
      highlight: true,
      cta: "Start free trial",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "For gym chains and large fitness businesses.",
      features: [
        "Unlimited members",
        "Unlimited branches",
        "Custom roles & RBAC",
        "API access",
        "Biometric integration",
        "White-label option",
        "Dedicated account manager",
      ],
      cta: "Contact sales",
    },
  ];

  const testimonials = [
    { name: "Rajesh Malhotra", role: "Owner, Iron Peak Gym, Delhi", text: "We went from spreadsheets to FitSaaS in a weekend. Membership renewals, attendance, payments — it all just works. My staff loves it.", stars: 5 },
    { name: "Priya Nair", role: "Manager, FlexFit, Gurugram", text: "Managing 3 branches used to mean 3 separate headaches. Now I see everything in one dashboard. The reports alone save me 4 hours a week.", stars: 5 },
    { name: "Amit Joshi", role: "Owner, CoreZone, Noida", text: "The member profile pages are incredible. Emergency contacts, medical notes, attendance history — everything a trainer needs is right there.", stars: 5 },
  ];

  const faqs = [
    { q: "Is there a free trial?", a: "Yes — all plans include a 14-day free trial with no credit card required. You get full access to every feature from day one." },
    { q: "Can I manage multiple gym branches?", a: "Absolutely. FitSaaS is built as a multi-branch platform from the ground up. Each branch has isolated data with a unified owner view on top." },
    { q: "How does the billing work?", a: "We bill monthly or annually (annual saves 20%). You can upgrade, downgrade, or cancel at any time from your settings page." },
    { q: "Is my data secure?", a: "All data is encrypted in transit and at rest. Every gym's data is completely isolated from other tenants — we take multi-tenancy seriously." },
    { q: "Can I import my existing member data?", a: "Yes. We support CSV import for members, plans, and payment history. Our onboarding team helps you migrate at no extra cost." },
    { q: "What happens when my trial ends?", a: "You'll be asked to pick a plan. If you don't, your account is paused — your data is never deleted without explicit confirmation from you." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-5 text-center relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap className="h-3 w-3" />
            Built for Indian gym owners
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Run your gym like a
            <span className="text-blue-600"> software company</span>
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
            FitSaaS gives gym owners a single platform to manage members, staff, trainers, attendance, payments, and reports — across every branch, from any device.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link href="/login"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-200 text-sm">
              Start free trial — no card needed
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-7 py-3.5 rounded-xl transition-colors text-sm">
              See all features
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Dashboard preview */}
          <div className="max-w-3xl mx-auto">
            <DashboardMockup />
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Real dashboard — the same UI your team will use from day 1.
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: 500, suffix: "+", label: "Gyms onboarded" },
              { val: 1200, suffix: "+", label: "Branches managed" },
              { val: 85000, suffix: "+", label: "Members tracked" },
              { val: 99, suffix: "%", label: "Uptime guaranteed" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-blue-600 mb-1">
                  <CountUp to={s.val} suffix={s.suffix} />
                </p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All of gym operations, one platform
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px]">
              No more juggling WhatsApp, Excel, and paper registers. FitSaaS replaces them all with a system that actually fits how gyms work.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-5 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Setup in minutes</p>
            <h2 className="text-3xl font-bold text-gray-900">Get started in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: UserCheck, title: "Create your account", desc: "Register as a gym owner. Set up your gym name, logo, currency, and working hours. Takes under 5 minutes." },
              { step: "02", icon: Building2, title: "Add your branches", desc: "Create one or more branch locations. Add your staff, trainers, and membership plans to each branch." },
              { step: "03", icon: TrendingUp, title: "Start managing", desc: "Import or add members, start tracking attendance, accept payments, and watch your dashboard come alive." },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 mb-1">{s.step}</p>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why FitSaaS ── */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Why FitSaaS</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for the way Indian gyms actually operate
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Most gym software was built for the West. They don't understand UPI, multiple collection methods, or the chaos of managing walk-ins alongside annual members. FitSaaS is built ground-up for the Indian fitness market.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Smartphone, title: "UPI & cash payment tracking", desc: "Log cash, UPI, card, and bank transfer payments with full invoice history." },
                  { icon: Globe, title: "Multi-branch from day one", desc: "Not an afterthought — every feature is designed to work across all your locations." },
                  { icon: Shield, title: "Complete data isolation", desc: "Your data is fully separated from every other gym on the platform." },
                  { icon: Lock, title: "Role-based access", desc: "Receptionist sees what they need. Trainer sees their members. Owner sees everything." },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Mini dashboard feature callout */}
            <div className="space-y-3">
              {[
                { label: "Members checked in today", value: "342", icon: UserCheck, bg: "bg-blue-50", text: "text-blue-700", sub: "+18 vs yesterday" },
                { label: "Pending dues this month", value: "₹38,400", icon: CreditCard, bg: "bg-red-50", text: "text-red-600", sub: "15 members" },
                { label: "Revenue this month", value: "₹9,75,000", icon: TrendingUp, bg: "bg-emerald-50", text: "text-emerald-700", sub: "↑ 8% vs last month" },
                { label: "Memberships expiring soon", value: "14", icon: Bell, bg: "bg-amber-50", text: "text-amber-700", sub: "Next 7 days" },
              ].map(card => (
                <div key={card.label} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0", card.bg)}>
                    <card.icon className={cn("h-5 w-5", card.text)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium">{card.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                  </div>
                  <p className="text-xs text-gray-400 text-right whitespace-nowrap">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-5 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl font-bold text-gray-900">Gym owners love it</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-500 text-[15px]">14-day free trial on all plans. No credit card required.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {plans.map(p => <PricingCard key={p.name} {...p} />)}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">
            All prices exclude GST · Annual billing saves 20% · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-5 bg-gray-50 border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-gray-900">Common questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(f => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-blue-600 rounded-3xl px-8 py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to modernise your gym?
              </h2>
              <p className="text-blue-100 mb-8 text-[15px] max-w-lg mx-auto leading-relaxed">
                Join 500+ gym owners who replaced their spreadsheets with FitSaaS. Set up in minutes, see results in days.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm shadow-lg">
                  Start free trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="mailto:hello@fitsaas.com"
                  className="inline-flex items-center justify-center gap-2 border border-blue-400 text-white hover:bg-blue-500 font-medium px-8 py-3.5 rounded-xl transition-colors text-sm">
                  Talk to sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-12 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Dumbbell className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">FitSaaS</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                The modern SaaS platform for gym management. Built for Indian gym owners.
              </p>
            </div>
            {[
              { heading: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { heading: "Legal", links: ["Privacy policy", "Terms of service", "Refund policy"] },
            ].map(col => (
              <div key={col.heading}>
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} FitSaaS. All rights reserved.</p>
            <p className="text-xs text-gray-400">Made with ❤️ for Indian gym owners</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── FAQ accordion ────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        <ChevronRight className={cn("h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200", open && "rotate-90")} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
