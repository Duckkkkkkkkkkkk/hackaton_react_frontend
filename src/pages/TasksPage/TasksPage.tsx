import React, {useEffect} from 'react';
import { useLocation } from "react-router-dom";
import TaskTitle from '../../components/TaskTitle/TaskTitle';
import '../TasksPage/TasksPage.css';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { fetchTasksByProjectId } from '../../api/tasks/TaskApi';

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
      <KanbanBoard tasks={tasks} />
      </div>
  );
};

export default TaskPage;
