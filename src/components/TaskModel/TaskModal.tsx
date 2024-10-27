import React, { useState } from 'react';
import './TaskModal.css';
import deleteIcon from "../../images/icons/icon_delete.svg";
import checkIcon from "../../images/icons/icon_check.svg";
import { updateTask, deleteTask } from '../../api/tasks/TaskApi';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  start_date: string | Date;
  executor: {
    id: number;
    firstName: string;
    lastName: string;
  };
  project: string;
  status: string;
  description: string;
  project_id: number;
  id: number;
  comment: string;
};

const formatDate = (date: any): string => {
  const parsedDate = date instanceof Date ? date : new Date(date);
  return !isNaN(parsedDate.getTime()) ? parsedDate.toISOString().split('T')[0] : '';
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, title, start_date, executor, project, status, description, project_id, id, comment }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentComment, setCurrentComment] = useState(comment || '');
  const [currentDescription, setCurrentDescription] = useState(description);
  const [currentStartDate, setCurrentStartDate] = useState(formatDate(start_date));

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(event.target.value as 'NOTSTARTED' | 'INPROGRESS' | 'COMPLETED' | 'VERIFICATION');
  };

  const handleSave = async () => {
    try {
      const updateData = {
        title,
        project_id,
        status: currentStatus,
        description: currentDescription,
        start_date: new Date(currentStartDate).toISOString(),
        comment: currentComment,
      };

      await updateTask(id, executor.id, updateData);
      console.log('Задача обновлена');
      onClose();
      // window.location.reload();
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(id);
      console.log("Задача удалена");
      onClose();
      // window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
    }
  };  

  return (
    <div className={`tsk-modal-overlay ${isOpen ? 'tsk-modal-open' : ''}`} onClick={onClose}>
      <div className="tsk-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <label>
          <textarea value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} placeholder="Описание" />
        </label>
        <label>
          <span>Ответственный:</span>
          <input type="text" defaultValue={`${executor.firstName} ${executor.lastName}`} readOnly />
        </label>
        <label>
          <span>Дата создания:</span>
          <input type="date" value={currentStartDate} onChange={(e) => setCurrentStartDate(e.target.value)} />
        </label>
        <label>
          <span>Проект:</span>
          <input type="text" value={project} readOnly />
        </label>
        <label>
          <span>Статус:</span>
          <select value={currentStatus} onChange={handleStatusChange}>
            <option value="NOTSTARTED">Беклог</option>
            <option value="INPROGRESS">В процессе</option>
            <option value="COMPLETED">Выполнено</option>
            <option value="VERIFICATION">Проверка</option>
          </select>
        </label>
        <label className="tsk-comlabel">
          <span>Комментарий:</span>
          <textarea value={currentComment} onChange={(e) => setCurrentComment(e.target.value)} placeholder="Введите комментарий" />
        </label>
        <div className="tsk-buttons">
          <button className="tsk-del_btn" onClick={handleDelete}>
            <img src={deleteIcon} alt="Delete task" className="tsk-del_btn_img" />
            Удалить
          </button>
          <button className="tsk-edit_btn" onClick={handleSave}>
            <img src={checkIcon} alt="Save task" className="tsk-del_btn_img" />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
