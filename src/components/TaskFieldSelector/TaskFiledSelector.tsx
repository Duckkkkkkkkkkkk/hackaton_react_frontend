import React from 'react';
import './TaskFieldSelector.css';

interface Field {
  name: string;
  label: string;
}

interface TaskFieldSelectorProps {
  fields: Field[];
  visibleFields: string[];
  onToggleField: (fieldName: string) => void;
  onDateChange?: (date: string) => void;
  onExecutorChange?: (executor: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TaskFieldSelector: React.FC<TaskFieldSelectorProps> = ({
  fields,
  visibleFields,
  onToggleField,
  onDateChange,
  onExecutorChange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="task-field-modal-overlay" onClick={onClose}>
      <div className="task-field-modal" onClick={(e) => e.stopPropagation()}>
        <button className="task-close-button" onClick={onClose}>×</button>
        <div className="task-dropdown-menu">
          {fields.map((field) => (
            <label key={field.name} className="task-field-option">
              <span>{field.label}</span>
              <input
                type="checkbox"
                checked={visibleFields.includes(field.name)}
                onChange={() => onToggleField(field.name)}
              />
            </label>
          ))}
          <input
            type="date"
            className="task-date-picker"
            onChange={(e) => onDateChange && onDateChange(e.target.value)}
            placeholder="Выберите дату"
          />
          <input
            type="text"
            className="executor-picker"
            onChange={(e) => onExecutorChange && onExecutorChange(e.target.value)}
            placeholder="Исполнитель"
          />
          <button className="task-apply-button" onClick={() => console.log("Применить фильтры")}>
            Применить
          </button>
          <div className="task-clear-filters" onClick={() => console.log("Сбросить фильтры")}>
            Сбросить фильтры
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFieldSelector;
