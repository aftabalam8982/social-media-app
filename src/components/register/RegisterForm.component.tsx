import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../../firebase/firebase.config";
import { FormDataProps } from "../../types/types";
import InputForm from "../form-input/FormInput.component";
import Button from "../button/Button.component";
import { useAuth } from "../../contexts/userAuthContext";
import { updateProfile } from "firebase/auth";

interface RegisterFormProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm: React.FC<RegisterFormProps> = ({ setError }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataProps>(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formData;
  const { setCurrentUser } = useAuth();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      if (response?.user) {
        // update displayName to user
        await updateProfile(response.user, {
          displayName: displayName || "Anonymous User",
        });
        // create userDoc in db
        await createUserDocumentFromAuth(response.user);

        setCurrentUser({
          ...response.user,
          displayName: displayName || response.user.displayName || "",
        });
        navigate("/feeds");
      } else {
        setError("User creation failed");
      }
      setFormData(defaultFormFields);
      navigate("/feeds"); // Redirect to feeds after registration
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        alert("user already exist!!");
      }
      console.log("User creation Error:", err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <InputForm
        type='email'
        name='email'
        placeholder='Email'
        value={email}
        onChange={handleInput}
        required
      />
      <InputForm
        type='text'
        name='displayName'
        placeholder='Name'
        value={displayName || ""}
        onChange={handleInput}
        required
      />
      <InputForm
        type='password'
        name='password'
        placeholder='Password'
        value={password}
        onChange={handleInput}
        required
      />
      <InputForm
        type='password'
        name='confirmPassword'
        placeholder='Confirm Password'
        value={confirmPassword || ""}
        onChange={handleInput}
        required
      />
      <Button label='Register' type='submit' />
    </form>
  );
};

export default RegisterForm;
