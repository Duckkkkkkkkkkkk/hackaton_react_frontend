import React from 'react';
import TaskTitle from '../../components/TaskTitle/TaskTitle';
import '../TasksPage/TasksPage.css';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';

const TaskPage: React.FC = () => {

  
  return (
    <div className="task-page">
      {/* <BreadCrumbs breadcrumbs={breadcrumbs} /> */}
      <div className="title">Задачи</div>

      <div className="task-titles">
        <TaskTitle type="backlog" />
        <TaskTitle type="inProgress" />
        <TaskTitle type="review" />
        <TaskTitle type="done" />        
      </div>
    </div>
  );
};

export default TaskPage;