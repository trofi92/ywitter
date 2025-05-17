import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, db, User } from "../firebase";
import { storage, ref, uploadString, getDownloadURL } from "../firebase";
import { useRef, useState } from "react";

const YweetFactory = ({ userObj }: { userObj: User | null }) => {
 const [attachment, setAttachment] = useState("");
 const inputRef = useRef<HTMLInputElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

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
  <>
   <form onSubmit={onSubmit}>
    <input
     ref={inputRef}
     type="text"
     placeholder="무엇을 생각하고 있나요?"
     maxLength={120}
    />
    <input
     type="file"
     accept="image/*"
     onChange={onFileChange}
     ref={fileInputRef}
    />
    <input type="submit" value="Yweet" />
    {attachment && (
     <>
      <img src={attachment} width="50px" height="50px" />
      <button onClick={onClearAttachment}>Clear</button>
     </>
    )}
   </form>
  </>
 );
};

export default YweetFactory;
