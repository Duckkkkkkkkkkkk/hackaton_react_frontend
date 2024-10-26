import React from 'react';
import './TaskModal.css';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  user: string;
  project: string;
  status: string;
  description: string;
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, title, user, project, status, description }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <label>
          Ответственный:
          <input type="text" defaultValue={user} />
        </label>
        <label>
          Проект:
          <input type="text" value={project} readOnly />
        </label>
        <label>
          Статус:
          <input type="text" value={status} readOnly />
        </label>
        <label>
          Комментарий:
          <textarea placeholder="Введите комментарий"></textarea>
        </label>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default TaskModal;
