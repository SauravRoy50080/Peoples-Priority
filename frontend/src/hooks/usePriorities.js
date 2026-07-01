import { useQuery } from '@tanstack/react-query';
import { getPriorities, getHeatmap, getStats, getClusterDetail } from '../services/api';

export function usePriorities() {
  return useQuery({
    queryKey: ['priorities'],
    queryFn: getPriorities,
    refetchInterval: 60000, // refresh every 60s
    retry: 1,
  });
}

export function useHeatmap() {
  return useQuery({
    queryKey: ['heatmap'],
    queryFn: getHeatmap,
    retry: 1,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
    retry: 1,
  });
}

export function useClusterDetail(clusterId) {
  return useQuery({
    queryKey: ['cluster', clusterId],
    queryFn: () => getClusterDetail(clusterId),
    enabled: !!clusterId,
    retry: 1,
  });
}