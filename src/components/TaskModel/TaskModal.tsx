import React from 'react';
import './TaskModal.css';
import deleteIcon from "../../images/icons/icon_delete.svg";
import checkIcon from "../../images/icons/icon_check.svg"

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
  return (
    <div className={`tsk-modal-overlay ${isOpen ? 'tsk-modal-open' : ''}`} onClick={onClose}>
      <div className="tsk-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{description}</p>
        <label>
          <span>Ответственный:</span>
          <input type="text" defaultValue={user} />
        </label>
        <label>
          <span>Проект:</span>
          <input type="text" value={project} readOnly />
        </label>
        <label>
          <span>Статус:</span>
          <input type="text" value={status} readOnly />
        </label>
        <label className='tsk-comlabel'>
          <a className='tsk-commentary'>Комментарий:</a>
          <textarea placeholder="Введите комментарий"></textarea>
        </label>
        <div className='tsk-buttons'>
        <button className="tsk-del_btn" /*onClick={onClose}*/>
          <img src={deleteIcon} alt="Delete task" className='tsk-del_btn_img'/>
          Удалить
        </button>
        <button className='tsk-edit_btn' /*onClick={}*/>
          <img src={checkIcon} alt="Save task" className='tsk-del_btn_img'/>
          Сохранить
        </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
