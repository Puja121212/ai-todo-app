import React, { useState, useEffect } from 'react';
import { taskAPI } from '../utils/api';
import { useToast } from '../hooks/useToast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchStatisticsData();
  }, [timeRange]);

  const fetchStatisticsData = async () => {
    try {
      setLoading(true);
      const [statsResponse, tasksResponse] = await Promise.all([
        taskAPI.getStats(),
        taskAPI.getTasks()
      ]);
      
      setStats(statsResponse.stats); // 🔥 FIX (no .data)
      setTasks(tasksResponse.tasks); // 🔥 FIX (no .data)
    } catch (error) {
      showToast.error('Failed to fetch statistics data');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTasks = () => {
    if (!tasks.length) return [];
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (timeRange) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return tasks;
    }
    
    return tasks.filter(task => new Date(task.createdAt) >= filterDate);
  };

  const getCompletionRate = () => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  const getPriorityData = () => {
    if (!stats) return [];
    return [
      { name: 'High', value: stats.highPriority, color: '#ef4444' },
      { name: 'Medium', value: stats.mediumPriority, color: '#f59e0b' },
      { name: 'Low', value: stats.lowPriority, color: '#10b981' },
    ];
  };

  const getStatusData = () => {
    if (!stats) return [];
    return [
      { name: 'Completed', value: stats.completed, color: '#10b981' },
      { name: 'Pending', value: stats.pending, color: '#6b7280' },
    ];
  };

  const getWeeklyData = () => {
    const filteredTasks = getFilteredTasks();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date().getDay();
    const weekData = [];

    for (let i = 0; i < 7; i++) {
      const dayIndex = (today - i + 7) % 7;
      const dayName = days[dayIndex];
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() - i);
      dayDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(dayDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayTasks = filteredTasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= dayDate && taskDate < nextDay;
      });

      const completedDayTasks = dayTasks.filter(task => task.status === 'completed');

      weekData.unshift({
        day: dayName,
        created: dayTasks.length,
        completed: completedDayTasks.length,
      });
    }

    return weekData;
  };

  const getTaskCompletionTrend = () => {
    const filteredTasks = getFilteredTasks();
    const completionData = [];
    
    // Group tasks by completion date
    const groupedByDate = {};
    
    filteredTasks.forEach(task => {
      if (task.status === 'completed') {
        const date = new Date(task.updatedAt).toLocaleDateString();
        if (!groupedByDate[date]) {
          groupedByDate[date] = 0;
        }
        groupedByDate[date]++;
      }
    });

    // Convert to array and sort by date
    Object.entries(groupedByDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .forEach(([date, count]) => {
        completionData.push({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          completed: count,
        });
      });

    return completionData;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Statistics
          </h1>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Range:
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-field text-sm py-1"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total Tasks
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.total || 0}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Completed
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats?.completed || 0}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats?.pending || 0}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {getCompletionRate()}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Task Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getStatusData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getStatusData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPriorityData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="card mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Weekly Activity
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getWeeklyData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="created" fill="#3b82f6" name="Tasks Created" />
            <Bar dataKey="completed" fill="#10b981" name="Tasks Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Completion Trend */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Task Completion Trend
        </h3>
        {getTaskCompletionTrend().length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getTaskCompletionTrend()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="completed" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No completed tasks in the selected time period
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
