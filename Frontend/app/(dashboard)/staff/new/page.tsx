"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffService } from "@/services";
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
  role: z.enum(["receptionist", "manager", "cleaner", "maintenance", "other"]),
  branchId: z.string().min(1, "Select a branch"),
  salary: z.coerce.number().min(1000, "Enter monthly salary"),
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

export default function NewStaffPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "receptionist", salary: 18000 },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => staffService.createStaff({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      branchId: data.branchId,
      salary: data.salary,
    }),
    onSuccess: () => {
      toast.success("Staff member added");
      qc.invalidateQueries({ queryKey: ["staff"] });
      router.push("/staff");
    },
    onError: () => toast.error("Failed to add staff"),
  });

  return (
    <div className="max-w-xl space-y-5 animate-fade-in">
      <PageHeader
        title="Add staff"
        breadcrumb={["Staff", "New staff"]}
        action={<Link href="/staff"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4" />Back</Button></Link>}
      />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Staff information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Full name" error={errors.name?.message} required>
                <Input placeholder="Suresh Kumar" {...register("name")} className={cn(errors.name && "border-destructive")} />
              </Field>
            </div>
            <Field label="Email" error={errors.email?.message} required>
              <Input type="email" placeholder="staff@gym.com" {...register("email")} className={cn(errors.email && "border-destructive")} />
            </Field>
            <Field label="Phone" error={errors.phone?.message} required>
              <Input placeholder="+91-9876543210" {...register("phone")} className={cn(errors.phone && "border-destructive")} />
            </Field>
            <Field label="Role" error={errors.role?.message} required>
              <select {...register("role")} className={selectCls}>
                <option value="receptionist">Receptionist</option>
                <option value="manager">Manager</option>
                <option value="cleaner">Cleaner</option>
                <option value="maintenance">Maintenance</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="Branch" error={errors.branchId?.message} required>
              <select {...register("branchId")} className={cn(selectCls, errors.branchId && "border-destructive")}>
                <option value="">Select branch</option>
                {mockBranches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Monthly salary (₹)" error={errors.salary?.message} required>
                <Input type="number" min={0} {...register("salary")} className={cn(errors.salary && "border-destructive")} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end pb-6">
          <Link href="/staff"><Button variant="outline" type="button">Cancel</Button></Link>
          <Button variant="brand" type="submit" loading={isSubmitting || mutation.isPending}>Add staff</Button>
        </div>
      </form>
    </div>
  );
}
