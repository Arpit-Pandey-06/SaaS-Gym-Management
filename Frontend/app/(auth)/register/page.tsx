"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Card, CardContent } from "@/components/ui";
import { Dumbbell, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  full_name: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  gym_name: z.string().min(2, "Gym name required"),
  business_email: z.string().email("Valid business email required"),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register(data);
      setDone(true);
      toast.success("Account created! Please sign in.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-lg font-semibold">Account created!</h2>
        <p className="text-sm text-muted-foreground mt-1">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2.5 justify-center mb-8">
        <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-semibold">FitSaaS</span>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="text-center">
            <h1 className="text-lg font-semibold">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Start your 14-day free trial</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Owner name */}
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input placeholder="Rahul Mishra" {...register("full_name")}
                className={cn(errors.full_name && "border-destructive")} />
              {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
            </div>

            {/* Owner email */}
            <div className="space-y-1.5">
              <Label>Your email</Label>
              <Input type="email" placeholder="rahul@email.com" {...register("email")}
                className={cn(errors.email && "border-destructive")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} placeholder="Password@123"
                  {...register("password")} className={cn("pr-10", errors.password && "border-destructive")} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Gym name */}
            <div className="space-y-1.5">
              <Label>Gym name</Label>
              <Input placeholder="Cult Fit" {...register("gym_name")}
                className={cn(errors.gym_name && "border-destructive")} />
              {errors.gym_name && <p className="text-xs text-destructive">{errors.gym_name.message}</p>}
            </div>

            {/* Business email */}
            <div className="space-y-1.5">
              <Label>Business email</Label>
              <Input type="email" placeholder="cultfit@gmail.com" {...register("business_email")}
                className={cn(errors.business_email && "border-destructive")} />
              {errors.business_email && <p className="text-xs text-destructive">{errors.business_email.message}</p>}
            </div>

            <Button type="submit" variant="brand" className="w-full" loading={isSubmitting}>
              Create account
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-brand hover:underline font-medium">Sign in</Link>
          </p>
          <p className="text-[10px] text-center text-muted-foreground">
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
