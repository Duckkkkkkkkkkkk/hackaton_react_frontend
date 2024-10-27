import React, { useState, useEffect } from 'react';
import './KanbanBoard.css';
import TaskCard from '../TaskCard/TaskCard';
import TaskModal from '../TaskModel/TaskModal';


interface Task {
  id: number;
  title: string;
  user: string;
   project: {
     title: string;
   }; 
   
  //project: string;
  status: string;
  description: string;
  executor: {
    id:number;
    firstName: string;
    lastName: string;
   };
   project_id: number;

}

type KanbanBoardProps = {
  tasks: Task[];
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const [columns, setColumns] = useState<{ [key: string]: Task[] }>({
    backlog: tasks.filter(task => task.status === 'NOTSTARTED'),
    inProgress: tasks.filter(task => task.status === 'INPROGRESS'),
    review: tasks.filter(task => task.status === 'VERIFICATION'),
    done: tasks.filter(task => task.status === 'COMPLETED'),
  });

  useEffect(() => {
    const organizedTasks = {
      backlog: tasks.filter((task) => task.status === 'NOTSTARTED'),
      inProgress: tasks.filter((task) => task.status === 'INPROGRESS'),
      review: tasks.filter((task) => task.status === 'VERIFICATION'),
      done: tasks.filter((task) => task.status === 'COMPLETED'),
    };
    setColumns(organizedTasks);
  }, [tasks]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleOnDragStart = (e: React.DragEvent, task: Task, from: string) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
    e.dataTransfer.setData('from', from);
  };

  const handleOnDrop = (e: React.DragEvent, to: string) => {
    const taskData = e.dataTransfer.getData('task');
    const from = e.dataTransfer.getData('from');
    const task = JSON.parse(taskData);

    setColumns((prev) => {
      const fromTasks = prev[from].filter((t) => t.title !== task.title);
      const toTasks = [...prev[to], task];

      return {
        ...prev,
        [from]: fromTasks,
        [to]: toTasks,
      };
    });
  };

  // {tasks.map((task) => {
  //   // Логируем каждую задачу
  //   console.log("myTask:", task.project); // Логирование задачи
  // })}
  return (
    <div className="kanban-board">
      {Object.entries(columns).map(([column, tasks]) => (
        <div className="kanban-column" key={column} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleOnDrop(e, column)}>
          <div className="task-list">
            {tasks.map((task) => (
              
              <div key={task.title} draggable onDrag={(e) => handleOnDragStart(e, task, column)}>
                <TaskCard
                  id={task.id}
                  title={task.title}
                  project={task.project.title}
                  status={task.status}
                  executor={task.executor}
                  onDragStart={(e) => handleOnDragStart(e, task, 'backlog')}
                  onClick={() => handleTaskClick(task)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      {selectedTask && (
        <TaskModal
        id={selectedTask.id}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={selectedTask.title}
          executor={selectedTask.executor}
          project={selectedTask.project.title}
          status={selectedTask.status}
          description={selectedTask.description}
          project_id={selectedTask.project_id}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
