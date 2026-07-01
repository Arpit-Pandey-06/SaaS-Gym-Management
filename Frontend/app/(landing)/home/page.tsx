"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Dumbbell, Users, BarChart3, CreditCard, ClipboardList,
  Building2, CheckCircle, ArrowRight, Menu, X, Star,
  Zap, Shield, Globe, ChevronRight, TrendingUp, Bell,
  UserCheck, Lock, HeartPulse, ChevronDown, Send,
  MessageCircle, ThumbsUp, Snowflake, XCircle, Check,
  Smartphone, Activity, Utensils, Play, Pause
} from "lucide-react";

function cn(...c: (string | boolean | undefined)[]) { return c.filter(Boolean).join(" "); }

// ─── Scroll reveal hook ───────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── CountUp ─────────────────────────────────────────────────
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let cur = 0;
        const step = to / 60;
        const t = setInterval(() => { cur += step; if (cur >= to) { setVal(to); clearInterval(t); } else setVal(Math.floor(cur)); }, 25);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Navbar ───────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#howitworks" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm" : "bg-transparent")}>
      <nav className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center"><Dumbbell className="h-4 w-4 text-white" /></div>
          <span className="font-bold text-gray-900">FitSaaS</span>
        </Link>
        <div className="hidden md:flex items-center gap-5">
          {links.map(l => <a key={l.label} href={l.href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">{l.label}</a>)}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors">Sign in</Link>
          <Link href="/login" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 transform">Start free trial</Link>
        </div>
        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </nav>
      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 px-5 py-4 space-y-2">
          {links.map(l => <a key={l.label} href={l.href} className="block text-sm text-gray-600 py-2 font-medium" onClick={() => setOpen(false)}>{l.label}</a>)}
          <div className="pt-2 space-y-2 border-t border-gray-100">
            <Link href="/login" className="block text-center text-sm text-gray-600 py-2">Sign in</Link>
            <Link href="/login" className="block text-center bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold">Start free trial</Link>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Dashboard Mockup ─────────────────────────────────────────
function DashboardMockup() {
  const bars = [45, 65, 55, 80, 70, 95, 85, 100, 90, 75, 88, 92];
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-blue-100/60 overflow-hidden select-none">
      <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" /><div className="h-2.5 w-2.5 rounded-full bg-amber-400" /><div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="flex-1 mx-4 h-5 bg-gray-200 rounded-full text-[10px] text-gray-400 flex items-center px-3">app.fitsaas.com/dashboard</div>
      </div>
      <div className="flex h-72">
        <div className="w-36 bg-gray-50 border-r border-gray-100 p-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-4 px-1">
            <div className="h-6 w-6 bg-blue-600 rounded-lg flex items-center justify-center"><Dumbbell className="h-3 w-3 text-white" /></div>
            <span className="text-xs font-bold text-gray-800">FitSaaS</span>
          </div>
          {[{ icon: BarChart3, label: "Dashboard", active: true }, { icon: Users, label: "Members" }, { icon: Dumbbell, label: "Trainers" }, { icon: Building2, label: "Branches" }, { icon: CreditCard, label: "Payments" }, { icon: ClipboardList, label: "Attendance" }].map(({ icon: Icon, label, active }) => (
            <div key={label} className={cn("flex items-center gap-1.5 px-2 py-1.5 rounded-lg mb-0.5 text-[10px] font-medium", active ? "bg-blue-600 text-white" : "text-gray-500")}><Icon className="h-3 w-3" />{label}</div>
          ))}
        </div>
        <div className="flex-1 p-4 bg-white overflow-hidden">
          <p className="text-[11px] font-semibold text-gray-800 mb-3">Overview — June 2025</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[{ label: "Members", val: "1,284", color: "text-blue-600" }, { label: "Revenue", val: "₹9.7L", color: "text-emerald-600" }, { label: "Today", val: "342", color: "text-purple-600" }, { label: "Dues", val: "₹38K", color: "text-red-500" }].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                <p className="text-[8px] text-gray-400 uppercase tracking-wide">{s.label}</p>
                <p className={cn("text-[13px] font-bold mt-0.5", s.color)}>{s.val}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[9px] text-gray-400 mb-2 font-medium">Monthly Revenue 2025</p>
            <div className="flex items-end gap-1 h-16">
              {bars.map((h, i) => <div key={i} className="flex-1 rounded-t transition-all" style={{ height: `${h}%`, background: i >= 9 ? "#2563eb" : "#dbeafe" }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Feature Deep-Dive Modal ──────────────────────────────────
const featureDetails: Record<string, { title: string; description: string; bullets: string[]; demo?: string }> = {
  "Member management": {
    title: "Complete member profiles",
    description: "Every member gets a rich profile with everything your team needs — from emergency contacts to medical notes to full payment history.",
    bullets: ["Photo, QR code, and contact details", "Membership plan with expiry countdown", "Full attendance history with check-in/out times", "Payment history and pending dues tracker", "Assigned trainer with workout & diet plans", "Medical notes and emergency contact info", "Status badges — Active, Expired, Frozen, Inactive"],
  },
  "Attendance tracking": {
    title: "Never miss a check-in",
    description: "Track who walks in through manual entry, QR scan, or biometric — with a real-time dashboard showing today's footfall.",
    bullets: ["Manual, QR, and biometric-ready input", "Live today's attendance count", "30-day attendance trend chart", "Per-member attendance history", "Branch-wise daily breakdown", "Export attendance reports as CSV"],
  },
  "Payments & invoicing": {
    title: "Full payment lifecycle",
    description: "From invoice generation to dues tracking to refunds — every rupee accounted for, across all payment methods.",
    bullets: ["Auto-generated invoices with GST", "Cash, UPI, card, and bank transfer tracking", "Pending dues alerts and reminders", "Refund and failed payment handling", "Revenue charts by month and branch", "One-click invoice PDF download"],
  },
  "Multi-branch support": {
    title: "One platform, every location",
    description: "Own multiple gyms? See everything from one owner dashboard while keeping each branch's data completely separate.",
    bullets: ["Unlimited branch locations", "Per-branch staff and trainer management", "Consolidated revenue and attendance reports", "Branch-level performance analytics", "Separate member pools per branch", "Switch branches with one click"],
  },
  "Trainer management": {
    title: "Your training team, organised",
    description: "Track trainers across all branches — their members, schedule, salary, and performance in one place.",
    bullets: ["Trainer profiles with specializations", "Assigned member list per trainer", "Attendance and salary tracking", "Star rating from member feedback", "Schedule and availability view", "Performance reports by branch"],
  },
  "Reports & analytics": {
    title: "Data that drives decisions",
    description: "Beautiful, clear reports on everything from revenue to attendance to membership growth — downloadable in one click.",
    bullets: ["Monthly revenue trends", "New vs churned member tracking", "Attendance heatmaps by day/hour", "Branch performance comparison", "Trainer productivity scores", "Export as CSV or PDF"],
  },
  "Workout & diet plans": {
    title: "Training beyond the gym floor",
    description: "Build workout templates with sets, reps, and notes. Create meal plans with macros. Assign both to members directly.",
    bullets: ["Custom workout templates by goal/level", "Day-wise exercise scheduling", "Sets, reps, weight, rest tracking", "Calorie and macro-based meal plans", "Assign to individual members", "Members view their own plans on mobile"],
  },
  "Smart notifications": {
    title: "Never miss a follow-up",
    description: "Automated alerts keep your team on top of renewals, dues, and important member moments — without manual tracking.",
    bullets: ["Membership expiry alerts (7/3/1 day)", "Overdue payment reminders", "Member birthday greetings", "Staff announcements", "New member welcome notifications", "Custom notification rules (coming soon)"],
  },
};

function FeatureModal({ feature, onClose }: { feature: string; onClose: () => void }) {
  const detail = featureDetails[feature];
  if (!detail) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-7 animate-[scale-in_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"><X className="h-4 w-4 text-gray-500" /></button>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{detail.title}</h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">{detail.description}</p>
        <ul className="space-y-2.5 mb-6">
          {detail.bullets.map(b => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />{b}
            </li>
          ))}
        </ul>
        <Link href="/login" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm" onClick={onClose}>
          Try this feature free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: React.ElementType; title: string; desc: string; color: string }) {
  const [open, setOpen] = useState(false);
  const { ref, visible } = useReveal();
  return (
    <>
      <div ref={ref} className={cn("group p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/60 transition-all duration-300 cursor-pointer",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )} style={{ transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s, border-color 0.2s" }}
        onClick={() => setOpen(true)}>
        <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-3">{desc}</p>
        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
          Learn more <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
      {open && <FeatureModal feature={title} onClose={() => setOpen(false)} />}
    </>
  );
}

// ─── Pricing ──────────────────────────────────────────────────
const plans = [
  {
    name: "Starter",
    monthlyPrice: 999,
    yearlyPrice: 799,
    desc: "Perfect for a single gym just getting started.",
    color: "border-gray-100",
    features: [
      { text: "Up to 200 members", included: true },
      { text: "1 branch", included: true },
      { text: "5 staff accounts", included: true },
      { text: "Attendance tracking", included: true },
      { text: "Basic reports", included: true },
      { text: "Payment tracking", included: true },
      { text: "Workout & diet plans", included: false },
      { text: "QR code attendance", included: false },
      { text: "Advanced analytics", included: false },
      { text: "API access", included: false },
    ],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    desc: "For growing gyms that need more power.",
    highlight: true,
    color: "border-blue-500",
    features: [
      { text: "Up to 1,000 members", included: true },
      { text: "3 branches", included: true },
      { text: "Unlimited staff accounts", included: true },
      { text: "Attendance tracking", included: true },
      { text: "Advanced reports", included: true },
      { text: "Payment + invoicing", included: true },
      { text: "Workout & diet plans", included: true },
      { text: "QR code attendance", included: true },
      { text: "Advanced analytics", included: true },
      { text: "API access", included: false },
    ],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    desc: "For gym chains and large fitness businesses.",
    color: "border-gray-100",
    features: [
      { text: "Unlimited members", included: true },
      { text: "Unlimited branches", included: true },
      { text: "Unlimited staff accounts", included: true },
      { text: "Attendance tracking", included: true },
      { text: "Custom reports", included: true },
      { text: "Payment + invoicing", included: true },
      { text: "Workout & diet plans", included: true },
      { text: "Biometric integration", included: true },
      { text: "Advanced analytics", included: true },
      { text: "API access", included: true },
    ],
    cta: "Contact sales",
  },
];

function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const { ref, visible } = useReveal();
  return (
    <section id="pricing" className="py-24 px-5">
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className={cn("text-center mb-12 transition-all duration-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-500 mb-6">14-day free trial on all plans. No credit card required.</p>
          <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setAnnual(false)} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-all", !annual ? "bg-white shadow text-gray-900" : "text-gray-500")}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2", annual ? "bg-white shadow text-gray-900" : "text-gray-500")}>
              Annual
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, i) => (
            <div key={p.name} className={cn(
              "relative rounded-2xl p-7 flex flex-col border-2 transition-all duration-300",
              p.highlight ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-200 scale-[1.02]" : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-lg",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
            )} style={{ transitionDelay: `${i * 100}ms`, transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s, border-color 0.2s" }}>
              {p.highlight && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">MOST POPULAR</div>}
              <div className="mb-5">
                <p className={cn("text-xs font-bold uppercase tracking-widest mb-2", p.highlight ? "text-blue-200" : "text-blue-600")}>{p.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  {p.monthlyPrice ? (
                    <>
                      <span className="text-4xl font-bold">{p.highlight ? <span className="text-white">₹{annual ? p.yearlyPrice?.toLocaleString() : p.monthlyPrice?.toLocaleString()}</span> : `₹${annual ? p.yearlyPrice?.toLocaleString() : p.monthlyPrice?.toLocaleString()}`}</span>
                      <span className={cn("text-sm mb-1.5", p.highlight ? "text-blue-200" : "text-gray-400")}>/mo</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">Custom</span>
                  )}
                </div>
                <p className={cn("text-sm", p.highlight ? "text-blue-100" : "text-gray-500")}>{p.desc}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map(f => (
                  <li key={f.text} className={cn("flex items-center gap-2.5 text-sm", !f.included && "opacity-40")}>
                    {f.included
                      ? <Check className={cn("h-4 w-4 flex-shrink-0", p.highlight ? "text-blue-200" : "text-blue-500")} />
                      : <XCircle className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    }
                    <span className={p.highlight ? "text-blue-50" : "text-gray-600"}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link href={p.monthlyPrice ? "/login" : "mailto:hello@fitsaas.com"}
                className={cn("text-center py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 transform",
                  p.highlight ? "bg-white text-blue-600 hover:bg-blue-50 shadow" : "bg-blue-600 text-white hover:bg-blue-700"
                )}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">All prices exclude GST · Cancel anytime · Upgrade or downgrade at any time</p>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────
const initialTestimonials = [
  { id: 1, name: "Rajesh Malhotra", role: "Owner, Iron Peak Gym, Delhi", text: "We went from spreadsheets to FitSaaS in a weekend. Membership renewals, attendance, payments — it all just works. My staff loves it.", stars: 5, likes: 24, avatar: "RM" },
  { id: 2, name: "Priya Nair", role: "Manager, FlexFit, Gurugram", text: "Managing 3 branches used to mean 3 separate headaches. Now I see everything in one dashboard. The reports alone save me 4 hours a week.", stars: 5, likes: 18, avatar: "PN" },
  { id: 3, name: "Amit Joshi", role: "Owner, CoreZone, Noida", text: "The member profile pages are incredible. Emergency contacts, medical notes, attendance history — everything a trainer needs is right there.", stars: 5, likes: 31, avatar: "AJ" },
  { id: 4, name: "Sunita Reddy", role: "Receptionist, FitLife, Bengaluru", text: "Adding new members used to take 10 minutes on paper. Now it's 2 minutes on FitSaaS. The QR check-in is a game changer for our front desk.", stars: 5, likes: 15, avatar: "SR" },
  { id: 5, name: "Vikram Chaudhary", role: "Owner, PowerHouse Gym, Pune", text: "The pending dues alert alone recovered ₹2 lakhs in my first month. I didn't even know how much was outstanding until FitSaaS showed me.", stars: 5, likes: 42, avatar: "VC" },
];

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", text: "", stars: 5 });
  const [submitted, setSubmitted] = useState(false);
  const { ref, visible } = useReveal();

  const handleLike = (id: number) => {
    if (liked.has(id)) return;
    setLiked(prev => new Set(prev).add(id));
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, likes: t.likes + 1 } : t));
  };

  const handleSubmit = () => {
    if (!form.name || !form.text) return;
    const initials = form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    setTestimonials(prev => [{ id: Date.now(), name: form.name, role: form.role || "FitSaaS user", text: form.text, stars: form.stars, likes: 0, avatar: initials }, ...prev]);
    setSubmitted(true);
    setForm({ name: "", role: "", text: "", stars: 5 });
    setTimeout(() => { setSubmitted(false); setShowForm(false); }, 2000);
  };

  return (
    <section id="testimonials" className="py-24 px-5 bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={cn("text-center mb-12 transition-all duration-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gym owners love it</h2>
          <p className="text-gray-500 mb-6">Real reviews from real gym owners across India.</p>
          <button onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 transform shadow-sm">
            <MessageCircle className="h-4 w-4" />Share your experience
          </button>
        </div>

        {/* Submit form */}
        {showForm && (
          <div className="mb-10 bg-white rounded-2xl border border-blue-100 p-6 shadow-sm max-w-xl mx-auto">
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-gray-900">Thank you for your review!</p>
                <p className="text-sm text-gray-500 mt-1">Your testimonial has been added.</p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Write a review</h3>
                <div className="space-y-3">
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setForm(f => ({ ...f, stars: s }))}>
                        <Star className={cn("h-6 w-6 transition-colors", s <= form.stars ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                      </button>
                    ))}
                  </div>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name *" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Role / Gym name (e.g. Owner, IronFit Delhi)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Your experience with FitSaaS *" rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  <div className="flex gap-2">
                    <button onClick={handleSubmit} disabled={!form.name || !form.text}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />Submit review
                    </button>
                    <button onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={t.id} className={cn("bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300",
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )} style={{ transitionDelay: `${i * 80}ms`, transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s" }}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <button onClick={() => handleLike(t.id)}
                  className={cn("flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all",
                    liked.has(t.id) ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-400 hover:bg-gray-100"
                  )}>
                  <ThumbsUp className="h-3.5 w-3.5" />{t.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────
const faqs = [
  { q: "Is there a free trial?", a: "Yes — all plans include a 14-day free trial with full access to every feature. No credit card required to start." },
  { q: "Can I manage multiple gym branches?", a: "Absolutely. FitSaaS is built multi-branch from the ground up. Each branch has isolated data — members, staff, payments — with a unified owner view." },
  { q: "How does billing work?", a: "Monthly or annual billing. Annual saves 20%. Upgrade, downgrade, or cancel anytime from your settings — no lock-in." },
  { q: "Is my data secure?", a: "All data is encrypted in transit and at rest using AES-256. Every gym's data is fully isolated from other tenants on separate database rows." },
  { q: "Can I import existing member data?", a: "Yes. We support CSV import for members, plans, and payment history. Our onboarding team assists migration at no extra cost." },
  { q: "Does it work on mobile?", a: "Yes — FitSaaS is fully responsive and works on any device. A dedicated mobile app for members and trainers is on the roadmap." },
  { q: "What payment methods do you support tracking for?", a: "Cash, UPI, credit/debit card, and bank transfers. You track the method per payment — FitSaaS is a management platform, not a payment gateway." },
  { q: "What happens when my trial ends?", a: "You'll be prompted to pick a plan. If you don't, your account pauses — data is never deleted without your explicit confirmation." },
];

const enquiryReplies: Record<string, string> = {
  "Can I try before buying?": "Absolutely! Every plan starts with a 14-day free trial — no card needed. Just sign up and you're in.",
  "Do you offer student discounts?": "We don't have a student discount for gym owners, but our Starter plan at ₹999/month is designed for small operations.",
  "Is there a mobile app?": "FitSaaS is mobile-responsive right now. A native mobile app is on our Q3 2025 roadmap!",
};

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [enquiry, setEnquiry] = useState("");
  const [comments, setComments] = useState<{ text: string; reply?: string; time: string }[]>([]);
  const [sending, setSending] = useState(false);
  const { ref, visible } = useReveal();

  const handleEnquiry = async () => {
    if (!enquiry.trim()) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 800));
    const reply = enquiryReplies[enquiry.trim()] ?? "Thanks for your question! Our team will get back to you within 24 hours.";
    setComments(prev => [{ text: enquiry, reply, time: "just now" }, ...prev]);
    setEnquiry("");
    setSending(false);
  };

  return (
    <section id="faq" className="py-24 px-5 bg-gray-50 border-y border-gray-100">
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className={cn("text-center mb-12 transition-all duration-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Common questions</h2>
          <p className="text-gray-500 text-sm">Can&apos;t find your answer? Ask us below — we reply within 24 hours.</p>
        </div>

        <div className="space-y-3 mb-12">
          {faqs.map((f, i) => (
            <div key={i} className={cn("bg-white border rounded-2xl overflow-hidden transition-all duration-200",
              openIdx === i ? "border-blue-200 shadow-sm" : "border-gray-100"
            )}>
              <button className="w-full flex items-center justify-between px-6 py-4 text-left gap-4" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <span className="text-sm font-semibold text-gray-900">{f.q}</span>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200", openIdx === i && "rotate-180")} />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enquiry box */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Still have a question?</h3>
          <p className="text-sm text-gray-400 mb-4">Ask anything — our team responds within 24 hours.</p>
          <div className="flex gap-2 mb-4">
            <input value={enquiry} onChange={e => setEnquiry(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEnquiry()}
              placeholder="e.g. Can I try before buying?"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleEnquiry} disabled={!enquiry.trim() || sending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium">
              {sending ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
              Ask
            </button>
          </div>

          {comments.length > 0 && (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              {comments.map((c, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">U</div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                      <p className="text-sm text-gray-700">{c.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{c.time}</p>
                    </div>
                  </div>
                  {c.reply && (
                    <div className="flex items-start gap-2.5 pl-4">
                      <div className="h-7 w-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Dumbbell className="h-3 w-3" />
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex-1">
                        <p className="text-xs font-semibold text-blue-700 mb-0.5">FitSaaS Team</p>
                        <p className="text-sm text-gray-700">{c.reply}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: Users, title: "Member management", desc: "Rich profiles with plans, attendance, dues, medical notes and emergency contacts.", color: "bg-blue-50 text-blue-600" },
    { icon: ClipboardList, title: "Attendance tracking", desc: "Manual, QR, and biometric-ready. Live dashboard showing who's in right now.", color: "bg-purple-50 text-purple-600" },
    { icon: CreditCard, title: "Payments & invoicing", desc: "Auto invoices, GST support, UPI/cash/card tracking, dues alerts and refunds.", color: "bg-emerald-50 text-emerald-600" },
    { icon: Building2, title: "Multi-branch support", desc: "One platform for all your locations with isolated data and consolidated reports.", color: "bg-amber-50 text-amber-600" },
    { icon: Dumbbell, title: "Trainer management", desc: "Assign members, track salary, attendance, schedule, and performance ratings.", color: "bg-rose-50 text-rose-600" },
    { icon: BarChart3, title: "Reports & analytics", desc: "Revenue trends, membership growth, attendance heatmaps — downloadable instantly.", color: "bg-teal-50 text-teal-600" },
    { icon: HeartPulse, title: "Workout & diet plans", desc: "Create templates with sets/reps/macros and assign them directly to members.", color: "bg-indigo-50 text-indigo-600" },
    { icon: Bell, title: "Smart notifications", desc: "Auto-alerts for expiry, dues, and birthdays. Never miss a follow-up again.", color: "bg-orange-50 text-orange-600" },
  ];

  const whyPoints = [
    { icon: Smartphone, title: "UPI & cash payment tracking", desc: "Log cash, UPI, card, and bank transfer with full invoice history." },
    { icon: Globe, title: "Multi-branch from day one", desc: "Every feature works across all your locations — not bolted on later." },
    { icon: Shield, title: "Complete data isolation", desc: "Your data is fully separated from every other gym on the platform." },
    { icon: Lock, title: "Role-based access", desc: "Receptionist, trainer, manager, and owner — each sees exactly what they need." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes scale-in { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        .float { animation: float 4s ease-in-out infinite; }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-40 left-1/4 w-72 h-72 bg-purple-50 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />
        </div>
        <div ref={heroRef} className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 animate-[fade-in_0.5s_ease-out]">
            <Zap className="h-3 w-3" />Built for Indian gym owners · 14-day free trial
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6 animate-[fade-in_0.6s_ease-out]">
            Run your gym like a<br /><span className="text-blue-600">software company</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10 animate-[fade-in_0.7s_ease-out]">
            FitSaaS gives gym owners a single platform to manage members, staff, trainers, attendance, payments, and reports — across every branch, from any device.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16 animate-[fade-in_0.8s_ease-out]">
            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5 transform text-sm">
              Start free trial — no card needed <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 transform text-sm">
              See all features <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="float max-w-3xl mx-auto"><DashboardMockup /></div>
          <p className="text-xs text-gray-400 mt-5">Real dashboard — same UI your team uses from day 1.</p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[{ val: 500, suffix: "+", label: "Gyms onboarded" }, { val: 1200, suffix: "+", label: "Branches managed" }, { val: 85000, suffix: "+", label: "Members tracked" }, { val: 99, suffix: "%", label: "Uptime guaranteed" }].map(s => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-blue-600 mb-1"><CountUp to={s.val} suffix={s.suffix} /></p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All of gym operations, one platform</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px]">Click any feature to see exactly what it does.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="howitworks" className="py-24 px-5 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Setup in minutes</p>
            <h2 className="text-3xl font-bold text-gray-900">Get started in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: UserCheck, title: "Create your account", desc: "Register as a gym owner. Set your gym name, logo, currency, and working hours. Under 5 minutes." },
              { step: "02", icon: Building2, title: "Add your branches", desc: "Create locations. Add staff, trainers, and membership plans to each branch." },
              { step: "03", icon: TrendingUp, title: "Start managing", desc: "Import or add members, track attendance, accept payments, and watch your dashboard come alive." },
            ].map((s, i) => {
              const { ref, visible } = useReveal();
              return (
                <div key={s.step} ref={ref} className={cn("transition-all duration-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")} style={{ transitionDelay: `${i * 150}ms` }}>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-400 mb-1">{s.step}</p>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why FitSaaS ── */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Why FitSaaS</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Built for how Indian gyms actually operate</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">Most gym software was built for the West. They don&apos;t understand UPI, multiple collection methods, or the chaos of managing walk-ins alongside annual members.</p>
              <div className="space-y-4">
                {whyPoints.map(item => (
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
            <div className="space-y-3">
              {[
                { label: "Members checked in today", value: "342", icon: UserCheck, bg: "bg-blue-50", text: "text-blue-700", sub: "+18 vs yesterday" },
                { label: "Pending dues this month", value: "₹38,400", icon: CreditCard, bg: "bg-red-50", text: "text-red-600", sub: "15 members" },
                { label: "Revenue this month", value: "₹9,75,000", icon: TrendingUp, bg: "bg-emerald-50", text: "text-emerald-700", sub: "↑ 8% vs last month" },
                { label: "Memberships expiring soon", value: "14", icon: Bell, bg: "bg-amber-50", text: "text-amber-700", sub: "Next 7 days" },
              ].map((card, i) => (
                <div key={card.label} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transform transition-all duration-200" style={{ animationDelay: `${i * 100}ms` }}>
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

      <PricingSection />
      <TestimonialsSection />
      <FAQSection />

      {/* ── CTA ── */}
      <section className="py-24 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-blue-600 rounded-3xl px-8 py-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/3" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to modernise your gym?</h2>
              <p className="text-blue-100 mb-8 text-[15px] max-w-lg mx-auto leading-relaxed">Join 500+ gym owners who replaced spreadsheets with FitSaaS. Set up in minutes, results in days.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 transform text-sm shadow-lg">
                  Start free trial <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="mailto:hello@fitsaas.com" className="inline-flex items-center justify-center border border-blue-400 text-white hover:bg-blue-500 font-medium px-8 py-3.5 rounded-xl transition-colors text-sm">
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
                <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center"><Dumbbell className="h-4 w-4 text-white" /></div>
                <span className="font-bold text-gray-900">FitSaaS</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">The modern SaaS platform for gym management. Built for Indian gym owners.</p>
            </div>
            {[
              { heading: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { heading: "Legal", links: ["Privacy policy", "Terms of service", "Refund policy"] },
            ].map(col => (
              <div key={col.heading}>
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">{col.heading}</p>
                <ul className="space-y-2">{col.links.map(l => <li key={l}><a href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{l}</a></li>)}</ul>
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
