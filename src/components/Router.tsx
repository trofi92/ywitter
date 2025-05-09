import {
 HashRouter as Router,
 Route,
 Routes,
 //  Navigate,
} from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
 return (
  <Router>
   {isLoggedIn && <Navigation />}
   <Routes>
    {isLoggedIn ? (
     <>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
     </>
    ) : (
     <>
      <Route path="/" element={<Auth />} />
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
     </>
    )}
   </Routes>
  </Router>
 );
};

export default AppRouter;
