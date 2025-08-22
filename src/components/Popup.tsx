// REACT //
import React from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // close on backdrop click
    >
      <div
        className="relative w-[570px] max-w-md rounded-2xl bg-white px-5 py-[37px] shadow-2xl"
        onClick={(e) => e.stopPropagation()} // prevent backdrop close
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
