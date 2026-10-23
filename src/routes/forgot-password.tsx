import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPassword });
function ForgotPassword() {
  const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  async function submit(e: FormEvent) { e.preventDefault(); setError(""); const parsed = z.string().trim().email().safeParse(email); if (!parsed.success) return setError("Enter a valid email address."); setBusy(true); try { const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, { redirectTo: `${window.location.origin}/reset-password` }); if (error) setError(error.message); else setSent(true); } catch (e) { setError(e instanceof Error ? e.message : "Could not send the reset email."); } finally { setBusy(false); } }
  return <AuthShell title={sent ? "Check your inbox" : "Reset your password"} description={sent ? "If an account exists for that address, a reset link is on its way." : "Enter your account email and we’ll send a password reset link."} footer={<Link to="/auth" className="inline-flex items-center gap-1 font-medium text-primary hover:underline"><ArrowLeft size={14}/> Back to sign in</Link>}>
    {sent ? <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-6 text-center"><MailCheck className="size-8 text-primary"/><p className="text-sm text-muted-foreground">Check your spam folder if the message doesn’t arrive.</p><Button variant="outline" onClick={() => setSent(false)}>Send another link</Button></div> : <form onSubmit={submit} className="space-y-4" noValidate><div className="space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>{error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}<Button className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin"/>}Send reset link</Button></form>}
  </AuthShell>;
}
