import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analysisProvider } from "@/services/analysis";
import { getSampleAnalysis, isSampleId } from "@/data/sample-analyses";
import type { Analysis, NewAnalysisInput } from "@/types/analysis";

export const analysesQueryOptions = queryOptions({
  queryKey: ["analyses"],
  queryFn: () => analysisProvider.list(),
});

export function useAnalyses() {
  return useQuery(analysesQueryOptions);
}

async function fetchAnalysis(id: string): Promise<Analysis | null> {
  if (isSampleId(id)) return getSampleAnalysis(id);
  return analysisProvider.getAnalysis(id);
}

export function useAnalysis(id: string, opts: { poll?: boolean } = {}) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => fetchAnalysis(id),
    refetchInterval: (query) => {
      if (!opts.poll) return false;
      const status = query.state.data?.status;
      return status === "queued" || status === "processing" ? 1000 : false;
    },
  });
}

export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewAnalysisInput) => analysisProvider.submit(input),
    onSuccess: (analysis) => {
      queryClient.setQueryData(["analysis", analysis.id], analysis);
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}

export function useDeleteAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (analysis: Analysis) => analysisProvider.remove(analysis),
    onSuccess: (_d, analysis) => {
      queryClient.removeQueries({ queryKey: ["analysis", analysis.id] });
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}

export function useDeleteAllAnalyses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => analysisProvider.removeAll(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["analyses"] }),
  });
}
