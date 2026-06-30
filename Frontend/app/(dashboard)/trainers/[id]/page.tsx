"use client";

import { useQuery } from "@tanstack/react-query";
import { trainerService, memberService } from "@/services";
import { Avatar, StatusBadge, Card, CardContent, CardHeader, CardTitle, Badge, Button, Skeleton } from "@/components/ui";
import { formatDate, formatCurrency, formatRelativeTime, cn } from "@/lib/utils";
import { ArrowLeft, Phone, Mail, Star, Users, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TrainerDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<"overview" | "members">("overview");

  const { data: trainer, isLoading } = useQuery({
    queryKey: ["trainer", params.id],
    queryFn: () => trainerService.getTrainerById(params.id),
  });

  const { data: membersData } = useQuery({
    queryKey: ["members", { trainerId: params.id, limit: 20 }],
    queryFn: () => memberService.getMembers({ limit: 20 }),
    enabled: tab === "members",
  });

  if (isLoading) return (
    <div className="space-y-5 max-w-3xl">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  if (!trainer) return <div className="text-center py-20 text-muted-foreground">Trainer not found.</div>;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "members", label: "Assigned members" },
  ] as const;

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/trainers"><Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-xl font-semibold">Trainer profile</h1>
          <p className="text-xs text-muted-foreground">Joined {formatRelativeTime(trainer.joinDate)}</p>
        </div>
        <div className="ml-auto">
          <Link href={`/trainers/${trainer.id}/edit`}><Button variant="outline" size="sm">Edit trainer</Button></Link>
        </div>
      </div>

      {/* Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <Avatar name={trainer.name} size="xl" />
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{trainer.name}</h2>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {trainer.specialization.map(s => (
                      <Badge key={s} variant="info" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
                <StatusBadge status={trainer.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />{trainer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />{trainer.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />Joined {formatDate(trainer.joinDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {trainer.rating > 0 ? `${trainer.rating.toFixed(1)} rating` : "No rating yet"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Assigned members", value: trainer.assignedMembers, color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
          { icon: DollarSign, label: "Monthly salary", value: formatCurrency(trainer.salary), color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
          { icon: Calendar, label: "Attendance", value: `${trainer.attendanceCount} days`, color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0", s.color)}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
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
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Experience</span><span className="font-medium">{trainer.experience} years</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gender</span><span className="font-medium capitalize">{trainer.gender}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Branch</span><span className="font-medium capitalize">{trainer.branchId.replace("branch-", "Branch ")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Salary</span><span className="font-medium">{formatCurrency(trainer.salary)}/month</span></div>
          </CardContent>
        </Card>
      )}

      {tab === "members" && (
        <Card>
          <div className="divide-y divide-border">
            {membersData?.data
              .filter(m => m.trainerId === trainer.id)
              .map(m => (
                <Link key={m.id} href={`/members/${m.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors">
                  <Avatar name={m.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.planName}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </Link>
              ))}
            {membersData?.data.filter(m => m.trainerId === trainer.id).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">No members assigned yet.</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
