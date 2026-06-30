"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Textarea, PageHeader } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockBranches, mockPlans, mockTrainers } from "@/mock/data";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  branchId: z.string().min(1, "Select a branch"),
  planId: z.string().min(1, "Select a membership plan"),
  trainerId: z.string().optional(),
  emergencyName: z.string().min(2, "Emergency contact name required"),
  emergencyPhone: z.string().min(10, "Emergency phone required"),
  emergencyRelation: z.string().min(1, "Relation required"),
  medicalNotes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function FormField({ label, error, children, required }: { label: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}{required && <span className="text-destructive ml-0.5">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function NewMemberPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: "male", branchId: "", planId: "", trainerId: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const plan = mockPlans.find(p => p.id === data.planId);
      const trainer = mockTrainers.find(t => t.id === data.trainerId);
      const joinDate = new Date();
      const expiryDate = new Date(joinDate);
      expiryDate.setDate(expiryDate.getDate() + (plan?.durationDays ?? 30));
      return memberService.createMember({
        name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        branchId: data.branchId,
        planId: data.planId,
        planName: plan?.name,
        trainerId: data.trainerId || undefined,
        trainerName: trainer?.name,
        expiryDate: expiryDate.toISOString().split("T")[0],
        emergencyContact: { name: data.emergencyName, phone: data.emergencyPhone, relation: data.emergencyRelation },
        medicalNotes: data.medicalNotes || undefined,
      });
    },
    onSuccess: (m) => {
      toast.success("Member added successfully");
      qc.invalidateQueries({ queryKey: ["members"] });
      router.push(`/members/${m.id}`);
    },
    onError: () => toast.error("Failed to add member"),
  });

  const selectClass = "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <PageHeader
        title="Add member"
        description="Create a new gym membership"
        breadcrumb={["Members", "New member"]}
        action={
          <Link href="/members">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" />Back
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        {/* Personal Info */}
        <Card>
          <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField label="Full name" error={errors.name?.message} required>
                <Input placeholder="Rahul Sharma" {...register("name")} className={cn(errors.name && "border-destructive")} />
              </FormField>
            </div>
            <FormField label="Email" error={errors.email?.message} required>
              <Input type="email" placeholder="rahul@gmail.com" {...register("email")} className={cn(errors.email && "border-destructive")} />
            </FormField>
            <FormField label="Phone" error={errors.phone?.message} required>
              <Input placeholder="+91-9876543210" {...register("phone")} className={cn(errors.phone && "border-destructive")} />
            </FormField>
            <FormField label="Gender" error={errors.gender?.message} required>
              <select {...register("gender")} className={cn(selectClass, errors.gender && "border-destructive")}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Date of birth" error={errors.dateOfBirth?.message} required>
              <Input type="date" {...register("dateOfBirth")} className={cn(errors.dateOfBirth && "border-destructive")} />
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Address" error={errors.address?.message} required>
                <Input placeholder="123, MG Road, New Delhi" {...register("address")} className={cn(errors.address && "border-destructive")} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Membership */}
        <Card>
          <CardHeader><CardTitle>Membership details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Branch" error={errors.branchId?.message} required>
              <select {...register("branchId")} className={cn(selectClass, errors.branchId && "border-destructive")}>
                <option value="">Select branch</option>
                {mockBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </FormField>
            <FormField label="Membership plan" error={errors.planId?.message} required>
              <select {...register("planId")} className={cn(selectClass, errors.planId && "border-destructive")}>
                <option value="">Select plan</option>
                {mockPlans.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{p.price}</option>)}
              </select>
            </FormField>
            <div className="sm:col-span-2">
              <FormField label="Assign trainer (optional)" error={errors.trainerId?.message}>
                <select {...register("trainerId")} className={selectClass}>
                  <option value="">No trainer assigned</option>
                  {mockTrainers.filter(t => t.status === "active").map(t => (
                    <option key={t.id} value={t.id}>{t.name} — {t.specialization.join(", ")}</option>
                  ))}
                </select>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader><CardTitle>Emergency contact</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Contact name" error={errors.emergencyName?.message} required>
              <Input placeholder="Priya Sharma" {...register("emergencyName")} className={cn(errors.emergencyName && "border-destructive")} />
            </FormField>
            <FormField label="Contact phone" error={errors.emergencyPhone?.message} required>
              <Input placeholder="+91-9876543210" {...register("emergencyPhone")} className={cn(errors.emergencyPhone && "border-destructive")} />
            </FormField>
            <FormField label="Relation" error={errors.emergencyRelation?.message} required>
              <select {...register("emergencyRelation")} className={cn(selectClass, errors.emergencyRelation && "border-destructive")}>
                <option value="">Select relation</option>
                {["Spouse", "Parent", "Sibling", "Friend", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FormField>
          </CardContent>
        </Card>

        {/* Medical Notes */}
        <Card>
          <CardHeader><CardTitle>Medical notes (optional)</CardTitle></CardHeader>
          <CardContent>
            <Textarea placeholder="Any medical conditions, injuries, or dietary restrictions the trainer should know about…" rows={3} {...register("medicalNotes")} />
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end pb-6">
          <Link href="/members"><Button variant="outline" type="button">Cancel</Button></Link>
          <Button variant="brand" type="submit" loading={isSubmitting || mutation.isPending}>
            Add member
          </Button>
        </div>
      </form>
    </div>
  );
}
