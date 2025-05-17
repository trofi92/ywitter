import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "../firebase";
import { User } from "firebase/auth";
import Yweet from "../components/Yweet";
import { YweetType } from "../types/yweet.types";
import YweetFactory from "../components/YweetFactory";

const Home = ({ userObj }: { userObj: User | null }) => {
 const [getEveryYweets, setGetEveryYweets] = useState<YweetType[]>([]);

 useEffect(() => {
  const q = query(collection(db, "yweets"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
   const yweetArray = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
   })) as YweetType[];
   setGetEveryYweets(yweetArray);
  });
  return () => unsubscribe();
 }, []);

 return (
  <div className="container">
   <YweetFactory userObj={userObj} />
   <div className="yweetList">
    {getEveryYweets.map((yweet) => (
     <Yweet
      key={yweet.id}
      yweetObj={yweet}
      isOwner={yweet.creatorId === userObj?.uid}
     />
    ))}
   </div>
  </div>
 );
};

export default Home;
