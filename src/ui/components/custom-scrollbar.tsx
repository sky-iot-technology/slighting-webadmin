// components/CustomScrollbar.tsx
import { FC, ReactNode, useCallback } from 'react';

type CustomScrollbarProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const CustomScrollbar: FC<CustomScrollbarProps> = ({
  children,
  className = '',
  style
}) => {
  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.setProperty('--scrollbar-thumb-color', '#9ca3af');
    },
    []
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.setProperty(
        '--scrollbar-thumb-color',
        'transparent'
      );
    },
    []
  );
  return (
    <div
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-all [&::-webkit-scrollbar-thumb]:duration-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent ${className} `}
    >
      {children}
    </div>
  );
};

export default CustomScrollbar;
