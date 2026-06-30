"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainerService } from "@/services";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockBranches } from "@/mock/data";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  gender: z.enum(["male", "female", "other"]),
  branchId: z.string().min(1, "Select a branch"),
  experience: z.coerce.number().min(0, "Enter experience in years"),
  salary: z.coerce.number().min(1000, "Enter monthly salary"),
  specialization: z.string().min(1, "At least one specialization required"),
});
type FormData = z.infer<typeof schema>;

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

export default function NewTrainerPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: "male", experience: 1, salary: 25000 },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => trainerService.createTrainer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      branchId: data.branchId,
      experience: data.experience,
      salary: data.salary,
      specialization: data.specialization.split(",").map(s => s.trim()).filter(Boolean),
    }),
    onSuccess: (t) => {
      toast.success("Trainer added");
      qc.invalidateQueries({ queryKey: ["trainers"] });
      router.push(`/trainers/${t.id}`);
    },
    onError: () => toast.error("Failed to add trainer"),
  });

  return (
    <div className="max-w-xl space-y-5 animate-fade-in">
      <PageHeader
        title="Add trainer"
        breadcrumb={["Trainers", "New trainer"]}
        action={<Link href="/trainers"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4" />Back</Button></Link>}
      />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Full name" error={errors.name?.message} required>
                <Input placeholder="Rahul Verma" {...register("name")} className={cn(errors.name && "border-destructive")} />
              </Field>
            </div>
            <Field label="Email" error={errors.email?.message} required>
              <Input type="email" placeholder="trainer@gym.com" {...register("email")} className={cn(errors.email && "border-destructive")} />
            </Field>
            <Field label="Phone" error={errors.phone?.message} required>
              <Input placeholder="+91-9876543210" {...register("phone")} className={cn(errors.phone && "border-destructive")} />
            </Field>
            <Field label="Gender" error={errors.gender?.message} required>
              <select {...register("gender")} className={selectCls}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Branch" error={errors.branchId?.message} required>
              <select {...register("branchId")} className={cn(selectCls, errors.branchId && "border-destructive")}>
                <option value="">Select branch</option>
                {mockBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Professional details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Experience (years)" error={errors.experience?.message} required>
              <Input type="number" min={0} {...register("experience")} className={cn(errors.experience && "border-destructive")} />
            </Field>
            <Field label="Monthly salary (₹)" error={errors.salary?.message} required>
              <Input type="number" min={0} {...register("salary")} className={cn(errors.salary && "border-destructive")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Specializations" error={errors.specialization?.message} required>
                <Input placeholder="Weight Training, Cardio, Yoga (comma separated)" {...register("specialization")} className={cn(errors.specialization && "border-destructive")} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end pb-6">
          <Link href="/trainers"><Button variant="outline" type="button">Cancel</Button></Link>
          <Button variant="brand" type="submit" loading={isSubmitting || mutation.isPending}>Add trainer</Button>
        </div>
      </form>
    </div>
  );
}
