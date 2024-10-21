import React from "react";
import "./Button.style.css"; // Importing CSS module

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: "primary" | "secondary" | "comment";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  style = "primary", // Default style
}) => {
  return (
    <button
      type={type}
      className={style} // Use the style prop for the class name
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
