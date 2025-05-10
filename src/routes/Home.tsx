import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
 addDoc,
 collection,
 onSnapshot,
 orderBy,
 query,
} from "firebase/firestore";
import { User } from "firebase/auth";

interface Yweet {
 id: string;
 text?: string;
 createdAt?: number;
 creatorId?: string;
}

const Home = ({ userObj }: { userObj: User | null }) => {
 const [yweet, setYweet] = useState("");
 const [getEveryYweets, setGetEveryYweets] = useState<Yweet[]>([]);

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  await addDoc(collection(db, "yweets"), {
   text: yweet,
   createdAt: Date.now(),
   creatorId: userObj?.uid,
  });
  setYweet("");
 };

 const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setYweet(value);
 };

 useEffect(() => {
  const q = query(collection(db, "yweets"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
   const yweetArray = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
   })) as Yweet[];
   setGetEveryYweets(yweetArray);
  });

  return () => unsubscribe();
 }, []);

 return (
  <>
   <form onSubmit={onSubmit}>
    <input
     value={yweet}
     onChange={onChange}
     type="text"
     placeholder="무엇을 생각하고 있나요?"
     maxLength={120}
    />
    <input type="submit" value="Yweet" />
   </form>
   <div>
    {getEveryYweets.map((yweet) => (
     <div key={yweet.id}>
      <h4>{yweet.text}</h4>
      <p>작성자: {yweet.creatorId}</p>
      <p>작성시간: {new Date(yweet.createdAt || 0).toLocaleString()}</p>
     </div>
    ))}
   </div>
  </>
 );
};

export default Home;
