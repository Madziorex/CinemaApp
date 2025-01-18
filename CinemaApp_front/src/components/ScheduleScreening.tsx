import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ScheduleScreening.css";

const ScheduleScreening: React.FC<{
    id: string;
    hallName: string;
    screeningTime: string;
    is3D: boolean;
    isSubtitled: boolean;
    endTime: string;
}> = ({ id, hallName, screeningTime, is3D, isSubtitled, endTime }) => {
  const navigate = useNavigate();

  const formattedStartTime = new Date(screeningTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedEndTime = new Date(endTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const handleNavigate = () => {
    navigate(`/screening/${id}`);
  };

  return (
    <div className="schedule-screening" onClick={handleNavigate}>
      <div className="time-range">
        {formattedStartTime}
        <span className="end-time"> - {formattedEndTime}</span>
      </div>
      <div>
        {hallName}
      </div>
      <div>
        {is3D ? "3D" : "2D"}
        {isSubtitled ? " | Subtitled" : ""}
      </div>
    </div>
  );
};

export default ScheduleScreening;
