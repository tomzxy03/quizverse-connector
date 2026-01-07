// GroupContent/GroupTabs.tsx
import {
  Bell,
  FileText,
  Users,
  Share2,
  Database,
} from 'lucide-react';
import { ContentTab } from './types';

interface Props {
  activeTab: ContentTab;
  onChange: (tab: ContentTab) => void;
  canManage: boolean;
}

const TabButton = ({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`
      px-5 py-3 flex items-center gap-2 text-sm font-medium
      border-b-2 transition-colors
      ${
        active
          ? 'border-slate-900 text-slate-900'
          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }
    `}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

const GroupTabs = ({ activeTab, onChange, canManage }: Props) => {
  return (
    <div className="bg-white border-b flex overflow-x-auto">
      <TabButton
        active={activeTab === 'announcements'}
        onClick={() => onChange('announcements')}
        icon={Bell}
        label="Thông báo"
      />
      <TabButton
        active={activeTab === 'quizzes'}
        onClick={() => onChange('quizzes')}
        icon={FileText}
        label="Quiz"
      />
      <TabButton
        active={activeTab === 'members'}
        onClick={() => onChange('members')}
        icon={Users}
        label="Thành viên"
      />
      <TabButton
        active={activeTab === 'shared'}
        onClick={() => onChange('shared')}
        icon={Share2}
        label="Chia sẻ"
      />

      {canManage && (
        <TabButton
          active={activeTab === 'questionBank'}
          onClick={() => onChange('questionBank')}
          icon={Database}
          label="Ngân hàng câu hỏi"
        />
      )}
    </div>
  );
};

export default GroupTabs;
