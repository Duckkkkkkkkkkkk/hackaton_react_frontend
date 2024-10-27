import React, { useState } from 'react';
//import React from 'react';
import './TaskModal.css';
import deleteIcon from "../../images/icons/icon_delete.svg";
import checkIcon from "../../images/icons/icon_check.svg"
import { updateTask, deleteTask } from '../../api/tasks/TaskApi';

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  executor: {
    id:number;
    firstName: string;
    lastName: string;
   };
    project: string;
  status: string;
  description: string;
  project_id: number;
  id: number;
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, title, executor, project, status, description, project_id, id}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [comment, setComment] = useState(description);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(event.target.value as 'NOTSTARTED' | 'INPROGRESS' | 'COMPLETED' | 'VERIFICATION');
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        status: currentStatus,
        comment,
        project_id, // Используйте project_id, если необходимо
        title, // Если вам нужно обновить заголовок
        // другие поля, которые могут быть необходимы
      };

      // Вызовите функцию updateTask с ID задачи и ID исполнителя
      await updateTask(id, executor.id, updateData);

      console.log('Задача обновлена');
      onClose(); // Закрываем модал после сохранения
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // Вызовите функцию deleteTask с ID задачи
      await deleteTask(id);
      console.log('Задача удалена');
      onClose(); // Закрываем модал после удаления
      window.location.reload(); // Перезагружаем страницу
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  return (
    <div className={`tsk-modal-overlay ${isOpen ? 'tsk-modal-open' : ''}`} onClick={onClose}>
      <div className="tsk-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <label>
          <span>Ответственный:</span>
          <input type="text" defaultValue={`${executor.firstName} ${executor.lastName}`} readOnly />
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
        <label className='tsk-comlabel'>
          <span>Комментарий:</span>
          <textarea value={comment} onChange={handleCommentChange} placeholder="Введите комментарий"></textarea>
        </label>
        <div className='tsk-buttons'>
          <button className="tsk-del_btn" onClick={handleDelete}>
            <img src={deleteIcon} alt="Delete task" className='tsk-del_btn_img' />
            Удалить
          </button>
          <button className='tsk-edit_btn' onClick={handleSave}>
            <img src={checkIcon} alt="Save task" className='tsk-del_btn_img' />
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;