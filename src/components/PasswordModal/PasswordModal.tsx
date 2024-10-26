import React, { useState, useEffect } from 'react';
import './PasswordModal.css';
import { confirmPassword, updatePassword } from '../../api/confirmPassword/ConfirmPasswordApi';
import Snackbar from '../Snackbar/Snackbar';
import { SnackbarType } from '../Snackbar/Snackbar';

import open_eye_icon from '../../images/icons/icon_open_eye.svg';
import close_eye_icon from '../../images/icons/icon_close_eye.svg';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [snackbarType, setSnackbarType] = useState<SnackbarType | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleNext = async () => {
    const isValid = await confirmPassword(password);
    if (isValid) {
      setShowNewPasswordModal(true);
    } else {
      setSnackbarType('differentPassword');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowNewPasswordModal(false);
      setPassword('');
      setPasswordVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {!showNewPasswordModal ? (
        <div className="password-modal-overlay">
          <div className="password-modal-content">
            <div className="password-modal-container">
              <h2>Введите старый пароль</h2>
              <div className="password-form-group password-group">
                <div className="password-input-container">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Старый пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="password-input"
                    autoComplete="new-password"
                    />
                  <img
                    src={passwordVisible ? close_eye_icon : open_eye_icon}
                    alt="Toggle password visibility"
                    className="toggle-password-icon"
                    onClick={togglePasswordVisibility}
                  />
                </div>
                <button className="forgot-password-button">Забыли пароль?</button>
                <button className="password-button next-button" onClick={handleNext}>Далее</button>
              </div>
              <button className="password-close-button" onClick={onClose}></button>
            </div>
          </div>
        </div>
      ) : (
        <NewPasswordModal onClose={onClose} setSnackbarType={setSnackbarType} />
      )}
      {snackbarType && (
        <Snackbar type={snackbarType} onClose={() => setSnackbarType(null)} />
      )}
    </>
  );
};

interface NewPasswordModalProps {
  onClose: () => void;
  setSnackbarType: (type: SnackbarType) => void;
}

const NewPasswordModal: React.FC<NewPasswordModalProps> = ({ onClose, setSnackbarType }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async () => {
    if (newPassword === confirmPassword) {
      const isSuccess = await updatePassword(newPassword, confirmPassword);
      if (isSuccess) {
        setSnackbarType('successChangePassword');
        onClose();
      } else {
        setSnackbarType('errorSendingData');
      }
    } else {
      setSnackbarType('differentPassword');
    }
  };

  useEffect(() => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordVisible(false);
  }, []);

  return (
    <div className="password-modal-overlay">
      <div className="password-modal-content">
        <div 
          className="password-modal-container"
          style={{
            marginTop: "9vh",
            marginBottom: "9vh"
          }}>
          <h2>Введите новый пароль</h2>
          <div className="password-form-group password-group">
            <div className="password-input-container modal2">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="password-input"
                autoComplete="new-password"
                />
              <img
                src={passwordVisible ? close_eye_icon : open_eye_icon}
                alt="Toggle password visibility"
                className="toggle-password-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <div className="password-input-container modal2">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="password-input"
                autoComplete="new-password"
                />
              <img
                src={passwordVisible ? close_eye_icon : open_eye_icon}
                alt="Toggle password visibility"
                className="toggle-password-icon"
                onClick={togglePasswordVisibility}
              />
            </div>
            <button className="password-button confirm-button" onClick={handleSubmit}>Подтвердить</button>
          </div>
          <button className="password-close-button" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
