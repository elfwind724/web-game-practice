import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

const Card = ({ children, className = '', glass = false }: CardProps) => {
  const baseClass = 'rounded-lg shadow-md overflow-hidden';
  const glassClass = glass ? 'glass-card' : 'bg-gray-800';
  
  return (
    <div className={`${baseClass} ${glassClass} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={`px-6 py-4 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const CardBody = ({ children, className = '' }: CardBodyProps) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter = ({ children, className = '' }: CardFooterProps) => (
  <div className={`px-6 py-4 border-t border-gray-700 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardBody, CardFooter }; 