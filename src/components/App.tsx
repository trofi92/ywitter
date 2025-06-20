import { useEffect, useReducer } from "react";
import AppRouter from "./Router";
import { auth } from "../firebase";
import { AppState, AppAction } from "../types/auth.types";
import { Reducer } from "../types/reducer.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
 defaultOptions: {
  queries: {
   staleTime: 1000 * 60, // 1분
   gcTime: 1000 * 60 * 5, // 5분
   retry: 1,
   refetchOnWindowFocus: false,
  },
 },
});

const initialState: AppState = {
 init: false,
 userObj: null,
};

const reducer: Reducer<AppState, AppAction> = (state, action) => {
 switch (action.type) {
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
 const refreshUser = () => {
  const user = auth.currentUser;
  if (user) {
   dispatch({ type: "SET_USER", payload: user });
  } else {
   dispatch({ type: "SET_USER", payload: null });
  }
 };
 useEffect(() => {
  auth.onAuthStateChanged((user) => {
   if (user) {
    dispatch({ type: "SET_USER", payload: user });
   } else {
    dispatch({ type: "SET_USER", payload: null });
   }
   dispatch({ type: "SET_INIT", payload: true });
  });
 }, []);

 return (
  <QueryClientProvider client={queryClient}>
   {state.init ? (
    <AppRouter
     isLoggedIn={Boolean(state.userObj)}
     userObj={state.userObj}
     refreshUser={refreshUser}
    />
   ) : (
    "initializing..."
   )}
  </QueryClientProvider>
 );
}

export default App;
