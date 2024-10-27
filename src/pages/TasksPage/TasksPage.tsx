import React, {useEffect, useState} from 'react';
import { useLocation } from "react-router-dom";
import TaskTitle from '../../components/TaskTitle/TaskTitle';
import '../TasksPage/TasksPage.css';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { exportTasks } from '../../api/tasks/TaskApi';

import export_button from "../../images/icons/icon_export_tasks.svg"
import filter_button from "../../images/icons/icon_filter_task.svg"

interface Project {
  title: string;
}

interface Task {
  id: string;
  title: string;
  user: string;
  // project: {
  //   title: string;
  // }; 
  project: string;
  project_id: string;
  status: string;
  description: string;
}
const TaskPage: React.FC = () => {
  const location = useLocation();
  const { tasks, projectId } = location.state || { tasks: [], projectId: null };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<string>('NOTSTARTED'); // Статус новой задачи

  const transformedTasks: Task[] = tasks.map((task: Task) => ({
    // ...task,
    // project: { title: task.project },
    //project: typeof task.project === 'string' ? task.project : (task.project?.title || ''),
    //project,
    //project: typeof task.project === 'string' 
    // title: task.title,
    // user: task.user,
    // project: { title: task.project }, // Преобразование в объект
    // status: task.status,
  }));   
  useEffect(() => {

  


    //console.log(projectId);
  }, [tasks, projectId]);

  const handleAddTask = (status: string) => {
    console.log(status)
    setNewTaskStatus(status);
    setIsModalOpen(true);
  };

  const handleExportClick = async () => {
    if (projectId) {
      try {
        const response = await exportTasks(projectId);
        if (response.downloadUrl) {
          window.location.href = response.downloadUrl;
        }
      } catch (error) {
        console.error("Ошибка при экспорте задач:", error);
      }
    }
  };

  const breadcrumbs = [
    { name: "Проекты", path: "/projects" },
    { name: "Проект_1", path: "/" }, // заглушка
    { name: "Задачи", path: "/tasks" },
  ]; // в целом всё заглушка

  return (
    <div className="task-page">
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div className="control-panel">
        <p className="control-panel_title">
          Задачи
        </p>
        <img
          src={export_button}
          alt="Экспорт"
          className="export-icon"
          onClick={handleExportClick}
          style={{ cursor: "pointer" }}
        />      
        <img
          src={filter_button}
          alt="Фильтр"
          className="filter-icon"
          // onClick={handleExportClick}
          style={{ cursor: "pointer" }}
        />  
      </div>
      <div className="task-titles">
        <TaskTitle type="backlog" onAddTask={handleAddTask} />
        <TaskTitle type="inProgress" onAddTask={handleAddTask} />
        <TaskTitle type="review" onAddTask={handleAddTask} />
        <TaskTitle type="done" onAddTask={handleAddTask} />
      </div>
      <KanbanBoard tasks={tasks} />
      </div>
  );
};

export default TaskPage;
