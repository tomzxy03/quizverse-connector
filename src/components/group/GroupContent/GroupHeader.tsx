// GroupContent/GroupHeader.tsx
import { Group } from './types';

interface Props {
  group: Group;
}

const GroupHeader = ({ group }: Props) => {
  const roleLabel =
    group.role === 'OWNER'
      ? 'Chủ nhóm'
      : group.role === 'ADMIN'
        ? 'Quản trị viên'
        : 'Thành viên';

  return (
    <div className="px-6 py-4 border-b border-border bg-card">
      <h1 className="text-xl font-semibold text-foreground">{group.name}</h1>
      <p className="text-sm text-muted-foreground mt-1">
        {group.memberCount} thành viên · {roleLabel}
      </p>
    </div>
  );
};

export default GroupHeader;
