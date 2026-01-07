interface SubjectTagProps {
  subject: string;
  isSelected: boolean;
  onClick: (subject: string) => void;
}

const SubjectTag: React.FC<SubjectTagProps> = ({
  subject,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(subject)}
      className={`
        whitespace-nowrap
        px-3 py-1.5 rounded-full
        text-sm font-medium
        border transition
        ${
          isSelected
            ? 'bg-slate-200 border-slate-300 text-slate-900'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
        }
      `}
    >
      {subject}
    </button>
  );
};

export default SubjectTag;
