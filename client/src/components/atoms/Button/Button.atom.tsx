import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: 'filled' | 'outlined' | 'anchor' | 'inactive';
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ buttonType = 'filled', className, ...props }) => {
  return (
    <button
      className={`
        button-atom
        ${!props.disabled && buttonType === 'filled' ? ' filled' : ''}
        ${!props.disabled && buttonType === 'outlined' ? ' outlined' : ''}
        ${!props.disabled && buttonType === 'anchor' ? ' anchor' : ''}
        ${!props.disabled && buttonType === 'inactive' ? ' inactive' : ''}
        ${props.disabled ? ' disabled' : ''}
        ${className ? ` ${className}` : ''}
      `}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
