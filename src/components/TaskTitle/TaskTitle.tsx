import React from "react";
import "./TaskTitle.css";
import iconPlus from "../../images/icons/icon_plus.svg";

type TaskTitleProps = {
  type: "backlog" | "inProgress" | "review" | "done";
  onAddTask: (status: string) => void;
};

const TaskTitle: React.FC<TaskTitleProps> = ({ type, onAddTask }) => {
  const titleMap = {
    backlog: { label: "Бэклог", colorClass: "backlog" },
    inProgress: { label: "В процессе", colorClass: "in-progress" },
    review: { label: "Проверка", colorClass: "review" },
    done: { label: "Выполнено", colorClass: "done" },
  };

  const { label, colorClass } = titleMap[type];

  return (
    <div className="task-title">
      <div className={`task-background ${colorClass}`}></div>
      <div className="task-text">{label}</div>
      <img src={iconPlus} alt="Add task" className="task-icon" onClick={() => onAddTask(type)} />
    </div>
  );
};

export default TaskTitle;
