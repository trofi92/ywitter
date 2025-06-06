import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { ImageModalProps } from "../types/modal.types";
import "../styles/ImageModal.css";

const ANIMATION_DURATION = 400;

const ImageModal = ({ isOpen, imageUrl, onClose }: ImageModalProps) => {
 const modalRef = useRef<HTMLDivElement>(null);
 const [isClosing, setIsClosing] = useState(false);
 const [isVisible, setIsVisible] = useState(false);
 const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

 const handleClose = () => {
  if (closeTimeoutRef.current) {
   clearTimeout(closeTimeoutRef.current);
  }

  setIsClosing(true);
  closeTimeoutRef.current = setTimeout(() => {
   setIsVisible(false);
   onClose();
  }, ANIMATION_DURATION);
 };

 const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
  if (event.target === event.currentTarget) {
   handleClose();
  }
 };

 useEffect(() => {
  if (isOpen) {
   setIsVisible(true);
   setIsClosing(false);
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
   if (event.key === "Escape" && isOpen) {
    handleClose();
   }
  };

  window.addEventListener("keydown", handleEscapeKey);
  return () => {
   window.removeEventListener("keydown", handleEscapeKey);
   if (closeTimeoutRef.current) {
    clearTimeout(closeTimeoutRef.current);
   }
  };
 }, [isOpen]);

 if (!isVisible || !imageUrl) return null;

 return (
  <div
   className={`modal-overlay ${isClosing ? "closing" : ""}`}
   onClick={handleBackdropClick}
   role="presentation"
  >
   <div
    className={`modal-content ${isClosing ? "closing" : ""}`}
    ref={modalRef}
    role="dialog"
    aria-modal="true"
    aria-label="Image preview"
   >
    <div className="modal-image-container">
     <img src={imageUrl} alt="Full size attachment" className="modal-image" />
    </div>
    <button
     className="modal-close"
     onClick={handleClose}
     aria-label="Close modal"
    >
     <FontAwesomeIcon icon={faTimes} />
    </button>
   </div>
  </div>
 );
};

export default ImageModal;
