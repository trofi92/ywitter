import { useReducer } from "react";
import { auth } from "../firebase";
import {
 createUserWithEmailAndPassword,
 signInWithEmailAndPassword,
 GoogleAuthProvider,
 GithubAuthProvider,
 signInWithPopup,
 AuthProvider,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

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

const Auth = () => {
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

 const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
  const { name } = event.currentTarget;
  let provider: AuthProvider | undefined = undefined;
  if (name === "google") {
   provider = new GoogleAuthProvider().setCustomParameters({
    prompt: "select_account",
   });
  } else if (name === "github") {
   provider = new GithubAuthProvider().setCustomParameters({
    prompt: "select_account",
   });
  }
  if (provider) {
   try {
    await signInWithPopup(auth, provider);
   } catch (error: unknown) {
    //TODO : Wrapper로 감싸서 에러 처리 해주기 > 원인이나 에러코드 노출되지 않도록 (Proxy)
    if (error instanceof FirebaseError) {
     dispatch({ type: "SET_ERROR", payload: error.code });
    }
   }
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
   <div>
    <button onClick={onSocialClick} name="google">
     Continue with Google
    </button>
    <button onClick={onSocialClick} name="github">
     Continue with Github
    </button>
   </div>
  </>
 );
};

export default Auth;
