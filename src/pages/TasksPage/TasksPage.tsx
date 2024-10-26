import React from 'react';
import TaskTitle from '../../components/TaskTitle/TaskTitle';
import '../TasksPage/TasksPage.css';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';

const TaskPage: React.FC = () => {
  return (
    <div className="task-page">
      <div className="title">Задачи</div>
      <div className="task-titles">
        <TaskTitle type="backlog"/>
        <TaskTitle type="inProgress" />
        <TaskTitle type="review" />
        <TaskTitle type="done" />
      </div>
      <KanbanBoard />
    </div>
  );
};

export default TaskPage;
