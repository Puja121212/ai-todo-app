import React, { useState, useEffect } from 'react';
import { taskAPI, aiAPI } from '../utils/api';
import { useToast } from '../hooks/useToast';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SparklesIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.tasks); // 🔥 FIX (no .data)
    } catch (error) {
      showToast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await taskAPI.updateTask(editingTask._id, taskData);
        setTasks(tasks.map(task => 
          task._id === editingTask._id ? response.task : task // 🔥 FIX (no .data)
        ));
        showToast.success('Task updated successfully');
      } else {
        // Create new task
        const response = await taskAPI.createTask(taskData);
        setTasks([response.task, ...tasks]); // 🔥 FIX (no .data)
        showToast.success('Task created successfully');
      }
      setModalOpen(false);
    } catch (error) {
      showToast.error(error.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
        showToast.success('Task deleted successfully');
      } catch (error) {
        showToast.error('Failed to delete task');
      }
    }
  };

  // Toggle subtask completion
  const handleToggleSubtask = async (task, subtaskIndex) => {
    try {
      const updatedSubtasks = [...task.subtasks];
      updatedSubtasks[subtaskIndex].completed = !updatedSubtasks[subtaskIndex].completed;
      const allCompleted = updatedSubtasks.every(st => st.completed);
      const response = await taskAPI.updateTask(task._id, { ...task, subtasks: updatedSubtasks, status: allCompleted ? 'completed' : task.status });
      setTasks(tasks.map(t => t._id === task._id ? response.task : t));
      showToast.success('Subtask updated');
    } catch (error) {
      showToast.error('Failed to update subtask');
    }
  };

  const handleToggleTaskStatus = async (task) => {
    try {
        const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
        const response = await taskAPI.updateTask(task._id, { ...task, status: updatedStatus });
        // Use the updated task from the API response
        setTasks(tasks.map(t => t._id === task._id ? response.task : t));
      showToast.success(`Task marked as ${updatedStatus}`);
    } catch (error) {
      showToast.error('Failed to update task status');
    }
  };

  const handleGenerateSubtasks = async (task) => {
    try {
      showToast.loading('Generating subtasks...');
      const response = await aiAPI.generateSubtasks({
        taskTitle: task.title,
        taskDescription: task.description || ''
      });
      
      const subtasks = response.subtasks.map(subtask => ({ // 🔥 FIX (no .data)
        title: subtask,
        completed: false
      }));
      
      const updatedTask = await taskAPI.updateTask(task._id, { ...task, subtasks });
      setTasks(tasks.map(t => t._id === task._id ? updatedTask.task : t)); // 🔥 FIX (no .data)
      showToast.success('Subtasks generated successfully');
    } catch (error) {
      showToast.error('Failed to generate subtasks');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
  };

  const activeFiltersCount = [
    searchTerm,
    filterStatus !== 'all' ? filterStatus : null,
    filterPriority !== 'all' ? filterPriority : null
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 skeleton h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Organize and track your tasks with AI-powered assistance
          </p>
        </div>
        <button
          onClick={handleCreateTask}
          className="btn btn-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Task
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn btn-secondary flex items-center relative ${showFilters ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : ''}`}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-6 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter Tasks
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="btn btn-ghost"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="input-field"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn btn-secondary w-full"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {tasks.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-danger-100 dark:bg-danger-900 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-6">
        {filteredTasks.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {tasks.length === 0 
                ? 'Create your first task to start organizing your productivity journey with AI-powered assistance.'
                : 'Try adjusting your filters or search terms to find the tasks you\'re looking for.'
              }
            </p>
            {tasks.length === 0 && (
              <button
                onClick={handleCreateTask}
                className="btn btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-medium text-gray-900 dark:text-white">{filteredTasks.length}</span> of{' '}
                <span className="font-medium text-gray-900 dark:text-white">{tasks.length}</span> tasks
              </p>
              <div className="flex items-center space-x-2">
                <button className="btn btn-ghost">
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  Generate AI Tasks
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleTaskStatus}
                  onGenerateSubtasks={handleGenerateSubtasks}
                  onToggleSubtask={handleToggleSubtask}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Task Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleTaskSubmit}
        />
      )}
    </div>
  );
};

export default Tasks;
