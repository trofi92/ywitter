import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";
import { User } from "firebase/auth";

const AppRouter = ({
 isLoggedIn,
 userObj,
}: {
 isLoggedIn: boolean;
 userObj: User | null;
}) => {
 return (
  <Router>
   {isLoggedIn && <Navigation />}
   <Routes>
    {isLoggedIn ? (
     <>
      <Route path="/" element={<Home userObj={userObj} />} />
      <Route path="/profile" element={<Profile />} />
     </>
    ) : (
     <>
      <Route path="/" element={<Auth />} />
     </>
    )}
   </Routes>
  </Router>
 );
};

export default AppRouter;
