import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useAuth } from "@/hooks/use-auth";
import { requireAuthenticated } from "@/lib/route-auth";

export const Route = createFileRoute("/_authenticated/settings")({ ssr: false, beforeLoad: requireAuthenticated, component: SettingsPage });
function SettingsPage() {
  const { user } = useAuth(); const profile = useProfile(); const update = useUpdateProfile();
  const [values, setValues] = useState({ fullName: "", headline: "", targetRole: "", location: "", emailNotifications: true, productUpdates: false });
  useEffect(() => { if (profile.data) setValues({ fullName: profile.data.fullName ?? "", headline: profile.data.headline ?? "", targetRole: profile.data.targetRole ?? "", location: profile.data.location ?? "", emailNotifications: profile.data.emailNotifications, productUpdates: profile.data.productUpdates }); }, [profile.data]);
  async function submit(e: FormEvent) { e.preventDefault(); if (values.fullName.trim().length < 2) return toast.error("Name must be at least 2 characters."); try { await update.mutateAsync({ ...values, fullName: values.fullName.trim() }); toast.success("Profile updated"); } catch (e) { toast.error(e instanceof Error ? e.message : "Could not update profile"); } }
  if (profile.isLoading) return <AppShell><Card role="status" className="p-8">Loading your profile…</Card></AppShell>;
  if (profile.isError) return <AppShell><Card className="p-6"><p className="text-sm text-destructive">Could not load profile: {(profile.error as Error).message}</p><Button className="mt-3" variant="outline" onClick={() => void profile.refetch()}>Try again</Button></Card></AppShell>;
  return <AppShell><PageHeader title="Profile & settings" description="Manage your profile details and email preferences."/>
    <form onSubmit={submit} className="max-w-3xl space-y-6"><Card className="space-y-5 p-5 sm:p-7"><div><h2 className="font-semibold">Profile</h2><p className="text-sm text-muted-foreground">These details help organize your reviews.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="profile-name">Full name</Label><Input id="profile-name" required minLength={2} maxLength={100} value={values.fullName} onChange={(e) => setValues({ ...values, fullName: e.target.value })}/></div><div className="space-y-2"><Label htmlFor="profile-email">Account email</Label><Input id="profile-email" value={user?.email ?? ""} readOnly aria-describedby="email-note"/><p id="email-note" className="text-xs text-muted-foreground">Email changes are managed by your identity provider.</p></div><div className="space-y-2"><Label htmlFor="profile-headline">Headline</Label><Input id="profile-headline" maxLength={160} value={values.headline} onChange={(e) => setValues({ ...values, headline: e.target.value })} placeholder="Product designer building useful tools"/></div><div className="space-y-2"><Label htmlFor="target-role">Target role</Label><Input id="target-role" maxLength={120} value={values.targetRole} onChange={(e) => setValues({ ...values, targetRole: e.target.value })} placeholder="e.g. Senior Product Designer"/></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="location">Location</Label><Input id="location" maxLength={120} value={values.location} onChange={(e) => setValues({ ...values, location: e.target.value })} placeholder="City or region"/></div></div></Card>
      <Card className="space-y-5 p-5 sm:p-7"><div><h2 className="font-semibold">Email preferences</h2><p className="text-sm text-muted-foreground">Save your preferences for a future notification service.</p></div><Preference title="Analysis notifications" description="Preference for review and report updates." checked={values.emailNotifications} onCheckedChange={(v) => setValues({ ...values, emailNotifications: v })}/><Preference title="Product updates" description="Preference for occasional product news." checked={values.productUpdates} onCheckedChange={(v) => setValues({ ...values, productUpdates: v })}/></Card>
      {update.isError && <Alert variant="destructive"><AlertDescription>{(update.error as Error).message}</AlertDescription></Alert>}<div className="flex justify-end"><Button type="submit" disabled={update.isPending}>{update.isPending ? <Loader2 className="animate-spin"/> : <Check/>} Save changes</Button></div>
    </form></AppShell>;
}
function Preference({ title, description, checked, onCheckedChange }: { title: string; description: string; checked: boolean; onCheckedChange: (v: boolean) => void }) { return <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">{title}</p><p className="text-xs text-muted-foreground">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title}/></div>; }
