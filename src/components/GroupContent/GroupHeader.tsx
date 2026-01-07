// GroupContent/GroupHeader.tsx
import { Group } from './types';

interface Props {
  group: Group;
}

const GroupHeader = ({ group }: Props) => {
  return (
    <div className="p-6 border-b bg-white">
      <h1 className="text-2xl font-semibold text-slate-900">
        {group.name}
      </h1>
      <p className="text-sm text-slate-500 mt-1">
        {group.memberCount} thành viên ·{' '}
        {group.role === 'OWNER'
          ? 'Bạn là chủ nhóm'
          : group.role === 'ADMIN'
          ? 'Bạn là quản trị viên'
          : 'Bạn là thành viên'}
      </p>
    </div>
  );
};

export default GroupHeader;
