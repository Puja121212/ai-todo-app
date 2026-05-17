import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../utils/api';
import { useTheme } from '../context/ThemeContext.jsx';

import {
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowTrendingUpIcon, // ✅ FIXED
  FireIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, tasksData] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getTasks({ limit: 5 }),
      ]);

      setStats(statsData.stats); 
      setRecentTasks(tasksData.tasks || []); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const completionRate =
    stats && stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const pieData = stats
    ? [
        { name: 'Completed', value: stats.completed, color: '#22c55e' },
        { name: 'Pending', value: stats.pending, color: '#f59e0b' },
        { name: 'Overdue', value: stats.overdue, color: '#ef4444' },
      ]
    : [];

  const lineData =
    stats?.weeklyActivity?.map((item, i) => ({
      name: `Day ${i + 1}`,
      tasks: item,
    })) || [];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!stats) {
    return <div className="p-6">Error loading data</div>;
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/tasks" className="btn btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Task
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <div>
              <p>Total</p>
              <h2 className="text-xl font-bold">{stats.total}</h2>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-6 h-6 text-yellow-500" />
            <div>
              <p>Pending</p>
              <h2 className="text-xl font-bold">{stats.pending}</h2>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            <div>
              <p>Overdue</p>
              <h2 className="text-xl font-bold">{stats.overdue}</h2>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <ArrowTrendingUpIcon className="w-6 h-6 text-blue-500" />
            <div>
              <p>Completion</p>
              <h2 className="text-xl font-bold">{completionRate}%</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Pie Chart */}
        <div className="card p-4">
          <h2 className="mb-4 font-semibold">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="card p-4">
          <h2 className="mb-4 font-semibold">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tasks" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card p-4">
        <h2 className="mb-4 font-semibold">Recent Tasks</h2>

        {recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <div
              key={task._id}
              className="flex justify-between border-b py-2"
            >
              <span>{task.title}</span>
              <span>{task.status}</span>
            </div>
          ))
        ) : (
          <p>No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;