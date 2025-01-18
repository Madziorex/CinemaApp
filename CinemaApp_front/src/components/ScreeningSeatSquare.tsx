import React from "react";
import "../css/ScreeningSeatSquare.css";
import { useAuth } from "../services/AuthContext";

interface ScreeningSeatSquareProps {
  id: string;
  row: string;
  number: number;
  isSelected: boolean;
  isReserved?: boolean;
  onClick: () => void;
}

const ScreeningSeatSquare: React.FC<ScreeningSeatSquareProps> = ({
  id,
  row,
  number,
  isSelected,
  isReserved,
  onClick,
}) => {
  const { isAdmin, isEmployee } = useAuth();
  
  return (
<div
  className={`seat-square ${isSelected ? "selected" : ""} ${
    isReserved ? (isAdmin || isEmployee ? "admin-reserved" : "unavailable") : ""
  }`}
  onClick={onClick}
/>
  );
};

export default ScreeningSeatSquare;
