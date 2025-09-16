import React, { useState } from 'react';
import { Plus, Search, Filter, Bug, CheckCircle2, Clock, AlertTriangle, Eye, User, Calendar } from 'lucide-react';

const BugReports = () => {
  const [bugReports, setBugReports] = useState([
    {
      id: 1,
      title: 'Login form validation not working',
      description: 'Error messages are not displayed when invalid credentials are entered',
      severity: 'HIGH',
      status: 'OPEN',
      taskId: 15,
      taskTitle: 'Implement user authentication',
      reportedBy: 'John Tester',
      assignedTo: 'Jane Developer',
      reportedDate: '2024-01-15T10:30:00Z',
      lastUpdated: '2024-01-15T14:20:00Z',
      stepsToReproduce: [
        'Navigate to login page',
        'Enter invalid username',
        'Enter invalid password',
        'Click login button',
        'No error message is shown'
      ],
      expectedBehavior: 'Should display "Invalid credentials" error message',
      actualBehavior: 'No error message appears, form just resets silently',
      environment: 'Chrome 120, Windows 11'
    },
    {
      id: 2,
      title: 'Dashboard charts not loading on Firefox',
      description: 'Charts component fails to render on Firefox browser',
      severity: 'MEDIUM',
      status: 'IN_PROGRESS',
      taskId: 23,
      taskTitle: 'Add analytics dashboard',
      reportedBy: 'John Tester',
      assignedTo: 'Mike Developer',
      reportedDate: '2024-01-14T09:15:00Z',
      lastUpdated: '2024-01-16T11:30:00Z',
      stepsToReproduce: [
        'Open Firefox browser',
        'Navigate to dashboard page',
        'Observe charts section',
        'Charts fail to load'
      ],
      expectedBehavior: 'Charts should load and display data correctly',
      actualBehavior: 'Charts section shows loading spinner indefinitely',
      environment: 'Firefox 121, macOS Sonoma'
    },
    {
      id: 3,
      title: 'Mobile menu button not responsive',
      description: 'Mobile navigation menu button does not respond to touch events',
      severity: 'CRITICAL',
      status: 'RESOLVED',
      taskId: 8,
      taskTitle: 'Implement responsive navigation',
      reportedBy: 'John Tester',
      assignedTo: 'Sarah Developer',
      reportedDate: '2024-01-12T16:45:00Z',
      lastUpdated: '2024-01-14T10:20:00Z',
      stepsToReproduce: [
        'Open application on mobile device',
        'Try to tap the hamburger menu button',
        'Menu does not open'
      ],
      expectedBehavior: 'Menu should open when tapped',
      actualBehavior: 'Nothing happens when tapping the menu button',
      environment: 'iOS Safari, iPhone 14'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedBug, setSelectedBug] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredBugs = bugReports.filter(bug => {
    const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || bug.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <Bug className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />;
      case 'RESOLVED': return <CheckCircle2 className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusCounts = {
    all: filteredBugs.length,
    OPEN: filteredBugs.filter(bug => bug.status === 'OPEN').length,
    IN_PROGRESS: filteredBugs.filter(bug => bug.status === 'IN_PROGRESS').length,
    RESOLVED: filteredBugs.filter(bug => bug.status === 'RESOLVED').length
  };

  const handleViewDetails = (bug) => {
    setSelectedBug(bug);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bug Reports</h2>
          <p className="text-gray-600">Track and manage reported bugs</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bugs</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <Bug className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.OPEN}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.IN_PROGRESS}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.RESOLVED}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bug reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          >
            <option value="all">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Bug Reports List */}
      <div className="space-y-4">
        {filteredBugs.map((bug) => (
          <div key={bug.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(bug.status)}
                  <span className="text-sm font-mono text-gray-500">#{bug.id}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{bug.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bug.status)}`}>
                      {bug.status}
                    </span>
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                      {bug.severity}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{bug.description}</p>
                  <div className="text-sm text-gray-500">
                    Related to: <span className="font-medium">{bug.taskTitle}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(bug)}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Reported by: {bug.reportedBy}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(bug.reportedDate)}</span>
                </div>
              </div>
              <div>
                Assigned to: <span className="font-medium">{bug.assignedTo}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredBugs.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Bug className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No bug reports found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || severityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No bugs have been reported yet'}
            </p>
          </div>
        )}
      </div>

      {/* Bug Detail Modal */}
      {showDetailModal && selectedBug && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Bug className="w-6 h-6 text-red-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBug.title}</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-gray-500">#{selectedBug.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBug.status)}`}>
                      {selectedBug.status}
                    </span>
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${getSeverityColor(selectedBug.severity)}`}>
                      {selectedBug.severity}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedBug.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Steps to Reproduce</h3>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  {selectedBug.stepsToReproduce.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Expected Behavior</h3>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-green-800">{selectedBug.expectedBehavior}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Actual Behavior</h3>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-red-800">{selectedBug.actualBehavior}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Environment</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBug.environment}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Reported by:</span>
                  <span className="ml-2 text-gray-600">{selectedBug.reportedBy}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Assigned to:</span>
                  <span className="ml-2 text-gray-600">{selectedBug.assignedTo}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Reported:</span>
                  <span className="ml-2 text-gray-600">{formatDate(selectedBug.reportedDate)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last updated:</span>
                  <span className="ml-2 text-gray-600">{formatDate(selectedBug.lastUpdated)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugReports;