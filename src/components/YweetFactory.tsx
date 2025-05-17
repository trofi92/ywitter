import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, db, User } from "../firebase";
import { storage, ref, uploadString, getDownloadURL } from "../firebase";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const YweetFactory = ({ userObj }: { userObj: User | null }) => {
 const [attachment, setAttachment] = useState("");
 const inputRef = useRef<HTMLInputElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (inputRef.current?.value == "") {
   alert("내용을 입력해 주세요.");
   return;
  }

  if (!attachment) {
   alert("파일을 선택해 주세요.");
   return;
  }

  try {
   const attachmentRef = ref(storage, `files/${userObj?.uid}/${uuidv4()}`);
   const response = await uploadString(attachmentRef, attachment, "data_url");

   if (!response) {
    throw new Error("파일 업로드에 실패했습니다.");
   }

   const attachmentUrl = await getDownloadURL(response.ref);

   await addDoc(collection(db, "yweets"), {
    text: inputRef.current?.value,
    createdAt: Date.now(),
    creatorId: userObj?.uid,
    attachmentUrl: attachmentUrl,
   });

   if (inputRef.current) inputRef.current.value = "";
   if (fileInputRef.current) fileInputRef.current.value = "";
   setAttachment("");
  } catch (error) {
   console.error("업로드 중 오류 발생:", error);
   alert("업로드 중 오류가 발생했습니다.");
  }
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

 return (
  <form onSubmit={onSubmit} className="factoryForm">
   <div className="factoryInput__container">
    <input
     className="factoryInput__input"
     ref={inputRef}
     type="text"
     placeholder="What's on your mind?"
     maxLength={120}
    />
    <input type="submit" value="&rarr;" className="factoryInput__arrow" />
   </div>
   <label htmlFor="attach-file" className="factoryInput__label">
    <span>Add photos</span>
    <FontAwesomeIcon icon={faPlus} />
   </label>
   <input
    id="attach-file"
    type="file"
    accept="image/*"
    onChange={onFileChange}
    style={{
     opacity: 0,
    }}
   />
   {attachment && (
    <div className="factoryForm__attachment">
     <img
      src={attachment}
      style={{
       backgroundImage: attachment,
      }}
     />
     <div className="factoryForm__clear" onClick={onClearAttachment}>
      <span>Remove</span>
      <FontAwesomeIcon icon={faTimes} />
     </div>
    </div>
   )}
  </form>
 );
};

export default YweetFactory;
