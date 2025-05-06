import { useState, useEffect } from "react";
import AppRouter from "./Router";
import { auth } from "../firebase";

function App() {
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [init, setInit] = useState(false);

 useEffect(() => {
  auth.onAuthStateChanged((user) => {
   if (user) {
    setIsLoggedIn(true);
   } else {
    setIsLoggedIn(false);
   }
   setInit(true);
  });
 }, [isLoggedIn]);
 return (
  <>
   {init ? <AppRouter isLoggedIn={!!isLoggedIn} /> : "initializing..."}
   <footer>&copy; {new Date().getFullYear()} Ywitter</footer>
  </>
 );
}

export default App;
