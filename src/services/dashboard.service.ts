import { getDashboardSummary } from '@/repositories';
import type { DashboardSummary } from '@/domains/dashboard.types';

export async function fetchDashboard(userId: number): Promise<DashboardSummary> {
  // dashboard is not an actual backend endpoint, but we keep the userId as number now.
  // The repository returns mock data.
  return getDashboardSummary(userId.toString());
}
