"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { branchService } from "@/services";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Branch name required"),
  address: z.string().min(5, "Address required"),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
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

export default function NewBranchPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => branchService.createBranch(data),
    onSuccess: (b) => {
      toast.success("Branch created");
      qc.invalidateQueries({ queryKey: ["branches"] });
      router.push(`/branches/${b.id}`);
    },
    onError: () => toast.error("Failed to create branch"),
  });

  return (
    <div className="max-w-xl space-y-5 animate-fade-in">
      <PageHeader
        title="Add branch"
        breadcrumb={["Branches", "New branch"]}
        action={<Link href="/branches"><Button variant="ghost" size="sm" className="gap-1.5"><ArrowLeft className="h-4 w-4" />Back</Button></Link>}
      />

      <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Branch information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Branch name" error={errors.name?.message} required>
                <Input placeholder="Connaught Place" {...register("name")} className={cn(errors.name && "border-destructive")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Address" error={errors.address?.message} required>
                <Input placeholder="Block C, CP, New Delhi 110001" {...register("address")} className={cn(errors.address && "border-destructive")} />
              </Field>
            </div>
            <Field label="Phone" error={errors.phone?.message} required>
              <Input placeholder="+91-11-4567-8901" {...register("phone")} className={cn(errors.phone && "border-destructive")} />
            </Field>
            <Field label="Email" error={errors.email?.message} required>
              <Input type="email" placeholder="branch@gym.com" {...register("email")} className={cn(errors.email && "border-destructive")} />
            </Field>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end pb-6">
          <Link href="/branches"><Button variant="outline" type="button">Cancel</Button></Link>
          <Button variant="brand" type="submit" loading={isSubmitting || mutation.isPending}>Create branch</Button>
        </div>
      </form>
    </div>
  );
}
