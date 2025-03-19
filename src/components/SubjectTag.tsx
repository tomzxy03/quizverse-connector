
import { MouseEvent } from 'react';

interface SubjectTagProps {
  subject: string;
  isSelected: boolean;
  onClick: (subject: string) => void;
}

const SubjectTag = ({ subject, isSelected, onClick }: SubjectTagProps) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onClick(subject);
  };

  return (
    <button
      className={`subject-tag ${isSelected ? 'tag-selected' : 'tag-unselected'}`}
      onClick={handleClick}
    >
      {subject}
    </button>
  );
};

export default SubjectTag;
