import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";
import Navigation from "./Navigation";

const AppRouter = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
 return (
  <Router>
   {isLoggedIn && <Navigation />}
   <Routes>
    {isLoggedIn ? (
     <Route path="/" element={<Home />} />
    ) : (
     <Route path="/" element={<Auth />} />
    )}
   </Routes>
  </Router>
 );
};

export default AppRouter;
