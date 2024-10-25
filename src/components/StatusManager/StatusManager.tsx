import React, { useState, useEffect } from "react";
import Select, { SingleValue, components } from "react-select";
import { useLocation } from "react-router-dom";
import "./StatusManager.css";
import { DropdownIndicator } from "react-select/dist/declarations/src/components/indicators";

interface Option {
  value: string;
  label: string;
  color: string;
}

const generalOptions: Option[] = [
  { value: "COMPLETED", label: "Завершен", color: "#8beba0" },
  { value: "CHECK", label: "Проверка", color: "#ebdc8b" },
  { value: "INPROGRESS", label: "В процессе", color: "#de8beb" },
  { value: "NOTSTARTED", label: "Не начато", color: "#8bc8eb" },
  { value: "CANCEL", label: "Отмена", color: "#EB9C8B" },
];
const internOptions: Option[] = [
  { value: "INPROGRESS", label: "В процессе", color: "#DE8BEB" },
  { value: "SUCCESSCOMPLETED", label: "Завершено-актив", color: "#8BEBA0" },
  { value: "BADCOMPELTED", label: "Завершено-плохо", color: "#EB9C8B" },
];

const taskOptions: Option[] = [
  { value: "COMPLETED", label: "Завершен", color: "#8beba0" },
  { value: "VERIFICATION", label: "Проверка", color: "#ebdc8b" },
  { value: "INPROGRESS", label: "В процессе", color: "#de8beb" },
  { value: "NOTSTARTED", label: "Не начато", color: "#8bc8eb" },
  { value: "BLOCKED", label: "Отмена", color: "#EB9C8B" },
];
const specialistOptions: Option[] = [
  { value: "SPECIALIST", label: "Специалист", color: "#8BC8EB" },
];
const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    boxShadow: "none",
    borderColor: state.isFocused ? "#aaa" : "#ccc",
    height: "5.4vh",
    backgroundColor: state.selectProps.value
      ? state.selectProps.value.color
      : "#f0f0f0",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.data.color,
    color: "black",
    "&:hover": {
      backgroundColor: state.isFocused ? "#ddd" : state.data.color,
    },
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.data.color,
    color: "black",
    padding: "0.3vh 0.3vw",
  }),
  menu: (provided: any) => ({
    ...provided,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  }),
};

interface StatusManagerProps {
  status: string;
  onStatusChange?: (newStatus: Option) => void;
  disabled?: boolean;
}

const StatusManager: React.FC<StatusManagerProps> = ({
  status,
  onStatusChange,
  disabled = false,
}) => {
  const location = useLocation();

  // Определение списка статусов в зависимости от URL
  const options = location.pathname.includes("/tasks")
    ? taskOptions
    : location.pathname.includes("/intern")
      ? internOptions
      : location.pathname.includes("/trainee")
      ? internOptions
      : location.pathname.includes("/specialist")
      ? specialistOptions
      : generalOptions;

  const defaultOption =
    options.find((option) => option.value === status) || options[0];
  const [currentStatus, setCurrentStatus] = useState<Option | null>(
    defaultOption
  );

  useEffect(() => {
    if (status) {
      const newStatus =
        options.find((option) => option.value === status) || options[0];
      setCurrentStatus(newStatus);
    }
  }, [status, options]);

  const handleChange = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      console.log("Selected option:", selectedOption);
      setCurrentStatus(selectedOption);
      if (onStatusChange) {
        onStatusChange(selectedOption);
      }
    }
  };

  return (
    <Select
      value={currentStatus}
      onChange={handleChange}
      options={options}
      styles={customStyles}
      classNamePrefix="react-select"
      className="status-container"
      isSearchable={false}
      isDisabled={disabled}
    />
  );
};

export default StatusManager;
