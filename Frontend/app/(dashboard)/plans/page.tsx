"use client";

import { useQuery } from "@tanstack/react-query";
import { planService } from "@/services";
import { Button, Card, CardContent, PageHeader, EmptyState, Skeleton, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { Plus, BriefcaseMedical, CheckCircle, Users, Snowflake } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const durationLabels: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  half_yearly: "Half Yearly",
  yearly: "Yearly",
  custom: "Custom",
};

const durationColors: Record<string, string> = {
  monthly: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900",
  quarterly: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-900",
  half_yearly: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-900",
  yearly: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900",
  custom: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800",
};

export default function PlansPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: planService.getPlans,
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="Membership plans"
        description={plans ? `${plans.length} plans` : ""}
        action={
          <Link href="/plans/new">
            <Button variant="brand" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />Create plan
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : plans?.length === 0 ? (
        <EmptyState
          icon={<BriefcaseMedical className="h-8 w-8" />}
          title="No plans yet"
          description="Create your first membership plan."
          action={<Link href="/plans/new"><Button variant="brand" size="sm">Create plan</Button></Link>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map(plan => {
            const effectivePrice = plan.price - (plan.price * plan.discount / 100);
            return (
              <Card key={plan.id} className={cn("hover:shadow-md transition-shadow", !plan.isActive && "opacity-60")}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold">{plan.name}</h3>
                      <span className={cn("inline-block mt-1 text-xs px-2 py-0.5 rounded-full border font-medium", durationColors[plan.duration])}>
                        {durationLabels[plan.duration]}
                      </span>
                    </div>
                    {!plan.isActive && <Badge variant="muted">Inactive</Badge>}
                  </div>

                  <div className="mb-3">
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold">{formatCurrency(effectivePrice)}</span>
                      {plan.discount > 0 && (
                        <span className="text-sm text-muted-foreground line-through mb-0.5">{formatCurrency(plan.price)}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.durationDays} days</p>
                    {plan.discount > 0 && (
                      <Badge variant="success" className="mt-1 text-xs">{plan.discount}% off</Badge>
                    )}
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />{plan.totalMembers}
                      </div>
                      {plan.freezeAllowed && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Snowflake className="h-3.5 w-3.5 text-blue-400" />{plan.freezeDays}d freeze
                        </div>
                      )}
                    </div>
                    <Link href={`/plans/${plan.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
