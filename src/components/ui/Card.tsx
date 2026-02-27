import React, { useRef, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'copper';
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'glass',
  interactive = false,
  className,
  ...props
}, ref) => {
  const localRef = useRef<HTMLDivElement>(null);
  const cardRef = (ref as React.RefObject<HTMLDivElement>) || localRef;

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [interactive, cardRef]);

  const baseClasses = "rounded-[24px] border border-white/10 transition-all duration-500 overflow-hidden relative";
  
  const variantClasses = {
    glass: "bg-white/5 backdrop-blur-[20px] hover:border-white/20",
    solid: "bg-[#0d0c0a] border-white/5",
    copper: "bg-[var(--copper-subtle)] border-copper-strong/30",
  };

  const interactiveClasses = interactive ? "group/card cursor-pointer" : "";

  return (
    <div
      ref={cardRef}
      className={cn(baseClasses, variantClasses[variant], interactiveClasses, className)}
      {...props}
    >
      {interactive && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%)`
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
