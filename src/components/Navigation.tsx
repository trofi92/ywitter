import { User } from "firebase/auth";
import { Link } from "react-router-dom";

function Navigation({ userObj }: { userObj: User | null }) {
 return (
  <nav>
   <ul>
    <li>
     <Link to="/">Home</Link>
    </li>
    <li>
     <Link to="/profile">{userObj?.displayName}의 프로필</Link>
    </li>
   </ul>
  </nav>
 );
}

export default Navigation;
