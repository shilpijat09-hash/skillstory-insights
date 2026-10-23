import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Divider } from "@/components/auth/auth-shell";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordInput, PasswordStrength } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/auth/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — ResumeIQ" },
      { name: "description", content: "Create a free ResumeIQ account to get AI-powered resume reviews." },
      { property: "og:title", content: "Create your account — ResumeIQ" },
      { property: "og:description", content: "Start reviewing your resume against real job descriptions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignupPage,
});

const schema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(100),
    email: z.string().trim().email("Enter a valid email address.").max(255),
    password: z.string().min(8, "Use at least 8 characters.").max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match.", path: ["confirm"] });

type Errors = Partial<Record<"fullName" | "email" | "password" | "confirm" | "form", string>>;

function SignupPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [values, setValues] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  const set = (k: keyof typeof values) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    let data: Awaited<ReturnType<typeof supabase.auth.signUp>>["data"];
    let error: Awaited<ReturnType<typeof supabase.auth.signUp>>["error"];
    try {
      ({ data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email?confirmed=1`,
          data: { full_name: parsed.data.fullName },
        },
      }));
    } catch (err) {
      setSubmitting(false);
      setErrors({ form: err instanceof Error ? err.message : "Could not create your account. Please try again." });
      return;
    }
    setSubmitting(false);
    if (error) {
      setErrors({ form: /already registered/i.test(error.message) ? "An account with this email already exists." : error.message });
      return;
    }
    if (data.session) {
      navigate({ to: "/dashboard", replace: true });
      return;
    }
    navigate({ to: "/verify-email", search: { email: parsed.data.email } });
  };

  return (
    <AuthShell
      title="Create your account"
      description="Get a detailed review of your resume for any role."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {errors.form && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>
              {errors.form}{" "}
              {errors.form.includes("already exists") && (
                <Link to="/auth" className="font-medium underline">
                  Sign in instead
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}
        <Field id="su-name" label="Full name" error={errors.fullName}>
          <Input id="su-name" autoComplete="name" className="h-10" value={values.fullName} onChange={set("fullName")} aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "su-name-err" : undefined} />
        </Field>
        <Field id="su-email" label="Email" error={errors.email}>
          <Input id="su-email" type="email" autoComplete="email" placeholder="you@example.com" className="h-10" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "su-email-err" : undefined} />
        </Field>
        <Field id="su-password" label="Password" error={errors.password}>
          <PasswordInput id="su-password" autoComplete="new-password" value={values.password} onChange={set("password")} aria-invalid={!!errors.password} aria-describedby={errors.password ? "su-password-err" : undefined} />
          <PasswordStrength password={values.password} />
        </Field>
        <Field id="su-confirm" label="Confirm password" error={errors.confirm}>
          <PasswordInput id="su-confirm" autoComplete="new-password" value={values.confirm} onChange={set("confirm")} aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? "su-confirm-err" : undefined} />
        </Field>
        <Button type="submit" className="h-10 w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
          Create account
        </Button>
        <p className="text-center text-xs text-muted-foreground">We'll send a confirmation link to verify your email.</p>
      </form>
    </AuthShell>
  );
}
