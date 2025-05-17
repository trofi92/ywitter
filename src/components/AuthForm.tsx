import { FirebaseError } from "firebase/app";
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
} from "firebase/auth";
import { useReducer } from "react";
import { auth } from "../firebase";
type State = {
 email: string;
 password: string;
 newAccount: boolean;
 error: string;
};

type Action =
 | { type: "SET_EMAIL"; payload: string }
 | { type: "SET_PASSWORD"; payload: string }
 | { type: "SET_NEW_ACCOUNT"; payload: boolean }
 | { type: "SET_ERROR"; payload: string };

const initialState: State = {
 email: "",
 password: "",
 newAccount: true,
 error: "",
};

const reducer = (state: State, action: Action): State => {
 switch (action.type) {
  case "SET_EMAIL":
   return { ...state, email: action.payload };
  case "SET_PASSWORD":
   return { ...state, password: action.payload };
  case "SET_NEW_ACCOUNT":
   return { ...state, newAccount: action.payload };
  case "SET_ERROR":
   return { ...state, error: action.payload };

  default:
   return state;
 }
};
const AuthForm = () => {
 const [state, dispatch] = useReducer(reducer, initialState);

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
 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
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
   <form onSubmit={onSubmit}>
    <input
     name="email"
     type="email"
     placeholder="email"
     required
     value={state.email}
     onChange={onChange}
    />
    <input
     name="password"
     type="password"
     placeholder="Password"
     required
     value={state.password}
     onChange={onChange}
    />
    <input
     type="submit"
     value={state.newAccount ? "Create Account" : "Log In"}
    />
    {state.error}
   </form>
   <span onClick={toggleAccount}>
    {state.newAccount ? "Sign In" : "Create Account"}
   </span>
  </>
 );
};

export default AuthForm;
