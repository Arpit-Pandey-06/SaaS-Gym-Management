"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService, memberService, paymentService } from "@/services";
import { StatsCard, Card, CardHeader, CardTitle, CardContent, Avatar, StatusBadge, Badge, Skeleton } from "@/components/ui";
import { Users, DollarSign, UserCheck, Clock, Dumbbell, AlertCircle, TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
};

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "#2a2a3a" : "#f0f0f0";
  const textColor = isDark ? "#888" : "#aaa";

  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ["dashboard-stats"], queryFn: dashboardService.getStats });
  const { data: revenue, isLoading: revenueLoading } = useQuery({ queryKey: ["revenue-chart"], queryFn: dashboardService.getRevenueChart });
  const { data: attendance } = useQuery({ queryKey: ["attendance-chart"], queryFn: dashboardService.getAttendanceChart });
  const { data: memberGrowth } = useQuery({ queryKey: ["member-growth"], queryFn: dashboardService.getMemberGrowth });
  const { data: recentMembers } = useQuery({ queryKey: ["members", { page: 1, limit: 5 }], queryFn: () => memberService.getMembers({ page: 1, limit: 5 }) });
  const { data: recentPayments } = useQuery({ queryKey: ["payments", { page: 1, limit: 5 }], queryFn: () => paymentService.getPayments({ page: 1, limit: 5 }) });

  const statCards = [
    { title: "Total Members", value: formatCurrency(stats?.totalMembers ?? 0, "").replace("₹", "").trim() || (stats?.totalMembers?.toLocaleString("en-IN") ?? "—"), change: `${stats?.newMembersThisMonth ?? 0} new this month`, changeType: "up" as const, icon: <Users className="h-5 w-5" />, iconColor: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { title: "Monthly Revenue", value: stats ? formatCurrency(stats.revenue.current) : "—", change: stats ? `vs ${formatCurrency(stats.revenue.lastMonth)} last month` : "", changeType: "up" as const, icon: <DollarSign className="h-5 w-5" />, iconColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
    { title: "Today's Attendance", value: stats?.todayAttendance?.toString() ?? "—", change: "members checked in", changeType: "neutral" as const, icon: <UserCheck className="h-5 w-5" />, iconColor: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
    { title: "Pending Dues", value: stats ? formatCurrency(stats.pendingFees) : "—", change: "across all members", changeType: "down" as const, icon: <AlertCircle className="h-5 w-5" />, iconColor: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" },
    { title: "Active Members", value: stats?.activeMembers?.toLocaleString("en-IN") ?? "—", change: `${stats ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}% of total`, changeType: "neutral" as const, icon: <TrendingUp className="h-5 w-5" />, iconColor: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
    { title: "Active Trainers", value: stats?.activeTrainers?.toString() ?? "—", change: "across all branches", changeType: "neutral" as const, icon: <Dumbbell className="h-5 w-5" />, iconColor: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{formatDate(new Date(), "EEEE, dd MMMM yyyy")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export report</Button>
          <Link href="/members/new"><Button size="sm" variant="brand">+ Add member</Button></Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.title} custom={i} variants={fadeUp} initial="hidden" animate="show">
            <StatsCard {...s} loading={statsLoading} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <Skeleton className="h-52 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenue} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), "Revenue"]} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Member growth */}
        <Card>
          <CardHeader>
            <CardTitle>New members</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={memberGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }} />
                <Bar dataKey="new" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>30-day attendance trend</CardTitle>
          <Link href="/attendance">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={attendance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} tickFormatter={(d) => d.slice(5)} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: textColor }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--popover))", color: "hsl(var(--popover-foreground))" }} />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent members</CardTitle>
            <Link href="/members">
              <Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentMembers?.data.map((m) => (
                <Link href={`/members/${m.id}`} key={m.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
                  <Avatar name={m.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.planName}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent payments</CardTitle>
            <Link href="/payments">
              <Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentPayments?.data.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={p.memberName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.memberName}</p>
                    <p className="text-xs text-muted-foreground">{p.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(p.total)}</p>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
