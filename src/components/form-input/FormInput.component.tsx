import React from "react";
import "./FormInput.style.css";
interface InputFormProps {
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  type,
  name,
  value,
  placeholder = "",
  onChange,
  required = false,
}) => {
  return (
    <div className='.inputContainer'>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className='input'
      />
    </div>
  );
};

export default InputForm;
