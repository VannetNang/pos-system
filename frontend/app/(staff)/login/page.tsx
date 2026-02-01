"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockKeyhole, ShieldAlert, ShieldUser } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { submitLoginForm } from "@/actions/submitLoginForm";
import { cn } from "@/lib/utils";

const Login = () => {
  const [state, formAction, isPending] = useActionState(submitLoginForm, null);

  return (
    <div className="flex-center pt-10 lg:pt-20">
      <Card className="w-[80%] md:w-full pt-0 sm:max-w-md shadow-lg">
        {/* logo */}
        <CardHeader className="space-y-1 text-center py-6 bg-black rounded-t-xl">
          <CardTitle className="flex-center">
            <ShieldUser width={45} height={45} fill="white" />
          </CardTitle>
          <p className="text-sm font-semibold text-white">
            SECURE TERMINAL ACCESS
          </p>
        </CardHeader>

        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">System Login</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the POS System
          </p>
        </CardHeader>

        {/* form validation */}
        <CardContent>
          <form autoComplete="on" action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className={cn(state?.errors?.email && "text-red-600")}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="voki@example.com"
                  autoComplete="email"
                  aria-invalid={!!state?.errors?.email}
                />

                {state?.errors?.email && (
                  <p className="error">{state.errors.email[0]}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className={cn(state?.errors?.password && "text-red-600")}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="********"
                  aria-invalid={!!state?.errors?.password}
                />

                {state?.errors?.password && (
                  <p className="error">{state.errors.password[0]}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10"
                disabled={isPending}
              >
                Login
              </Button>
            </div>
          </form>

          {state?.message && (
            <div className="bg-destructive/10 border-destructive/20 border border-solid mt-6 rounded-md p-4 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-center mb-2">
                <ShieldAlert
                  width={35}
                  height={35}
                  className="text-destructive"
                />
              </div>
              <p className="text-destructive font-semibold text-sm text-center mt-3">
                {state.message}
              </p>
            </div>
          )}
        </CardContent>

        <hr className="h-1 w-full" />

        <CardFooter className="flex flex-col gap-4">
          <div className="flex-center text-xs text-muted-foreground gap-2">
            <LockKeyhole width={15} height={15} />
            <span className="font-semibold">AUTHORIZED PERSONAL ONLY</span>
          </div>

          {/* warning paragraph */}
          <div className="text-xs text-center italic text-slate-400">
            Warning: This system is for authorized users only. All access
            attempts and activities are logged for security compliance.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
