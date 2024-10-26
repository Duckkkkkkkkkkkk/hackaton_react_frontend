import React, { useState } from 'react';
import './KanbanBoard.css';
import TaskCard from '../TaskCard/TaskCard';

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<{
    [key: string]: { title: string; user: string; project: string }[];
  }>({
    backlog: [
      { title: 'Задача 1', user: 'Пользователь 1', project: 'Проект A' },
      { title: 'Задача 2', user: 'Пользователь 2', project: 'Проект B' },
    ],
    inProgress: [
      { title: 'Задача 3', user: 'Пользователь 3', project: 'Проект C' },
    ],
    review: [
      { title: 'Задача 4', user: 'Пользователь 4', project: 'Проект D' },
    ],
    done: [
      { title: 'Задача 5', user: 'Пользователь 4', project: 'Проект D' },
    ],
  });

  const handleOnDragStart = (
    e: React.DragEvent,
    task: { title: string; user: string; project: string },
    from: string
  ) => {
    e.dataTransfer.setData('task', JSON.stringify(task));
    e.dataTransfer.setData('from', from);
  };

  const handleOnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOnDrop = (e: React.DragEvent, to: string) => {
    const taskData = e.dataTransfer.getData('task');
    const from = e.dataTransfer.getData('from');
    const task = JSON.parse(taskData);

    setTasks((prev) => {
      const fromTasks = prev[from].filter((t) => t.title !== task.title);
      const toTasks = [...prev[to], task];

      return {
        ...prev,
        [from]: fromTasks,
        [to]: toTasks,
      };
    });
  };

  return (
    <div className="kanban-board">
      <div className="kanban-column" onDragOver={handleOnDragOver} onDrop={(e) => handleOnDrop(e, 'backlog')}>
        <div className="task-list">
          {tasks.backlog.map((task) => (
            <div key={task.title} draggable onDrag={(e) => handleOnDragStart(e, task, 'backlog')}>
              <TaskCard
                title={task.title}
                user={task.user}
                project={task.project}
                status="backlog"
                onDragStart={(e) => handleOnDragStart(e, task, 'backlog')}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="kanban-column" onDragOver={handleOnDragOver} onDrop={(e) => handleOnDrop(e, 'inProgress')}>
        <div className="task-list">
          {tasks.inProgress.map((task) => (
            <div key={task.title} draggable onDrag={(e) => handleOnDragStart(e, task, 'inProgress')}>
              <TaskCard
                title={task.title}
                user={task.user}
                project={task.project}
                status="inProgress"
                onDragStart={(e) => handleOnDragStart(e, task, 'inProgress')}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="kanban-column" onDragOver={handleOnDragOver} onDrop={(e) => handleOnDrop(e, 'review')}>
        <div className="task-list">
          {tasks.review.map((task) => (
            <div key={task.title} draggable onDrag={(e) => handleOnDragStart(e, task, 'review')}>
              <TaskCard
                title={task.title}
                user={task.user}
                project={task.project}
                status="review"
                onDragStart={(e) => handleOnDragStart(e, task, 'review')}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="kanban-column" onDragOver={handleOnDragOver} onDrop={(e) => handleOnDrop(e, 'done')}>
        <div className="task-list">
          {tasks.done.map((task) => (
            <div key={task.title} draggable onDrag={(e) => handleOnDragStart(e, task, 'done')}>
              <TaskCard
                title={task.title}
                user={task.user}
                project={task.project}
                status="done"
                onDragStart={(e) => handleOnDragStart(e, task, 'done')}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
