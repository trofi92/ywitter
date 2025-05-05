import { useState } from "react";
import AppRouter from "./Router";
// import { auth } from "../firebase";

function App() {
 //  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 return (
  <>
   <AppRouter isLoggedIn={!!isLoggedIn} />
   <footer>&copy; {new Date().getFullYear()} Ywitter</footer>
  </>
 );
}

export default App;
