import { useState, useRef } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { YweetProps } from "../types/yweet.types";
import { ModalState } from "../types/modal.types";
import { db, deleteObject, ref, storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ImageModal from "./ImageModal";

const Yweet = ({ yweetObj, isOwner }: YweetProps) => {
 const [editing, setEditing] = useState(false);
 const [modal, setModal] = useState<ModalState>({
  isOpen: false,
  imageUrl: null,
 });
 const inputRef = useRef<HTMLInputElement>(null);
 const queryClient = useQueryClient();

 const deleteMutation = useMutation({
  mutationFn: async () => {
   try {
    // 1. 먼저 문서 삭제
    await deleteDoc(doc(db, "yweets", `${yweetObj.id}`));

    // 2. 문서 삭제 성공 후 이미지 삭제
    if (yweetObj.attachmentUrl) {
     const imageRef = ref(storage, yweetObj.attachmentUrl);
     await deleteObject(imageRef);
    }
   } catch (error) {
    // 3. 상세한 에러 처리
    if (error instanceof Error) {
     throw new Error(`Yweet 삭제 실패: ${error.message}`);
    }
    throw error;
   }
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["yweets"] });
  },
  onError: (error) => {
   console.error("삭제 중 오류 발생:", error);
   // 사용자에게 적절한 에러 메시지 표시
  },
 });

 const updateMutation = useMutation({
  mutationFn: async (newText: string) => {
   await updateDoc(doc(db, "yweets", `${yweetObj.id}`), {
    text: newText,
   });
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["yweets"] });
   setEditing(false);
  },
 });

 const handleDelete = async () => {
  const ok = window.confirm("Are you sure you want to delete this yweet?");
  if (!ok) return;
  deleteMutation.mutate();
 };

 const handleToggleEditing = () => {
  setEditing((prev) => !prev);
 };

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!inputRef.current?.value) return;
  updateMutation.mutate(inputRef.current.value);
 };

 const handleImageClick = () => {
  if (yweetObj.attachmentUrl) {
   setModal({
    isOpen: true,
    imageUrl: yweetObj.attachmentUrl,
   });
  }
 };

 const handleCloseModal = () => {
  setModal({
   isOpen: false,
   imageUrl: null,
  });
 };

 return (
  <>
   <div className="yweet">
    {editing ? (
     <>
      <form onSubmit={handleSubmit} className="container yweetEdit">
       <input
        ref={inputRef}
        required
        placeholder="Edit your yweet"
        autoFocus
        className="formInput"
       />
       <input
        type="submit"
        value="Update Yweet"
        className="formBtn"
        disabled={updateMutation.isPending}
       />
      </form>
      <button onClick={handleToggleEditing} className="formBtn cancelBtn">
       Cancel
      </button>
     </>
    ) : (
     <>
      <h4>{yweetObj.text}</h4>
      {yweetObj.attachmentUrl && (
       <img
        src={yweetObj.attachmentUrl}
        width="50px"
        height="50px"
        onClick={handleImageClick}
        className="yweet__thumbnail"
        alt="Yweet attachment"
       />
      )}
      {isOwner && (
       <div className="yweet__actions">
        <span onClick={handleDelete}>
         <FontAwesomeIcon icon={faTrash} />
        </span>
        <span onClick={handleToggleEditing}>
         <FontAwesomeIcon icon={faPencilAlt} />
        </span>
       </div>
      )}
     </>
    )}
   </div>

   <ImageModal
    isOpen={modal.isOpen}
    imageUrl={modal.imageUrl}
    onClose={handleCloseModal}
   />
  </>
 );
};

export default Yweet;
