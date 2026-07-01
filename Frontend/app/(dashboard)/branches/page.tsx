"use client";

import { useQuery } from "@tanstack/react-query";
import { branchService } from "@/services";
import { Button, Card, CardContent, PageHeader, StatusBadge, EmptyState, Skeleton } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Plus, Building2, Users, Dumbbell, UserCog, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function StatPill({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function BranchesPage() {
  const { data: branches, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: branchService.getBranches,
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Branches"
        description={branches ? `${branches.length} locations` : ""}
        action={
          <Link href="/branches/new">
            <Button variant="brand" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />Add branch
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-xl" />)}
        </div>
      ) : branches?.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8" />}
          title="No branches yet"
          description="Add your first gym location to get started."
          action={<Link href="/branches/new"><Button variant="brand" size="sm">Add branch</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches?.map(b => (
            <Card key={b.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{b.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 max-w-[160px] truncate">{b.address}</p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <StatPill icon={Users} label="Members" value={b.totalMembers.toLocaleString()} color="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" />
                  <StatPill icon={Dumbbell} label="Trainers" value={b.totalTrainers} color="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400" />
                  <StatPill icon={UserCog} label="Staff" value={b.totalStaff} color="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" />
                  <StatPill icon={TrendingUp} label="Revenue" value={formatCurrency(b.monthlyRevenue)} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" />
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Contact</p>
                    <p className="text-xs font-medium">{b.phone}</p>
                  </div>
                  <Link href={`/branches/${b.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      View details <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
