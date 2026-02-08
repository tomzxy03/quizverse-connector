import { getDashboardSummary } from '@/repositories';
import type { DashboardSummary } from '@/domains/dashboard.types';

export async function fetchDashboard(userId: string): Promise<DashboardSummary> {
  return getDashboardSummary(userId);
}
