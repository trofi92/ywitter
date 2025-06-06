export interface ModalState {
 isOpen: boolean;
 imageUrl: string | null;
}

export interface ImageModalProps {
 isOpen: boolean;
 imageUrl: string | null;
 onClose: () => void;
}
