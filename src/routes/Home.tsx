import { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, onSnapshot, orderBy, query } from "../firebase";
import { storage, ref, uploadString, getDownloadURL } from "../firebase";
import { User } from "firebase/auth";
import Yweet from "../components/Yweet";
import { YweetType } from "../types/yweet.types";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }: { userObj: User | null }) => {
 const [getEveryYweets, setGetEveryYweets] = useState<YweetType[]>([]);
 const [attachment, setAttachment] = useState("");
 const inputRef = useRef<HTMLInputElement>(null);

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const attachmentRef = ref(storage, `files/${userObj?.uid}/${uuidv4()}`);
  const response = await uploadString(attachmentRef, attachment, "data_url");
  const attachmentUrl = await getDownloadURL(response.ref);

  await addDoc(collection(db, "yweets"), {
   text: inputRef.current?.value,
   createdAt: Date.now(),
   creatorId: userObj?.uid,
   attachmentUrl: attachmentUrl,
  });
  if (inputRef.current) inputRef.current.value = "";
  setAttachment("");
 };

 const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const {
   target: { files },
  } = event;
  const theFile = files?.[0];
  const reader = new FileReader();
  reader.onloadend = (finishedEvent) => {
   const { result } = finishedEvent.currentTarget as FileReader;
   if (result) setAttachment(result as string);
  };
  if (theFile) reader.readAsDataURL(theFile);
 };

 const onClearAttachment = () => setAttachment("");

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
  <>
   <form onSubmit={onSubmit}>
    <input
     ref={inputRef}
     type="text"
     placeholder="무엇을 생각하고 있나요?"
     maxLength={120}
    />
    <input type="file" accept="image/*" onChange={onFileChange} />
    <input type="submit" value="Yweet" />
    {attachment && (
     <>
      <img src={attachment} width="50px" height="50px" />
      <button onClick={onClearAttachment}>Clear</button>
     </>
    )}
   </form>
   <div>
    {getEveryYweets.map((yweet) => (
     <Yweet
      key={yweet.id}
      yweetObj={yweet}
      isOwner={yweet.creatorId === userObj?.uid}
     />
    ))}
   </div>
  </>
 );
};

export default Home;
