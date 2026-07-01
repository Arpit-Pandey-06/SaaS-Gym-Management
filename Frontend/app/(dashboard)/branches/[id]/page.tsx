"use client";

import { useQuery } from "@tanstack/react-query";
import { branchService, memberService, trainerService } from "@/services";
import { Card, CardContent, CardHeader, CardTitle, Button, Avatar, StatusBadge, Skeleton } from "@/components/ui";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { ArrowLeft, Building2, Phone, Mail, Users, Dumbbell, TrendingUp, UserCog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function BranchDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<"members" | "trainers">("members");

  const { data: branch, isLoading } = useQuery({
    queryKey: ["branch", params.id],
    queryFn: () => branchService.getBranchById(params.id),
  });

  const { data: members } = useQuery({
    queryKey: ["members", { branchId: params.id, limit: 8 }],
    queryFn: () => memberService.getMembers({ branchId: params.id, limit: 8 }),
    enabled: tab === "members",
  });

  const { data: trainers } = useQuery({
    queryKey: ["trainers", { branchId: params.id, limit: 8 }],
    queryFn: () => trainerService.getTrainers({ branchId: params.id, limit: 8 }),
    enabled: tab === "trainers",
  });

  if (isLoading) return (
    <div className="space-y-5 max-w-3xl">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (!branch) return <div className="text-center py-20 text-muted-foreground">Branch not found.</div>;

  const stats = [
    { icon: Users, label: "Total members", value: branch.totalMembers.toLocaleString(), color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
    { icon: Dumbbell, label: "Trainers", value: branch.totalTrainers, color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
    { icon: UserCog, label: "Staff", value: branch.totalStaff, color: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
    { icon: TrendingUp, label: "Monthly revenue", value: formatCurrency(branch.monthlyRevenue), color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
  ];

  const tabs = [
    { id: "members", label: "Members" },
    { id: "trainers", label: "Trainers" },
  ] as const;

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/branches"><Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-xl font-semibold">{branch.name}</h1>
        <StatusBadge status={branch.status} />
      </div>

      {/* Info card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-6 w-6 text-brand" />
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="text-sm text-muted-foreground">{branch.address}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />{branch.phone}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />{branch.email}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Created {formatDate(branch.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0", s.color)}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                <p className="text-sm font-semibold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {tabs.map(t => (
          <button key={t.id}
            className={cn("px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === t.id ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab(t.id)}>{t.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="divide-y divide-border">
          {tab === "members" && (
            members?.data.length === 0
              ? <p className="text-sm text-muted-foreground text-center py-12">No members in this branch.</p>
              : members?.data.map(m => (
                <Link key={m.id} href={`/members/${m.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
                  <Avatar name={m.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.planName}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </Link>
              ))
          )}
          {tab === "trainers" && (
            trainers?.data.length === 0
              ? <p className="text-sm text-muted-foreground text-center py-12">No trainers in this branch.</p>
              : trainers?.data.map(t => (
                <Link key={t.id} href={`/trainers/${t.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
                  <Avatar name={t.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.specialization.join(", ")}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </Link>
              ))
          )}
        </div>
      </Card>
    </div>
  );
}
