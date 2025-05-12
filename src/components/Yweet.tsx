import { useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { YweetType } from "../types/yweet.types";
import { db, deleteObject, ref, storage } from "../firebase";

interface YweetProps {
 yweetObj: YweetType;
 isOwner: boolean;
}

const Yweet = ({ yweetObj, isOwner }: YweetProps) => {
 const [editing, setEditing] = useState(false);
 const [newYweet, setNewYweet] = useState(yweetObj.text);

 const onDeleteClick = async () => {
  const ok = window.confirm("Are you sure you want to delete this yweet?");
  if (ok) await deleteDoc(doc(db, "yweets", `${yweetObj.id}`));
  if (yweetObj.attachmentUrl) {
   const imageRef = ref(storage, yweetObj.attachmentUrl);
   await deleteObject(imageRef);
  }
 };

 const toggleEditing = () => {
  setEditing((prev) => !prev);
 };

 const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;
  setNewYweet(value);
 };

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  await updateDoc(doc(db, "yweets", `${yweetObj.id}`), {
   text: newYweet,
  });
  setEditing(false);
  setNewYweet("");
 };

 return (
  <div>
   {editing ? (
    <>
     <form onSubmit={onSubmit}>
      <input onChange={onChange} value={newYweet} required />
     </form>
     <button onClick={toggleEditing}>Cancel</button>
    </>
   ) : (
    <>
     <h4>{yweetObj.text}</h4>
     {yweetObj.attachmentUrl && (
      <img src={yweetObj.attachmentUrl} width="50px" height="50px" />
     )}
     {isOwner && (
      <>
       <button onClick={onDeleteClick}>Delete Yweet</button>
       <button onClick={toggleEditing}>Edit Yweet</button>
      </>
     )}
    </>
   )}
  </div>
 );
};

export default Yweet;
