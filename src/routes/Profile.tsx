import { useState, useEffect, useRef } from "react";
import {
 auth,
 collection,
 db,
 orderBy,
 query,
 where,
 getDocs,
} from "../firebase";
import { useNavigate } from "react-router-dom";
import { YweetType } from "../types";
import { updateProfile, User } from "firebase/auth";

const Profile = ({
 userObj,
 refreshUser,
}: {
 userObj: User | null;
 refreshUser: () => void;
}) => {
 const [myYweets, setMyYweets] = useState<YweetType[]>([]);
 const inputRef = useRef<HTMLInputElement>(null);
 const navigate = useNavigate();
 const onLogOutClick = () => {
  auth.signOut();
  navigate("/");
 };
 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const displayName = inputRef.current?.value;
  if (userObj && userObj.displayName !== displayName)
   await updateProfile(userObj, { displayName });
  refreshUser();
 };

 const getMyYweets = async () => {
  const yweetQuery = query(
   collection(db, "yweets"),
   where("creatorId", "==", userObj?.uid),
   orderBy("createdAt", "desc"),
  );
  const result = (await getDocs(yweetQuery)).docs.map((doc) => ({
   id: doc.id,
   ...doc.data(),
  }));
  setMyYweets(result as YweetType[]);
 };

 useEffect(() => {
  getMyYweets();
 }, []);

 return (
  <div className="container">
   <form onSubmit={onSubmit} className="profileForm">
    <input
     type="text"
     ref={inputRef}
     placeholder="Display Name"
     autoFocus
     className="formInput"
    />
    <input
     type="submit"
     value="Update Profile"
     className="formBtn"
     style={{ marginTop: "10px" }}
    />
   </form>
   <h1>{userObj?.displayName}</h1>
   <div>
    <h2>My Yweets</h2>
    <div>
     {myYweets.map((yweet) => (
      <div key={yweet.id} className="yweet">
       <h4>{yweet.text}</h4>
       {yweet.attachmentUrl && (
        <img src={yweet.attachmentUrl} width="50px" height="50px" />
       )}
      </div>
     ))}
    </div>
    <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
     Log Out
    </span>
   </div>
  </div>
 );
};

export default Profile;
