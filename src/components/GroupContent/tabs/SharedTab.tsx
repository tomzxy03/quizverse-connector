// GroupContent/tabs/SharedTab.tsx
import { Button } from '@/components/ui/button';
import { Group } from '../types';

const SharedTab = ({ group }: { group: Group }) => {
  const link = `https://quizplatform.com/join/${group.id}`;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border">
      <h2 className="text-lg font-semibold mb-2">Chia sẻ nhóm</h2>
      <p className="text-sm text-slate-500 mb-4">
        Gửi link này cho bạn bè để tham gia nhóm.
      </p>

      <div className="flex gap-2">
        <input
          readOnly
          value={link}
          className="flex-1 px-3 py-2 border rounded-md bg-slate-50"
        />
        <Button
          onClick={() => navigator.clipboard.writeText(link)}
        >
          Copy
        </Button>
      </div>
    </div>
  );
};

export default SharedTab;
