import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dummyAnnouncements = [
  {
    id: '1',
    title: 'Quiz mới đã được thêm',
    content: 'Quiz toán mới đã được thêm vào nhóm.',
    date: '2023-09-15',
    author: 'Admin',
  },
];

const AnnouncementsTab = ({ canManage }: { canManage: boolean }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-medium text-foreground">Thông báo</h2>
        {canManage && (
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Tạo thông báo
          </Button>
        )}
      </div>

      <ul className="space-y-3">
        {dummyAnnouncements.map((a) => (
          <li
            key={a.id}
            className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-medium text-foreground">{a.title}</h3>
              <span className="text-xs text-muted-foreground shrink-0">{a.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{a.content}</p>
            <p className="text-xs text-muted-foreground mt-2 text-right">{a.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsTab;
