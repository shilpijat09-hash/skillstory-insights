import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({ validateSearch: z.object({ email: z.string().email().optional(), confirmed: z.string().optional() }), component: VerifyEmail });
function VerifyEmail() {
  const { email, confirmed } = Route.useSearch(); const [busy, setBusy] = useState(false);
  async function resend() { if (!email) return; setBusy(true); try { const { error } = await supabase.auth.resend({ type: "signup", email }); if (error) toast.error("Could not resend confirmation", { description: error.message }); else toast.success("Confirmation email sent"); } catch (error) { toast.error("Could not resend confirmation", { description: error instanceof Error ? error.message : "Please try again." }); } finally { setBusy(false); } }
  return <AuthShell title={confirmed ? "Email confirmed" : "Check your email"} description={confirmed ? "Your email confirmation link was opened. Continue to sign in to your account." : `We sent a confirmation link${email ? ` to ${email}` : ""}. Open it to verify your email address.`} footer={<Link to="/auth" className="font-medium text-primary hover:underline">Back to sign in</Link>}>
    <div className="flex flex-col items-center gap-4 rounded-xl border bg-muted/30 p-6 text-center"><MailCheck className="size-9 text-primary"/><p className="text-sm text-muted-foreground">If you don’t see the message, check your spam folder.</p>{email && !confirmed && <Button variant="outline" className="w-full" onClick={() => void resend()} disabled={busy}>{busy && <Loader2 className="animate-spin"/>}Resend confirmation email</Button>}<Button asChild className="w-full"><Link to="/auth">Continue to sign in</Link></Button></div>
  </AuthShell>;
}
