// GroupContent/tabs/AnnouncementsTab.tsx
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dummyAnnouncements = [
  {
    id: '1',
    title: 'New Quiz Added',
    content: 'Quiz toán mới đã được thêm vào nhóm.',
    date: '2023-09-15',
    author: 'Admin',
  },
];

const AnnouncementsTab = ({ canManage }: { canManage: boolean }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Thông báo</h2>
        {canManage && (
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Tạo thông báo
          </Button>
        )}
      </div>

      {dummyAnnouncements.map(a => (
        <div
          key={a.id}
          className="bg-white p-4 rounded-xl border border-slate-200"
        >
          <div className="flex justify-between mb-1">
            <h3 className="font-medium">{a.title}</h3>
            <span className="text-xs text-slate-400">{a.date}</span>
          </div>
          <p className="text-sm text-slate-600">{a.content}</p>
          <p className="text-xs text-right text-slate-400 mt-2">
            {a.author}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementsTab;
