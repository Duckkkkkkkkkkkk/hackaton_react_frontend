import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { useLocation } from "react-router-dom";
import "./RoleManager.css";

interface Option {
  value: string;
  label: string;
  color: string;
}

const roleOptions: Record<string, Option> = {
  ADMIN: { value: "ADMIN", label: "Администратор", color: "#63FF85" },
  SPECIALIST: { value: "SPECIALIST", label: "Специалист", color: "#DE8BEB" },
  GUEST: { value: "GUEST", label: "Гость", color: "#8BC8EB" },
};

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    boxShadow: "none",
    borderColor: state.isFocused ? "#aaa" : "#ccc",
    height: "5.4vh",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#ddd" : state.data.color,
    color: "black",
    "&:hover": {
      backgroundColor: state.data.color,
    },
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
  menu: (provided: any) => ({
    ...provided,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  }),
};

interface RoleManagerProps {
  role: string;
  onRoleChange?: (newRole: Option) => void;
  disabled?: boolean;
}

const RoleManager: React.FC<RoleManagerProps> = ({
  role,
  onRoleChange,
  disabled = false,
}) => {
  const location = useLocation();

  const options = Object.values(roleOptions).filter(option => option.value !== "ADMIN");

  const defaultOption =
    options.find((option) => option.value === role) || options[0];
  const [currentRole, setCurrentRole] = useState<Option | null>(defaultOption);

  useEffect(() => {
    if (role) {
      const newRole =
        options.find((option) => option.value === role) || options[0];
      setCurrentRole(newRole);
    }
  }, [role, options]);

  const handleChange = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setCurrentRole(selectedOption);
      if (onRoleChange) {
        onRoleChange(selectedOption);
      }
    }
  };

  return (
    <Select
      value={currentRole}
      onChange={handleChange}
      options={options}
      styles={customStyles}
      classNamePrefix="react-select"
      className="role-container"
      isSearchable={false}
      isDisabled={disabled}
    />
  );
};

export default RoleManager;
