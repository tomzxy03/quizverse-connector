import { useRef, useState } from 'react';

interface HoverFilterProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

const HoverFilter = ({ label, value, options, onSelect }: HoverFilterProps) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timerRef.current = window.setTimeout(() => {
          setOpen(false);
        }, 150);
      }}
    >
      <button
        type="button"
        className="
          px-3 py-2 text-sm
          bg-white border border-slate-200 rounded-lg
          flex items-center gap-2
          hover:border-indigo-300
          transition
        "
      >
        <span>{label}: {value}</span>
        <svg
          className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute left-0 mt-2 w-44
            bg-white border border-slate-200
            rounded-xl shadow-lg z-30 p-1
          "
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`
                w-full text-left px-3 py-2 text-sm rounded-lg
                ${opt === value
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'hover:bg-slate-100'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HoverFilter;
