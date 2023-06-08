import React from 'react';
import './Input.scss'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input
      type={props.type || 'text'}
      className={`
        input-atom
        ${props.disabled ? ' disabled' : ''}
      `}
      {...props}
    />
  );
};

export default Input;
