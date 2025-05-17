import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faTwitter,
 faGoogle,
 faGithub,
} from "@fortawesome/free-brands-svg-icons";
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
   <div className="authContainer">
    <FontAwesomeIcon
     icon={faTwitter}
     color={"#04AAFF"}
     size="3x"
     style={{ marginBottom: 30 }}
    />
    {error == "" ? "" : <span>{error}</span>}
    <AuthForm />
    <div className="authBtns">
     <button onClick={onSocialClick} name="google" className="authBtn">
      Continue with Google <FontAwesomeIcon icon={faGoogle} />
     </button>
     <button onClick={onSocialClick} name="github" className="authBtn">
      Continue with Github <FontAwesomeIcon icon={faGithub} />
     </button>
    </div>
   </div>
  </>
 );
};

export default Auth;
