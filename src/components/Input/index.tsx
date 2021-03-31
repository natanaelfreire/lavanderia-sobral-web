import React, { InputHTMLAttributes } from 'react';

import './styles.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  inputType: string;
}

const Input: React.FC<InputProps> = ({ name, label, inputType, ...rest }) => {
  return (
    <div className="input-block">
      <label htmlFor={name}>{label}</label>
      <input type={inputType} id={name} {...rest} />
    </div>
  );
}

export default Input;