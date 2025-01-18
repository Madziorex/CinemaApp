import { alignPropType } from "react-bootstrap/esm/types";
import Select from "react-select";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
    borderColor: state.isFocused ? "red" : "transparent",
    boxShadow: state.isFocused ? "0 0 0 2px red" : "none",
    height: "35px",
    minHeight: "35px",
    "&:hover": {
      borderColor: "#666",
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#ccc",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "black",
    color: "white",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? "#555"
      : state.isSelected
      ? "red"
      : "black",
    color: state.isSelected ? "white" : "white",
    "&:hover": {
      backgroundColor: "#333",
    },
  }),
};

const MySelect = ({ options, onChange, value }: any) => (
  <Select
    styles={customStyles}
    options={options}
    onChange={onChange}
    value={value}
    placeholder="Wybierz film..."
  />
);

export default MySelect;
