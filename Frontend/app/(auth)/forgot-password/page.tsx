"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services";
import { Button, Input, Label, Card, CardContent } from "@/components/ui";
import { Dumbbell, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await authService.forgotPassword(data.email);
    setSent(true);
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center gap-2.5 justify-center mb-8">
        <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-semibold">FitSaaS</span>
      </div>

      <Card>
        <CardContent className="p-6">
          {sent ? (
            <div className="text-center space-y-3 py-4">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
              <h2 className="font-semibold">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a reset link to <strong>{getValues("email")}</strong>
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full mt-2">Back to sign in</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h1 className="text-lg font-semibold">Reset password</h1>
                <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send a reset link.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@gym.com"
                    {...register("email")}
                    className={cn(errors.email && "border-destructive")}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" variant="brand" className="w-full" loading={isSubmitting}>
                  Send reset link
                </Button>
              </form>
              <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
