import React from 'react';
import './SaveButton.css';

import icon_save from "../../images/icons/icon_save.svg";

interface SaveButtonProps {
  onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave }) => {
  return (
    <div className="save-button" onClick={onSave}>
      <img src={icon_save} alt="Сохранить" className="save-icon"/>
      <p>Сохранить</p>
    </div>
  );
};

export default SaveButton;
