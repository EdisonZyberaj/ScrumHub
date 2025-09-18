import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Flag, Target, CheckCircle2, AlertTriangle } from 'lucide-react';

const WorkloadCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchTasks();
  }, [currentDate]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http:
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const getTasksInDateRange = (startDate, endDate) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= startDate && taskDate <= endDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      days.push({ date: currentDay, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE': return 'bg-green-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'TO_DO': return 'bg-gray-400';
      case 'READY_FOR_TESTING': return 'bg-yellow-500';
      case 'BUG_FOUND': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'border-red-500';
      case 'HIGH': return 'border-orange-500';
      case 'MEDIUM': return 'border-yellow-500';
      case 'LOW': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Workload Calendar</h1>
          <p className="text-gray-600">Track your tasks and deadlines</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Workload Calendar</h1>
        <p className="text-gray-600">Track your tasks and deadlines</p>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Testing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Done</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week header */}
          {daysOfWeek.map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-500 border-b">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((dayInfo, index) => {
            const dayTasks = getTasksForDate(dayInfo.date);
            const isCurrentMonth = dayInfo.isCurrentMonth;
            const isTodayDate = isToday(dayInfo.date);

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                } ${isTodayDate ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => setSelectedDate(selectedDate?.getTime() === dayInfo.date.getTime() ? null : dayInfo.date)}
              >
                <div className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : ''}`}>
                  {dayInfo.date.getDate()}
                </div>

                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded border-l-2 ${getPriorityColor(task.priority)} bg-gray-50`}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`}></div>
                        <span className="truncate" title={task.title}>
                          {task.title.length > 15 ? `${task.title.substring(0, 15)}...` : task.title}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Tasks for {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </h3>

          <div className="space-y-3">
            {getTasksForDate(selectedDate).length > 0 ? (
              getTasksForDate(selectedDate).map(task => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{task.projectName}</span>
                        </span>
                        {task.estimatedHours && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedHours}h</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Flag className="w-3 h-3" />
                          <span>{task.priority}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'READY_FOR_TESTING' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'BUG_FOUND' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No tasks scheduled for this date</p>
            )}
          </div>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">This Week's Workload</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(() => {
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            const weekTasks = getTasksInDateRange(weekStart, weekEnd);
            const overdueTasks = tasks.filter(task => {
              if (!task.dueDate || task.status === 'DONE') return false;
              const taskDate = new Date(task.dueDate);
              return taskDate < today;
            });

            return (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{weekTasks.length}</div>
                  <div className="text-sm text-gray-600">Tasks This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {weekTasks.filter(t => t.status === 'DONE').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default WorkloadCalendar;