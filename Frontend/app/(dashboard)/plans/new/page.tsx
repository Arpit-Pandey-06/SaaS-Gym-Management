"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { planService } from "@/services";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Plan name required"),
  duration: z.enum(["monthly", "quarterly", "half_yearly", "yearly", "custom"]),
  durationDays: z.number().min(1, "Duration in days required"),
  price: z.number().min(1, "Price required"),
  discount: z.number().min(0).max(100),
  features: z.array(z.object({ value: z.string().min(1, "Feature cannot be empty") })).min(1, "Add at least one feature"),
  freezeAllowed: z.boolean(),
  freezeDays: z.number().min(0),
});
type FormData = z.infer<typeof schema>;

const durationPresets: Record<string, number> = {
  monthly: 30,
  quarterly: 90,
  half_yearly: 180,
  yearly: 365,
  custom: 0,
};

function Field({ label, error, children, required }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const selectCls = "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function NewPlanPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      duration: "monthly",
      durationDays: 30,
      discount: 0,
      freezeAllowed: false,
      freezeDays: 0,
      features: [{ value: "Gym access" }, { value: "Locker" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ name: "features", control: undefined as never });
  // Manual feature state since useFieldArray needs control
  const [featureList, setFeatureList] = React.useState([{ value: "Gym access" }, { value: "Locker" }]);

  const freezeAllowed = watch("freezeAllowed");
  const duration = watch("duration");

  React.useEffect(() => {
    if (duration !== "custom") {
      setValue("durationDays", durationPresets[duration]);
    }
  }, [duration, setValue]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => planService.createPlan({
      ...data,
      features: featureList.map(f => f.value).filter(Boolean),
    }),
    onSuccess: () => {
      toast.success("Plan created");
      qc.invalidateQueries({ queryKey: ["plans"] });
      router.push("/plans");
    },
    onError: () => toast.error("Failed to create plan"),
  });

  return (
    <div className="max-w-xl space-y-5 animate-fade-in">
      <PageHeader
        title="Create plan"
        breadcrumb={["Plans", "New plan"]}
        action={<Link href="/plans"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4" />Back</Button></Link>}
      />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        {/* Basic */}
        <Card>
          <CardHeader><CardTitle>Plan details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Plan name" error={errors.name?.message} required>
                <Input placeholder="Monthly Basic" {...register("name")} className={cn(errors.name && "border-destructive")} />
              </Field>
            </div>
            <Field label="Duration type" required>
              <select {...register("duration")} className={selectCls}>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half_yearly">Half Yearly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </Field>
            <Field label="Duration (days)" error={errors.durationDays?.message} required>
              <Input type="number" min={1} {...register("durationDays")} disabled={duration !== "custom"} className={cn(errors.durationDays && "border-destructive")} />
            </Field>
            <Field label="Price (₹)" error={errors.price?.message} required>
              <Input type="number" min={0} placeholder="1499" {...register("price")} className={cn(errors.price && "border-destructive")} />
            </Field>
            <Field label="Discount (%)" error={errors.discount?.message}>
              <Input type="number" min={0} max={100} placeholder="0" {...register("discount")} />
            </Field>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Features</CardTitle>
              <Button type="button" variant="outline" size="sm" className="gap-1 h-7 text-xs"
                onClick={() => setFeatureList(f => [...f, { value: "" }])}>
                <Plus className="h-3 w-3" />Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {featureList.map((f, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={f.value}
                  onChange={e => setFeatureList(list => list.map((item, idx) => idx === i ? { value: e.target.value } : item))}
                  placeholder={`Feature ${i + 1}`}
                  className="flex-1"
                />
                {featureList.length > 1 && (
                  <Button type="button" variant="ghost" size="icon-sm"
                    onClick={() => setFeatureList(list => list.filter((_, idx) => idx !== i))}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Freeze */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Allow freeze</p>
                <p className="text-xs text-muted-foreground">Members can pause their membership</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={freezeAllowed}
                onClick={() => setValue("freezeAllowed", !freezeAllowed)}
                className={cn("relative h-5 w-9 rounded-full transition-colors",
                  freezeAllowed ? "bg-brand" : "bg-muted"
                )}
              >
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  freezeAllowed ? "translate-x-4" : "translate-x-0.5"
                )} />
              </button>
            </div>
            {freezeAllowed && (
              <Field label="Max freeze days" error={errors.freezeDays?.message}>
                <Input type="number" min={0} placeholder="14" {...register("freezeDays")} className="w-32" />
              </Field>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end pb-6">
          <Link href="/plans"><Button variant="outline" type="button">Cancel</Button></Link>
          <Button variant="brand" type="submit" loading={mutation.isPending}>Create plan</Button>
        </div>
      </form>
    </div>
  );
}

// Need React import for useState
import React from "react";
