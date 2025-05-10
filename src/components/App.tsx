import { useEffect, useReducer } from "react";
import AppRouter from "./Router";
import { auth } from "../firebase";
import { AppState, AppAction } from "../types/auth.types";
import { Reducer } from "../types/reducer.types";

const initialState: AppState = {
 isLoggedIn: false,
 init: false,
 userObj: null,
};

const reducer: Reducer<AppState, AppAction> = (state, action) => {
 switch (action.type) {
  case "SET_LOGGED_IN":
   return { ...state, isLoggedIn: action.payload };
  case "SET_INIT":
   return { ...state, init: action.payload };
  case "SET_USER":
   return { ...state, userObj: action.payload };
  default:
   return state;
 }
};

function App() {
 const [state, dispatch] = useReducer(reducer, initialState);

 useEffect(() => {
  auth.onAuthStateChanged((user) => {
   if (user) {
    dispatch({ type: "SET_LOGGED_IN", payload: true });
    dispatch({ type: "SET_USER", payload: user });
   } else {
    dispatch({ type: "SET_LOGGED_IN", payload: false });
    dispatch({ type: "SET_USER", payload: null });
   }
   dispatch({ type: "SET_INIT", payload: true });
  });
 }, []);

 return (
  <>
   {state.init ? (
    <AppRouter isLoggedIn={!!state.isLoggedIn} userObj={state.userObj} />
   ) : (
    "initializing..."
   )}
   <footer>&copy; {new Date().getFullYear()} Ywitter</footer>
  </>
 );
}

export default App;
