'use client';

import { useEffect, useRef, useState } from "react";

interface AnimatedBlockProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delay?: number;
  className?: string;
}

export const AnimatedBlock = ({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}: AnimatedBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAnimationStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transitionProperty: 'opacity, transform',
      transitionDuration: '700ms',
      transitionTimingFunction: 'ease-out',
    };

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...baseStyle, opacity: 0, transform: 'translateY(2rem)' };
        case 'fade-in':
          return { ...baseStyle, opacity: 0 };
        case 'slide-left':
          return { ...baseStyle, opacity: 0, transform: 'translateX(-2rem)' };
        case 'slide-right':
          return { ...baseStyle, opacity: 0, transform: 'translateX(2rem)' };
        default:
          return { ...baseStyle, opacity: 0 };
      }
    }

    return { ...baseStyle, opacity: 1, transform: 'translate(0, 0)' };
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...getAnimationStyle(), transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
