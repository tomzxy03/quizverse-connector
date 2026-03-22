import { apiClient, API_ENDPOINTS } from '@/core/api';
import type { DashboardSummary } from '@/domains/dashboard.types';

export async function getDashboardSummary(userId: number): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>(API_ENDPOINTS.DASHBOARD.SUMMARY, { userId });
}
