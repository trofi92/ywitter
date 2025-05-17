import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { User } from "firebase/auth";
import { Link } from "react-router-dom";

function Navigation({ userObj }: { userObj: User | null }) {
 return (
  <nav>
   <ul className="nav">
    <li>
     <Link to="/" className="homeLink">
      <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
     </Link>
    </li>
    <li>
     <Link to="/profile" className="profileLink">
      <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
      <span className="profileLinkText">
       {userObj?.displayName ? `${userObj?.displayName}의 프로필` : "프로필"}
      </span>
     </Link>
    </li>
   </ul>
  </nav>
 );
}

export default Navigation;
