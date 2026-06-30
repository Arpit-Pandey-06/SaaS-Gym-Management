"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Card, CardContent } from "@/components/ui";
import { Dumbbell, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "arpit@fitsaas.com", password: "password123" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authService.login(data.email, data.password);
      setAuth(result.user, result.token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 justify-center mb-8">
        <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center">
          <Link href="/"><Dumbbell className="h-5 w-5 text-white" /></Link>
        </div>
        <span className="text-xl font-semibold">FitSaaS</span>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="text-center">
            <h1 className="text-lg font-semibold">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1">Access your gym dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@gym.com"
                {...register("email")}
                className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-brand hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn("pr-10", errors.password && "border-destructive focus-visible:ring-destructive")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="brand" className="w-full" loading={isSubmitting}>
              Sign in
            </Button>
          </form>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground text-center font-medium mb-1">Demo credentials</p>
            <p className="text-xs text-center text-muted-foreground">arpit@fitsaas.com / password123</p>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground mt-6">
        © {new Date().getFullYear()} FitSaaS. All rights reserved.
      </p>
    </div>
  );
}
