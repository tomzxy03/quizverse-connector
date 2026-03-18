import { useState } from 'react';
import { FileText } from 'lucide-react';

interface SharedResource {
  id: number;
  name: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export default function GroupSharedTab() {
  // Placeholder: Display message that shared resources feature is coming soon
  const [resources] = useState<SharedResource[]>([]);

  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">Tính năng chia sẻ tài liệu sắp ra mắt</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <div key={resource.id} className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50">
          <div className="flex flex-1 gap-3">
            <div className="mt-0.5">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{resource.name}</h3>
              {resource.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{resource.uploadedBy}</span>
                <span>{resource.uploadedAt}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
