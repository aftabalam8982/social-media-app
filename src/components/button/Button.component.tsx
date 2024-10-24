import React from "react";
import "./Button.style.css"; // Importing CSS module

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: "primary" | "secondary" | "comment";
  icon?: any;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  disabled = false,
  style = "primary", // Default style
  icon,
}) => {
  return (
    <button
      type={type}
      className={style} // Use the style prop for the class name
      onClick={onClick}
      disabled={disabled}
    >
      {`${label} ${icon ? icon : ""}`}
    </button>
  );
};

export default Button;
