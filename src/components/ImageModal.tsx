import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ImageModalProps } from "../types/modal.types";
import "../styles/ImageModal.css";

const ImageModal = ({ isOpen, imageUrl, onClose }: ImageModalProps) => {
 const modalRef = useRef<HTMLDivElement>(null);

 const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
  if (event.target === event.currentTarget) {
   onClose();
  }
 };

 useEffect(() => {
  const handleEscapeKey = (event: KeyboardEvent) => {
   if (event.key === "Escape" && isOpen) {
    onClose();
   }
  };

  window.addEventListener("keydown", handleEscapeKey);
  return () => window.removeEventListener("keydown", handleEscapeKey);
 }, [isOpen, onClose]);

 if (!isOpen || !imageUrl) return null;

 return (
  <div
   className="modal-overlay"
   onClick={handleBackdropClick}
   role="presentation"
  >
   <div
    className="modal-content"
    ref={modalRef}
    role="dialog"
    aria-modal="true"
    aria-label="Image preview"
   >
    <div className="modal-image-container">
     <img src={imageUrl} alt="Full size attachment" className="modal-image" />
    </div>
    <button className="modal-close" onClick={onClose} aria-label="Close modal">
     <FontAwesomeIcon icon={faTimes} />
    </button>
   </div>
  </div>
 );
};

export default ImageModal;
