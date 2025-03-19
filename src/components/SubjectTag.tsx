
import { MouseEvent } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

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
    <Button
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "text-sm rounded-full",
        isSelected ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
      )}
      onClick={handleClick}
    >
      {subject}
    </Button>
  );
};

export default SubjectTag;
