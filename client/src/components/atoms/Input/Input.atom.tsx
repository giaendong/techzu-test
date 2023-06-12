import React from 'react';
import './Input.scss'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({type, disabled, className, ...props}) => {
  return (
    <input
      type={type || 'text'}
      className={`
        input-atom
        ${disabled ? ' disabled' : ''}
        ${className ? ` ${className}` : ''}
      `}
      {...props}
    />
  );
};

export default Input;
