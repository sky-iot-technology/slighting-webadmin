// components/CustomScrollbar.tsx
import React from 'react';
import { FC, ReactNode, useCallback } from 'react';

type CustomScrollbarProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const CustomScrollbar = React.forwardRef<HTMLDivElement, CustomScrollbarProps>(
  ({ children, className = '', style }, ref) => {
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
        ref={ref}
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={(e) => e.stopPropagation()}
        data-scrollable='true'
        className={`[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:transition-all [&::-webkit-scrollbar-thumb]:duration-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent ${className} `}
      >
        {children}
      </div>
    );
  }
);

export default CustomScrollbar;
