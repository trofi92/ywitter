import { useReducer } from "react";

type State = {
 email: string;
 password: string;
 newAccount: boolean;
};

type Action =
 | { type: "SET_EMAIL"; payload: string }
 | { type: "SET_PASSWORD"; payload: string }
 | { type: "SET_NEW_ACCOUNT"; payload: boolean };

const initialState: State = {
 email: "",
 password: "",
 newAccount: true,
};

const reducer = (state: State, action: Action): State => {
 switch (action.type) {
  case "SET_EMAIL":
   return { ...state, email: action.payload };
  case "SET_PASSWORD":
   return { ...state, password: action.payload };
  case "SET_NEW_ACCOUNT":
   return { ...state, newAccount: action.payload };
  default:
   return state;
 }
};

const Auth = () => {
 const [state, dispatch] = useReducer(reducer, initialState);

 const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  if (name === "email") {
   dispatch({ type: "SET_EMAIL", payload: value });
  } else if (name === "password") {
   dispatch({ type: "SET_PASSWORD", payload: value });
  }
 };

 const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (state.newAccount) {
   //todo : createAccount Logic
  } else {
   //todo : log in Logic
  }
  console.log("submit");
 };

 return (
  <>
   <form>
    <input
     name="email"
     type="email"
     placeholder="email"
     value={state.email}
     onChange={onChange}
    />
    <input
     name="password"
     type="password"
     placeholder="Password"
     value={state.password}
     onChange={onChange}
    />
    <input
     type="submit"
     value={state.newAccount ? "Create Account" : "Log In"}
    />
   </form>
   <div>
    <button>Continue with Google</button>
    <button>Continue with Github</button>
   </div>
  </>
 );
};

export default Auth;
