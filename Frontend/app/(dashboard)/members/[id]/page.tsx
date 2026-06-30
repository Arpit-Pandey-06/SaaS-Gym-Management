"use client";

import { useQuery } from "@tanstack/react-query";
import { memberService } from "@/services";
import { Avatar, StatusBadge, Card, CardContent, CardHeader, CardTitle, Badge, Button, Skeleton } from "@/components/ui";
import { formatDate, formatCurrency, formatRelativeTime } from "@/lib/utils";
import { ArrowLeft, Phone, Mail, MapPin, User, Calendar, CreditCard, ClipboardList, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MemberDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<"overview" | "attendance" | "payments">("overview");

  const { data: member, isLoading } = useQuery({
    queryKey: ["member", params.id],
    queryFn: () => memberService.getMemberById(params.id),
  });

  const { data: attendance } = useQuery({
    queryKey: ["member-attendance", params.id],
    queryFn: () => memberService.getMemberAttendance(params.id),
    enabled: tab === "attendance",
  });

  const { data: payments } = useQuery({
    queryKey: ["member-payments", params.id],
    queryFn: () => memberService.getMemberPayments(params.id),
    enabled: tab === "payments",
  });

  if (isLoading) return (
    <div className="space-y-5 animate-fade-in">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );

  if (!member) return <div className="text-center py-20 text-muted-foreground">Member not found.</div>;

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "attendance", label: "Attendance", icon: ClipboardList },
    { id: "payments", label: "Payments", icon: CreditCard },
  ] as const;

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/members">
          <Button variant="ghost" size="icon-sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Member profile</h1>
          <p className="text-xs text-muted-foreground">Added {formatRelativeTime(member.createdAt)}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link href={`/members/${member.id}/edit`}><Button variant="outline" size="sm">Edit member</Button></Link>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <Avatar name={member.name} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-semibold">{member.name}</h2>
                  <p className="text-sm text-muted-foreground capitalize">{member.gender}</p>
                </div>
                <StatusBadge status={member.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />{member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />{member.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />Born {formatDate(member.dateOfBirth)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" /><span className="truncate">{member.address}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Plan", value: member.planName },
          { label: "Joined", value: formatDate(member.joinDate) },
          { label: "Expires", value: formatDate(member.expiryDate) },
          { label: "Attendance", value: `${member.attendanceCount} visits` },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.label}</p>
              <p className="text-sm font-medium mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={cn("flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === t.id ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTab(t.id)}
          >
            <t.icon className="h-3.5 w-3.5" />{t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Financial summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total paid</span><span className="font-medium">{formatCurrency(member.totalPaid)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Pending dues</span><span className={cn("font-medium", member.pendingAmount > 0 ? "text-red-500" : "")}>{member.pendingAmount > 0 ? formatCurrency(member.pendingAmount) : "No dues"}</span></div>
              {member.trainerId && (
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Trainer</span><span className="font-medium">{member.trainerName}</span></div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Emergency contact</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name</span><span>{member.emergencyContact.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Phone</span><span>{member.emergencyContact.phone}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Relation</span><span>{member.emergencyContact.relation}</span></div>
            </CardContent>
          </Card>
          {member.medicalNotes && (
            <Card className="sm:col-span-2">
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-500" />Medical notes</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{member.medicalNotes}</p></CardContent>
            </Card>
          )}
        </div>
      )}

      {tab === "attendance" && (
        <Card>
          <div className="divide-y divide-border">
            {attendance?.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{formatDate(a.date)}</p>
                  <p className="text-xs text-muted-foreground">{a.checkIn} → {a.checkOut ?? "—"}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs capitalize">{a.method}</Badge>
                  {a.duration && <p className="text-xs text-muted-foreground mt-1">{a.duration} min</p>}
                </div>
              </div>
            ))}
            {!attendance?.length && <p className="text-sm text-muted-foreground text-center py-12">No attendance records yet.</p>}
          </div>
        </Card>
      )}

      {tab === "payments" && (
        <Card>
          <div className="divide-y divide-border">
            {payments?.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium">{p.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{p.planName} · {p.paidAt ? formatDate(p.paidAt) : "Pending"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(p.total)}</p>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
            {!payments?.length && <p className="text-sm text-muted-foreground text-center py-12">No payment records.</p>}
          </div>
        </Card>
      )}
    </div>
  );
}
