import { useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

interface VerticalRadiosProps {
  onFilterChange: (filter: string) => void;
}

function VerticalRadios({ onFilterChange }: VerticalRadiosProps) {
  const [radioValue, setRadioValue] = useState("1");

  const radios = [
    { name: "All movies", value: "1" },
    { name: "2D", value: "2" },
    { name: "3D", value: "3" },
    { name: "Subtitled", value: "4" },
  ];

  const handleFilterChange = (value: string) => {
    setRadioValue(value);
    onFilterChange(value);
  };

  return (
    <div className="action-buttons">
      <ButtonGroup className="d-flex">
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant="secondary"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            className="action-button-single"
            onChange={(e) => handleFilterChange(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </div>
  );
}

export default VerticalRadios;
