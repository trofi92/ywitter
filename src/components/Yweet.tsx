import { useState, useRef } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { YweetType } from "../types/yweet.types";
import { db, deleteObject, ref, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

interface YweetProps {
 yweetObj: YweetType;
 isOwner: boolean;
}

const Yweet = ({ yweetObj, isOwner }: YweetProps) => {
 const [editing, setEditing] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);

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

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  await updateDoc(doc(db, "yweets", `${yweetObj.id}`), {
   text: inputRef.current?.value,
  });
  setEditing(false);
 };

 return (
  <div className="yweet">
   {editing ? (
    <>
     <form onSubmit={onSubmit} className="container yweetEdit">
      <input
       ref={inputRef}
       required
       placeholder="Edit your yweet"
       autoFocus
       className="formInput"
      />
      <input type="submit" value="Update Yweet" className="formBtn" />
     </form>
     <button onClick={toggleEditing} className="formBtn cancelBtn">
      Cancel
     </button>
    </>
   ) : (
    <>
     <h4>{yweetObj.text}</h4>
     {yweetObj.attachmentUrl && (
      <img src={yweetObj.attachmentUrl} width="50px" height="50px" />
     )}
     {isOwner && (
      <div className="yweet__actions">
       <span onClick={onDeleteClick}>
        <FontAwesomeIcon icon={faTrash} />
       </span>
       <span onClick={toggleEditing}>
        <FontAwesomeIcon icon={faPencilAlt} />
       </span>
      </div>
     )}
    </>
   )}
  </div>
 );
};

export default Yweet;
