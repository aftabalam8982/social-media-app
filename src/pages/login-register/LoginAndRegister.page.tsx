// components/LoginRegisterPage.tsx
import React, { useState } from "react";
import "./LoginAndRegister.style.css";
import RegisterForm from "../../components/register/RegisterForm.component";
import SignInForm from "../../components/sign-in/SignInForm.component";

const LoginRegisterPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className='container'>
      <div className='form'>
        <h2>{isRegister ? "Register" : "Login"}</h2>

        {/* Display error message */}
        {error && <p className='error'>{error}</p>}

        {/* Render the SignInForm or RegisterForm based on the state */}
        {isRegister ? (
          <RegisterForm setError={setError} />
        ) : (
          <SignInForm setError={setError} />
        )}

        {/* Toggle between login and register */}
        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className='toggle' onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
