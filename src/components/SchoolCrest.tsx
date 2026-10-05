interface SchoolCrestProps {
  className?: string;
  size?: number;
}

export default function SchoolCrest({ className = 'text-amber-500', size = 32 }: SchoolCrestProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="School Crest"
    >
      {/* Outer shield/circle border */}
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Laurels / leaves */}
      <path
        d="M22 64 C20 48, 28 32, 42 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M78 64 C80 48, 72 32, 58 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Open Book */}
      <path
        d="M50 48 C44 44, 34 45, 28 47 L28 66 C34 64, 44 63, 50 67 C56 63, 66 64, 72 66 L72 47 C66 45, 56 44, 50 48 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="50" y1="48" x2="50" y2="67" stroke="currentColor" strokeWidth="2" />
      
      {/* Torch of Knowledge */}
      <path
        d="M50 20 L53 30 L47 30 Z"
        fill="currentColor"
      />
      <path
        d="M48 30 L49 40 L51 40 L52 30 Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Star of Excellence */}
      <polygon
        points="50,12 51.5,16 56,16 52.5,18.5 54,23 50,20 46,23 47.5,18.5 44,16 48.5,16"
        fill="currentColor"
      />
    </svg>
  );
}
