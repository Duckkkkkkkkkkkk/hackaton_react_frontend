import React, { useState } from 'react';
import './EditPasswordButton.css';
import PasswordModal from '../PasswordModal/PasswordModal';

import icon_edit from "../../images/icons/icon_edit_pswd.svg"

const EditPasswordButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="edit-button" onClick={handleOpenModal}>
        <img src={icon_edit} alt="Button" className="edit-icon" />
        <p>Изменить</p>
      </div>
      <PasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default EditPasswordButton;
