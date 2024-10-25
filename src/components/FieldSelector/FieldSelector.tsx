import React, { useEffect, useState } from "react";
import "./FieldSelector.css";
import icon_down from "../../images/icons/icon_down.svg";

interface FieldSelectorProps {
  fields: { name: string; label: string }[];
  visibleFields: string[];
  onToggleField: (fieldName: string) => void;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  fields,
  visibleFields,
  onToggleField,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest(".field-selector")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleToggleField = (fieldName: string) => {
    onToggleField(fieldName);
  };

  const handleToggleAllFields = () => {
    if (visibleFields.length === fields.length) {
      fields.forEach((field) => handleToggleField(field.name));
    } else {
      fields.forEach((field) => {
        if (!visibleFields.includes(field.name)) {
          handleToggleField(field.name);
        }
      });
    }
  };

  return (
    <div className="field-selector">
      <button onClick={() => setDropdownOpen(!dropdownOpen)}>
        Показать поля
        <img src={icon_down} />
      </button>
      {dropdownOpen && (
        <div className="dropdown-menu">
          <label>
            <p className="field_all">Все</p>
            <input
              type="checkbox"
              checked={visibleFields.length === fields.length}
              onChange={handleToggleAllFields}
            />
          </label>
          {fields.map((field) => (
            <label key={field.name}>
              <p>{field.label}</p>
              <input
                type="checkbox"
                checked={visibleFields.includes(field.name)}
                onChange={() => handleToggleField(field.name)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldSelector;
