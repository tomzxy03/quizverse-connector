/**
 * Sync Status Indicator
 * Shows the overall sync/connection status and retry queue info
 */

import { AlertTriangle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SyncStatus } from '@/contexts/QuizAttemptContext';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  retryCount: number;
}

export default function SyncStatusIndicator({
  status,
  retryCount,
}: SyncStatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {status === 'saving' && (
        <Badge variant="outline" className="gap-1 bg-amber-50 dark:bg-amber-950/20">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Đang lưu</span>
        </Badge>
      )}

      {status === 'saved' && (
        <Badge variant="outline" className="gap-1 bg-emerald-50 dark:bg-emerald-950/20">
          <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-500" />
          <span>Đã lưu</span>
        </Badge>
      )}

      {status === 'error' && (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>Lỗi</span>
        </Badge>
      )}

      {retryCount > 0 && (
        <Badge variant="outline" className="gap-1 bg-orange-50 dark:bg-orange-950/20">
          <AlertTriangle className="h-3 w-3 text-orange-600 dark:text-orange-500" />
          <span className="text-xs">{retryCount} chờ</span>
        </Badge>
      )}
    </div>
  );
}
