import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/reset-password")({ component: ResetPassword });
function ResetPassword() {
  const navigate = useNavigate(); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [done, setDone] = useState(false); const [ready, setReady] = useState(false);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setReady(!!data.session)); }, []);
  async function submit(e: FormEvent) { e.preventDefault(); setError(""); const parsed = z.string().min(8, "Use at least 8 characters.").max(72).safeParse(password); if (!parsed.success) return setError(parsed.error.issues[0].message); if (password !== confirm) return setError("Passwords don’t match."); setBusy(true); try { const { error } = await supabase.auth.updateUser({ password }); if (error) setError(error.message); else { setDone(true); setTimeout(() => void navigate({ to: "/dashboard", replace: true }), 1200); } } catch (e) { setError(e instanceof Error ? e.message : "Could not update password."); } finally { setBusy(false); } }
  return <AuthShell title="Choose a new password" description="Use at least 8 characters for your account password." footer={<Link to="/auth" className="font-medium text-primary hover:underline">Back to sign in</Link>}>
    {!ready ? <div className="space-y-4"><Alert variant="destructive"><AlertDescription>The reset link is missing or expired. Request a new reset link to continue.</AlertDescription></Alert><Button asChild className="w-full"><Link to="/forgot-password">Request a new link</Link></Button></div> : done ? <Alert><AlertDescription>Password updated. Taking you to your dashboard…</AlertDescription></Alert> : <form onSubmit={submit} className="space-y-4" noValidate><div className="space-y-2"><Label htmlFor="new-password">New password</Label><PasswordInput id="new-password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}/></div><div className="space-y-2"><Label htmlFor="confirm-password">Confirm password</Label><PasswordInput id="confirm-password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)}/></div>{error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}<Button className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin"/>}Update password</Button></form>}
  </AuthShell>;
}
