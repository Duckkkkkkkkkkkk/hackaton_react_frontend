import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import TaskTitle from '../../components/TaskTitle/TaskTitle';
import '../TasksPage/TasksPage.css';
import BreadCrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { exportTasks } from '../../api/tasks/TaskApi';
import export_button from "../../images/icons/icon_export_tasks.svg";
import filter_button from "../../images/icons/icon_filter_task.svg";
import TaskFieldSelector from '../../components/TaskFieldSelector/TaskFiledSelector';

const TaskPage: React.FC = () => {
  const location = useLocation();
  const { tasks, projectId } = location.state || { tasks: [], projectId: null };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Состояние для открытия TaskFieldSelector
  const [newTaskStatus, setNewTaskStatus] = useState<string>('NOTSTARTED'); 

  const handleFilterClick = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleAddTask = (status: string) => {
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
  ];

  return (
    <div className="task-page">
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div className="control-panel">
        <p className="control-panel_title">Задачи</p>
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
          onClick={handleFilterClick} // Добавляем обработчик клика
          style={{ cursor: "pointer" }}
        />
      </div>
      {isFilterOpen && (
        <TaskFieldSelector
          isOpen={isFilterOpen} // Добавляем проп isOpen
          onClose={() => setIsFilterOpen(false)} // Добавляем обработчик закрытия
          fields={[
            { name: "dateRange", label: "Промежуток дат" },
            { name: "specificDate", label: "Конкретная дата" },
            { name: "executor", label: "Ответственный" },
          ]}
          visibleFields={[]} // Задать видимые поля
          onToggleField={(fieldName: string) => {
            console.log("Поле переключено:", fieldName);
          }}
          onDateChange={(dateRange) => {
            console.log("Изменён диапазон дат:", dateRange);
          }}
          onExecutorChange={(executor) => {
            console.log("Изменён ответственный:", executor);
          }}
        />
      )}
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
