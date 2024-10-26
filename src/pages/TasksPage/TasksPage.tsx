import React from 'react';
import TaskTitle from '../../components/TaskTitle/TaskTitle';
import '../TasksPage/TasksPage.css';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';

const TaskPage: React.FC = () => {

  const breadcrumbs = [
    { name: "Проекты", path: "/projects" },
    { name: "Проект_1", path: "/" }, // заглушка
    { name: "Задачи", path: "/tasks" },
  ]; // в целом всё заглушка

  return (
    <div className="task-page">
      <BreadCrumbs breadcrumbs={breadcrumbs} />
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
