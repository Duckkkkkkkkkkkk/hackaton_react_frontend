import React from 'react';
import './TaskCard.css';
import deleteIcon from "../../images/icons/icon_delete.svg";
import internal from 'stream';

type TaskCardProps = {
  id: number;
  title: string;
  project: string;
  status: string;
  executor: {
    id: number;
    firstName: string;
    lastName: string;
   };
  onDragStart: (e: React.DragEvent, title: string) => void;
  onClick: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ title, project, status, executor, onDragStart, onClick }) => {
  
  return (
    <div 
      className={`task-card ${status}`} 
      draggable 
      onDragStart={(e) => onDragStart(e, title)}
      onClick={onClick}
    >
      <div className="task-card-content">
        <div className="task-card-header">
          <h3 className="task-card-title">{title}</h3>
          <p className="task-card-user">{executor.lastName} {executor.firstName}</p>
          <p className="task-card-project">Сервис «{project}»</p>
        </div>
        <img src={deleteIcon} alt="Delete task" className="task-card-delete-icon" />
      </div>
    </div>
  );
};

export default TaskCard;
