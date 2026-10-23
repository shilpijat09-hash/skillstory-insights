export interface Profile {
  id: string;
  fullName: string | null;
  headline: string | null;
  targetRole: string | null;
  location: string | null;
  avatarUrl: string | null;
  emailNotifications: boolean;
  productUpdates: boolean;
}

export type ProfileUpdate = Partial<Omit<Profile, "id">>;
