import { useState } from "react";
import { auth } from "../firebase";
import {
 GoogleAuthProvider,
 GithubAuthProvider,
 signInWithPopup,
 AuthProvider,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import AuthForm from "../components/AuthForm";

const Auth = () => {
 const [error, setError] = useState("");
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
     setError(error?.code);
    }
   }
  }
 };

 return (
  <>
   <AuthForm />
   {error == "" ? "" : <span>{error}</span>}
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
