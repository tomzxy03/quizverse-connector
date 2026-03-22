import { getDashboardSummary } from '@/repositories';
import type { DashboardSummary } from '@/domains/dashboard.types';

export async function fetchDashboard(userId: number): Promise<DashboardSummary> {
  return getDashboardSummary(userId);
}
