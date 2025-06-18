import { useState, useEffect, useRef } from "react";
import {
 auth,
 collection,
 db,
 orderBy,
 query,
 where,
 getDocs,
 storage,
 ref,
 uploadString,
 getDownloadURL,
 deleteObject,
} from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { YweetType } from "../types";
import { updateProfile, User } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
 faCamera,
 faTimes,
 faSpinner,
 faTrash,
 faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Profile.css";
import ImageModal from "../components/ImageModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Profile = ({
 userObj,
 refreshUser,
}: {
 userObj: User | null;
 refreshUser: () => void;
}) => {
 const [myYweets, setMyYweets] = useState<YweetType[]>([]);
 const [attachment, setAttachment] = useState("");
 const [isUpdating, setIsUpdating] = useState(false);
 const [editingYweet, setEditingYweet] = useState<string | null>(null);
 const [modal, setModal] = useState({
  isOpen: false,
  imageUrl: null as string | null,
 });
 const inputRef = useRef<HTMLInputElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);
 const yweetInputRef = useRef<HTMLInputElement>(null);
 const navigate = useNavigate();
 const queryClient = useQueryClient();

 const onLogOutClick = () => {
  auth.signOut();
  navigate("/");
 };

 const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const displayName = inputRef.current?.value;
  const isDisplayNameChanged = userObj && userObj.displayName !== displayName;
  const hasNewImage = attachment !== "";

  if (!isDisplayNameChanged && !hasNewImage) {
   alert("변경할 내용이 없습니다.");
   return;
  }

  setIsUpdating(true);
  try {
   let photoURL = userObj?.photoURL;

   if (hasNewImage && userObj) {
    const storageRef = ref(storage, `profiles/${userObj.uid}/profile.jpg`);
    const response = await uploadString(storageRef, attachment, "data_url");

    if (!response) {
     throw new Error("이미지 업로드에 실패했습니다.");
    }

    photoURL = await getDownloadURL(response.ref);
   }

   if (userObj) {
    const updateData: { displayName?: string; photoURL?: string } = {};

    if (isDisplayNameChanged) {
     updateData.displayName = displayName || undefined;
    }

    if (hasNewImage) {
     updateData.photoURL = photoURL || undefined;
    }

    await updateProfile(userObj, updateData);
    refreshUser();
    setAttachment("");

    if (inputRef.current) {
     inputRef.current.value = "";
    }

    alert("프로필이 업데이트되었습니다.");
   }
  } catch (error) {
   console.error("프로필 업데이트 실패:", error);
   alert("프로필 업데이트에 실패했습니다.");
  } finally {
   setIsUpdating(false);
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
   if (result) {
    setAttachment(result as string);
   }
  };
  if (theFile) reader.readAsDataURL(theFile);
 };

 const onUploadClick = async () => {
  if (!attachment || !userObj) return;

  try {
   const storageRef = ref(storage, `profiles/${userObj.uid}/profile.jpg`);
   const response = await uploadString(storageRef, attachment, "data_url");

   if (!response) {
    throw new Error("이미지 업로드에 실패했습니다.");
   }

   const photoURL = await getDownloadURL(response.ref);

   await updateProfile(userObj, { photoURL });

   refreshUser();
   setAttachment("");

   alert("프로필 이미지가 업데이트되었습니다.");
  } catch (error) {
   console.error("프로필 이미지 업로드 실패:", error);
   alert("프로필 이미지 업로드에 실패했습니다.");
  }
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

 const onClearAttachment = () => setAttachment("");

 const handleImageClick = () => {
  if (userObj?.photoURL) {
   setModal({
    isOpen: true,
    imageUrl: userObj.photoURL,
   });
  }
 };

 const handleCloseModal = () => {
  setModal({
   isOpen: false,
   imageUrl: null,
  });
 };

 const handleYweetImageClick = (imageUrl: string) => {
  setModal({
   isOpen: true,
   imageUrl,
  });
 };

 // Yweet 삭제 mutation
 const deleteMutation = useMutation({
  mutationFn: async (yweetId: string) => {
   try {
    const yweet = myYweets.find((y) => y.id === yweetId);
    if (!yweet) throw new Error("Yweet not found");

    await deleteDoc(doc(db, "yweets", yweetId));
    if (yweet.attachmentUrl) {
     const imageRef = ref(storage, yweet.attachmentUrl);
     await deleteObject(imageRef);
    }
   } catch (error) {
    if (error instanceof Error) {
     throw new Error(`Yweet 삭제 실패: ${error.message}`);
    }
    throw error;
   }
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["yweets"] });
  },
 });

 // Yweet 수정 mutation
 const updateMutation = useMutation({
  mutationFn: async ({
   yweetId,
   newText,
  }: {
   yweetId: string;
   newText: string;
  }) => {
   await updateDoc(doc(db, "yweets", yweetId), {
    text: newText,
   });
  },
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["yweets"] });
   setEditingYweet(null);
  },
 });

 const handleDeleteYweet = async (yweetId: string) => {
  const ok = window.confirm("이 Yweet을 삭제하시겠습니까?");
  if (!ok) return;
  deleteMutation.mutate(yweetId);
 };

 const handleToggleEditing = (yweetId: string) => {
  setEditingYweet(editingYweet === yweetId ? null : yweetId);
 };

 const handleSubmitEdit = (
  event: React.FormEvent<HTMLFormElement>,
  yweetId: string,
 ) => {
  event.preventDefault();
  if (!yweetInputRef.current?.value) return;
  updateMutation.mutate({ yweetId, newText: yweetInputRef.current.value });
 };

 return (
  <div className="profileContainer">
   <div className="profile-header">
    <div className="profile-image-container">
     {attachment ? (
      <div className="profile-image-preview">
       <img src={attachment} alt="Profile preview" className="profile-image" />
       <div className="profile-image-clear" onClick={onClearAttachment}>
        <span>Remove</span>
        <FontAwesomeIcon icon={faTimes} />
       </div>
       <button
        className="profile-image-upload-btn"
        onClick={onUploadClick}
        type="button"
       >
        Upload
       </button>
      </div>
     ) : (
      userObj?.photoURL && (
       <img
        src={userObj.photoURL}
        alt="Profile"
        className="profile-image"
        onClick={handleImageClick}
        style={{ cursor: "pointer" }}
       />
      )
     )}
     <label
      htmlFor="profile-image"
      className="profile-image-upload"
      title="프로필 이미지 변경"
     >
      <FontAwesomeIcon icon={faCamera} />
     </label>
     <input
      id="profile-image"
      type="file"
      ref={fileInputRef}
      accept="image/*"
      onChange={onFileChange}
      style={{ display: "none" }}
     />
    </div>

    <form onSubmit={onSubmit} className="profileForm">
     <input
      type="text"
      ref={inputRef}
      placeholder="Display Name"
      autoFocus
      className="formInput"
      disabled={isUpdating}
     />
     <input
      type="submit"
      value={isUpdating ? "Updating..." : "Update Profile"}
      className="formBtn"
      style={{ marginTop: "10px" }}
      disabled={isUpdating}
     />
     {isUpdating && (
      <div className="loading-spinner">
       <FontAwesomeIcon icon={faSpinner} spin />
       <span>프로필 업데이트 중...</span>
      </div>
     )}
    </form>

    <button className="formBtn logOut" onClick={onLogOutClick}>
     Log Out
    </button>
   </div>

   <h1 className="profile-username">{userObj?.displayName}</h1>
   <div>
    <h2 className="profile-section-title">My Yweets</h2>
    <div>
     {myYweets.map((yweet) => (
      <div key={yweet.id} className="yweet">
       {editingYweet === yweet.id ? (
        <>
         <form
          onSubmit={(e) => handleSubmitEdit(e, yweet.id)}
          className="yweetEdit"
         >
          <input
           ref={yweetInputRef}
           required
           placeholder="Edit your yweet"
           defaultValue={yweet.text}
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
         <button
          onClick={() => handleToggleEditing(yweet.id)}
          className="formBtn cancelBtn"
         >
          Cancel
         </button>
        </>
       ) : (
        <>
         <h4>{yweet.text}</h4>
         {yweet.attachmentUrl && (
          <img
           src={yweet.attachmentUrl}
           width="50px"
           height="50px"
           onClick={() =>
            yweet.attachmentUrl && handleYweetImageClick(yweet.attachmentUrl)
           }
           className="yweet__thumbnail"
           alt="Yweet attachment"
          />
         )}
         <div className="yweet__actions">
          <span onClick={() => handleDeleteYweet(yweet.id)}>
           <FontAwesomeIcon icon={faTrash} />
          </span>
          <span onClick={() => handleToggleEditing(yweet.id)}>
           <FontAwesomeIcon icon={faPencilAlt} />
          </span>
         </div>
        </>
       )}
      </div>
     ))}
    </div>
   </div>

   <ImageModal
    isOpen={modal.isOpen}
    imageUrl={modal.imageUrl}
    onClose={handleCloseModal}
   />
  </div>
 );
};

export default Profile;
