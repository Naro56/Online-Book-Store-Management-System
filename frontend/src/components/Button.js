import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  fullWidth = false,
  onClick,
  ...rest 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border border-gray-300 hover:border-gray-400 bg-white text-gray-700",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };
  
  const sizeClasses = {
    sm: "text-sm py-1 px-3",
    md: "text-base py-2 px-4",
    lg: "text-lg py-2.5 px-6"
  };
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const widthClasses = fullWidth ? "w-full" : "";
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${disabledClasses}
    ${widthClasses}
    ${className}
  `.trim();
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 