import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Divider } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import { safeRedirect } from "@/lib/redirect";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — ResumeIQ" },
      { name: "description", content: "Sign in to ResumeIQ with email and password, Google or a one-time email code." },
      { property: "og:title", content: "Sign in — ResumeIQ" },
      { property: "og:description", content: "Access your resume analyses and reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

const OTP_LENGTH = 6;
const emailSchema = z.string().trim().email("Enter a valid email address.");

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const destination = safeRedirect(redirect);

  useEffect(() => {
    if (!loading && session) navigate({ to: destination, replace: true });
  }, [loading, session, destination, navigate]);

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to review your resumes and reports."
      footer={
        <>
          New to ResumeIQ?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton />
      <Divider />
      <Tabs defaultValue="password">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="code">Email code</TabsTrigger>
        </TabsList>
        <TabsContent value="password" className="mt-6">
          <PasswordForm />
        </TabsContent>
        <TabsContent value="code" className="mt-6">
          <OtpForm />
        </TabsContent>
      </Tabs>
    </AuthShell>
  );
}

function PasswordForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setUnconfirmed(false);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    if (!password) return setError("Enter your password.");

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: parsed.data, password });
    setSubmitting(false);
    if (error) {
      if (/not confirmed/i.test(error.message)) {
        setUnconfirmed(true);
        setError("Please confirm your email address before signing in.");
      } else if (/invalid login/i.test(error.message)) {
        setError("Incorrect email or password.");
      } else {
        setError(error.message);
      }
      return;
    }
    toast.success("Signed in");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>
            {error}{" "}
            {unconfirmed && (
              <Link to="/verify-email" search={{ email }} className="font-medium underline">
                Resend confirmation
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-10"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="h-10 w-full" disabled={submitting}>
        {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
        Sign in
      </Button>
    </form>
  );
}

function OtpForm() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    setError(null);
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth` },
    });
    setBusy(false);
    if (error) {
      setError(
        /signups not allowed|not found/i.test(error.message)
          ? "We couldn't find an account for that email. Create one first."
          : error.message,
      );
      return;
    }
    setStep("code");
    setCooldown(60);
    toast.success("Check your inbox", { description: `We sent a sign-in email to ${parsed.data}.` });
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.length !== OTP_LENGTH) return setError(`Enter the ${OTP_LENGTH}-digit code.`);
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code, type: "email" });
    setBusy(false);
    if (error) {
      setError(/expired|invalid/i.test(error.message) ? "That code is invalid or has expired." : error.message);
      return;
    }
    toast.success("Signed in");
  };

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="space-y-4" noValidate>
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="otp-email">Email</Label>
          <Input
            id="otp-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">We'll email you a one-time code — no password needed.</p>
        </div>
        <Button type="submit" className="h-10 w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Mail aria-hidden="true" />}
          Send sign-in code
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className="space-y-5" noValidate>
      <button
        type="button"
        onClick={() => {
          setStep("email");
          setCode("");
          setError(null);
        }}
        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3" aria-hidden="true" /> Use a different email
      </button>
      <p className="text-sm text-muted-foreground">
        Enter the code sent to <span className="font-medium text-foreground">{email}</span>. If the email contains a link
        instead, simply click it.
      </p>
      {error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-center">
        <InputOTP maxLength={OTP_LENGTH} value={code} onChange={setCode} aria-label="One-time code" autoFocus>
          <InputOTPGroup>
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <InputOTPSlot key={i} index={i} className="size-11 text-base" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button type="submit" className="h-10 w-full" disabled={busy || code.length !== OTP_LENGTH}>
        {busy && <Loader2 className="animate-spin" aria-hidden="true" />}
        Verify and sign in
      </Button>
      <Button type="button" variant="ghost" className="w-full" disabled={cooldown > 0 || busy} onClick={() => sendCode()}>
        {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
      </Button>
    </form>
  );
}
