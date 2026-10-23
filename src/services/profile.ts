import { supabase } from "@/integrations/supabase/client";
import type { Profile, ProfileUpdate } from "@/types/profile";

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  return {
    id: userId,
    fullName: data?.full_name ?? null,
    headline: data?.headline ?? null,
    targetRole: data?.target_role ?? null,
    location: data?.location ?? null,
    avatarUrl: data?.avatar_url ?? null,
    emailNotifications: data?.email_notifications ?? true,
    productUpdates: data?.product_updates ?? false,
  };
}

export async function updateProfile(userId: string, patch: ProfileUpdate): Promise<void> {
  const values: Record<string, unknown> = { id: userId };
  if (patch.fullName !== undefined) values.full_name = patch.fullName;
  if (patch.headline !== undefined) values.headline = patch.headline;
  if (patch.targetRole !== undefined) values.target_role = patch.targetRole;
  if (patch.location !== undefined) values.location = patch.location;
  if (patch.avatarUrl !== undefined) values.avatar_url = patch.avatarUrl;
  if (patch.emailNotifications !== undefined) values.email_notifications = patch.emailNotifications;
  if (patch.productUpdates !== undefined) values.product_updates = patch.productUpdates;
  const { error } = await supabase
    .from("profiles")
    .upsert(values as { id: string }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}
