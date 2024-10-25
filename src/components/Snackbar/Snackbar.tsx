import React, { useEffect } from 'react';
import './Snackbar.css';

import successIcon from '../../images/icons/icon_success.svg';
import failureIcon from '../../images/icons/icon_failure.svg';
import closeIcon from '../../images/icons/icon_close_modal.svg';

export type SnackbarType = 'successAdd' | 
                    'failureLogin' | 
                    'failurePassword' | 
                    'differentPassword' | 
                    'successChangePassword' | 
                    'successChange' | 
                    'errorSendingData';

interface SnackbarProps {
  type: SnackbarType;
  duration?: number;
  onClose?: () => void;
}

const snackbarContent: Record<SnackbarType, { icon: string; message: string }> = {
    successAdd: {
    icon: successIcon,
    message: 'Успешное добавление!',
  },
  failureLogin: {
    icon: failureIcon,
    message: 'Неверный логин/пароль',
  },
  failurePassword: {
    icon: failureIcon,
    message: 'Неверный пароль',
  },
  differentPassword: {
    icon: failureIcon,
    message: 'Пароли не совпадают',
  },
  successChangePassword: {
    icon: successIcon,
    message: 'Пароль успешно изменен!',
  },
  successChange: {
    icon: successIcon,
    message: 'Данные успешно сохранены!',
  },
  errorSendingData: {
    icon: failureIcon,
    message: 'Ошибка отправки данных',
  },

};

const Snackbar: React.FC<SnackbarProps> = ({ type, duration = 3000, onClose }) => {
  const content = snackbarContent[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  if (!content) return null;

  return (
    <div className="snackbar">
        <div className="snackbar_container">
            <img src={content.icon} alt="icon" className="snackbar-icon" />
            <div className="snackbar-text">{content.message}</div>
            <button className="snackbar-close" onClick={onClose}>
                <img src={closeIcon} alt="close" />
            </button>
        </div>
    </div>
  );
};

export default Snackbar;
