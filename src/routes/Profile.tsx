import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
 const navigate = useNavigate();
 const onLogOutClick = () => {
  auth.signOut();
  navigate("/");
 };

 return <button onClick={onLogOutClick}>Log Out</button>;
};

export default Profile;
