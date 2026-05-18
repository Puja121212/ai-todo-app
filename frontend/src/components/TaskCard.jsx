import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus, onGenerateSubtasks, onToggleSubtask }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const { showToast } = useToast();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? (
      <CheckCircleIcon className="h-5 w-5 text-green-600" />
    ) : (
      <ClockIcon className="h-5 w-5 text-gray-400" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const isOverdue = (deadline) => {
    if (!deadline || task.status === 'completed') return false;
    return new Date(deadline) < new Date();
  };

  const completedSubtasksCount = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasksCount = task.subtasks?.length || 0;

  const handleToggleSubtask = (subtaskIndex) => {
    onToggleSubtask(task, subtaskIndex);
  };

  return (
    <div className={`card ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleStatus(task)}
            className="mt-1 flex-shrink-0"
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {getStatusIcon(task.status)}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`text-lg font-medium text-gray-900 dark:text-white ${
                task.status === 'completed' ? 'line-through' : ''
              }`}>
                {task.title}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            {task.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              {task.deadline && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue(task.deadline) ? 'text-red-600 dark:text-red-400' : ''
                }`}>
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(task.deadline)}</span>
                  {isOverdue(task.deadline) && <span className="text-xs">(Overdue)</span>}
                </div>
              )}
              
              {totalSubtasksCount > 0 && (
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>{completedSubtasksCount}/{totalSubtasksCount} completed</span>
                </div>
              )}
            </div>
            
            {/* Subtasks */}
            {totalSubtasksCount > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {showSubtasks ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                  <span>Subtasks</span>
                </button>
                
                {showSubtasks && (
                  <div className="mt-2 space-y-2">
                    {task.subtasks.map((subtask, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleToggleSubtask(index)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <span className={`text-sm ${
                          subtask.completed 
                            ? 'text-gray-500 line-through dark:text-gray-400' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onGenerateSubtasks(task)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Generate AI subtasks"
          >
            <SparklesIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Edit task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            title="Delete task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
