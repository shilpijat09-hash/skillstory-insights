import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/services/profile";
import type { ProfileUpdate } from "@/types/profile";
import { useAuth } from "./use-auth";

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: ProfileUpdate) => updateProfile(user!.id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile", user?.id] }),
  });
}
