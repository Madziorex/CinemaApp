import React from "react";
import "../css/PopupForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PopupForm: React.FC<PopupFormProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <Button className="popup-close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <h2 className="popup-title">{title}</h2>
        <div className="popup-content">{children}</div>
      </div>
    </div>
  );
};

export default PopupForm;
