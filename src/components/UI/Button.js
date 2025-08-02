import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const getGoldStyles = (variant) => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#FFD700',
          color: '#000000',
        };
      case 'outline':
        return {
          borderColor: '#FFD700',
          color: '#FFD700',
        };
      default:
        return {};
    }
  };

  const getGoldHoverStyles = (variant) => {
    switch (variant) {
      case 'primary':
        return {
          '--hover-bg': '#F5C500',
        };
      case 'outline':
        return {
          '--hover-bg': '#FFD700',
          '--hover-color': '#000000',
        };
      default:
        return {};
    }
  };

  const variants = {
    primary: 'text-white focus:ring-yellow-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500 shadow-sm hover:shadow-md',
    outline: 'border-2 hover:bg-yellow-50 focus:ring-yellow-500 bg-white',
    ghost: 'hover:bg-yellow-50 focus:ring-yellow-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <motion.button
      className={classes}
      style={{
        ...getGoldStyles(variant),
        ...getGoldHoverStyles(variant),
      }}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.target.style.backgroundColor = '#F5C500';
        } else if (variant === 'outline') {
          e.target.style.backgroundColor = '#FFD700';
          e.target.style.color = '#000000';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.target.style.backgroundColor = '#FFD700';
        } else if (variant === 'outline') {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#FFD700';
        }
      }}
      {...props}
    >
      {loading && (
        <motion.div
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button; 