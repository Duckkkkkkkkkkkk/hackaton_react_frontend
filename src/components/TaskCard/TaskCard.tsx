import React from 'react';
import './TaskCard.css';
import deleteIcon from "../../images/icons/icon_delete.svg";

type TaskCardProps = {
  title: string;
  user: string;
  project: string;
  status: string;
  onDragStart: (e: React.DragEvent, title: string) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ title, user, project, status, onDragStart }) => {
  return (
    <div 
      className={`task-card ${status}`} 
      draggable 
      onDragStart={(e) => onDragStart(e, title)}
    >
      <div className="task-card-content">
        <div className="task-card-header">
          <h3 className="task-card-title">{title}</h3>
          <p className="task-card-user">{user}</p>
          <p className="task-card-project">Сервис «{project}»</p>
        </div>
        <img src={deleteIcon} alt="Delete task" className="task-card-delete-icon" />
      </div>
    </div>
  );
};

export default TaskCard;
