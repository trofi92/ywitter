import { FirebaseError } from "firebase/app";
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
} from "firebase/auth";
import { useReducer, useState } from "react";
import { auth } from "../firebase";
import { reducer, initialState } from "../types/auth.types";
import { authSchema, type AuthFormData } from "../schemas/auth.schema";
import { z } from "zod";

const AuthForm = () => {
 const [state, dispatch] = useReducer(reducer, initialState);
 const [errors, setErrors] = useState<Partial<AuthFormData>>({});

 const toggleAccount = () => {
  dispatch({ type: "SET_NEW_ACCOUNT", payload: !state.newAccount });
 };

 const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  if (name === "email") {
   dispatch({ type: "SET_EMAIL", payload: value });
  } else if (name === "password") {
   dispatch({ type: "SET_PASSWORD", payload: value });
  }
 };

 const validateForm = (): boolean => {
  try {
   authSchema.parse({
    email: state.email,
    password: state.password,
   });
   setErrors({});
   return true;
  } catch (error) {
   if (error instanceof z.ZodError) {
    const newErrors: Partial<AuthFormData> = {};
    error.errors.forEach((err) => {
     if (err.path[0]) {
      newErrors[err.path[0] as keyof AuthFormData] = err.message;
     }
    });
    setErrors(newErrors);
   }
   return false;
  }
 };

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!validateForm()) return;

  try {
   if (state.newAccount) {
    await createUserWithEmailAndPassword(auth, state.email, state.password);
   } else {
    await signInWithEmailAndPassword(auth, state.email, state.password);
   }
  } catch (error: unknown) {
   //TODO : Wrapper로 감싸서 에러 처리 해주기 > 원인이나 에러코드 노출되지 않도록 (Proxy)
   if (error instanceof FirebaseError) {
    dispatch({ type: "SET_ERROR", payload: error.code });
   }
  }
 };

 return (
  <>
   <form onSubmit={onSubmit} className="container">
    <input
     name="email"
     type="email"
     placeholder="email"
     required
     value={state.email}
     onChange={onChange}
     className="authInput"
    />
    {errors.email && <span className="error-message">{errors.email}</span>}

    <input
     name="password"
     type="password"
     placeholder="Password"
     required
     value={state.password}
     onChange={onChange}
     className="authInput"
    />
    {errors.password && (
     <span className="error-message">{errors.password}</span>
    )}

    <input
     type="submit"
     value={state.newAccount ? "Create Account" : "Log In"}
     className="authInput authSubmit"
    />
    {state.error}
   </form>
   <span onClick={toggleAccount} className="authSwitch">
    {state.newAccount ? "Sign In" : "Create Account"}
   </span>
  </>
 );
};

export default AuthForm;
