import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserDocumentFromAuth,
  signInAuthWithEmailAndPassword,
  signInWithGooglePopup,
} from "../../firebase/firebase.config";
import InputForm from "../form-input/FormInput.component";
import Button from "../button/Button.component";
import { FormDataProps } from "../../types/types";
import { useAuth } from "../../contexts/userAuthContext";

interface SignInFormProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm: React.FC<SignInFormProps> = ({ setError }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataProps>(defaultFormFields);
  const { email, password } = formData;
  const { setCurrentUser } = useAuth();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await signInAuthWithEmailAndPassword(email, password);
      if (response?.user) {
        setCurrentUser(response.user);
      }
      navigate("/feeds"); // Redirect to feeds after login
    } catch (err: any) {
      switch (err.code) {
        case "auth/wrong-password":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("no user associated with email");
          break;
        default:
          console.log(err.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      await createUserDocumentFromAuth(user);
      setCurrentUser(user);
      navigate("/feeds");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <InputForm
        name='email'
        type='email'
        placeholder='Email'
        value={email}
        onChange={handleInput}
        required
      />
      <InputForm
        name='password'
        type='password'
        placeholder='Password'
        value={password}
        onChange={handleInput}
        required
      />

      <Button label='Login' type='submit' />
      <Button
        label={`Sign In with Google`}
        onClick={handleGoogleSignIn}
        type='button'
      />
    </form>
  );
};

export default SignInForm;
