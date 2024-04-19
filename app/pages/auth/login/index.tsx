import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import background from "./assets/background.jpg";

export default function Login() {
  const { data: session } = useSession();

  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  /* FORM VALIDATION */
  const validateUsername = (usernameToValidate: string) => {
    setIsUsernameValid(usernameToValidate.length > 3);
  };

  const validatePassword = (passwordToValidate: string) => {
    setIsPasswordValid(passwordToValidate.length > 8);
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const req = await signIn("credentials", {
        /* redirect: false, */
        username: username,
        password: password,
        callbackUrl: "/dashboard",
      });

      if (req.ok) {
        setSent(true);
        setUsername("");
        setPassword("");
      } else {
        setFormError(req.error || "Please try again");
      }
      setSubmitting(false);
    } catch (error) {
      setFormError(error);
      setSubmitting(false);
    }
  };

  console.log("session", session);

  if (session) {
    return (
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Signed in as {session.user.email}
              </p>
              <button onClick={() => signOut()}>Sign out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form method="post" action="/api/auth/callback/credentials">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>

            {formError && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="username"
                  type="username"
                  value={username}
                  placeholder="paulopinho"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUsername(e.target.value);
                    validateUsername(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="w-full"
                onClick={handleLogin}
                disabled={!isUsernameValid || !isPasswordValid || submitting}
              >
                Login
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>

            <div className="text-center text-sm">
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src={background.src}
            alt="Login"
            width={background.width}
            height={background.height}
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </form>
  );
}
