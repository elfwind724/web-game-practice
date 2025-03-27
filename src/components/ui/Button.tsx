import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClass = 'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variantClasses = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    ghost: 'text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500'
  };
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg'
  };
  
  const classes = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button; 