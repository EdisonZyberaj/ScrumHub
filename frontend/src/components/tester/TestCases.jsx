import React, { useState } from 'react';
import { Plus, Search, Filter, CheckCircle2, XCircle, Clock, Play, FileText, Edit3 } from 'lucide-react';

const TestCases = () => {
  const [testCases, setTestCases] = useState([
    {
      id: 1,
      title: 'User Login Functionality',
      description: 'Test user authentication with valid credentials',
      steps: [
        'Navigate to login page',
        'Enter valid username and password',
        'Click login button',
        'Verify successful redirect to dashboard'
      ],
      expectedResult: 'User should be logged in and redirected to dashboard',
      status: 'PASSED',
      priority: 'HIGH',
      taskId: 1,
      taskTitle: 'Implement user authentication',
      lastExecuted: '2024-01-15T10:30:00Z',
      executedBy: 'John Tester'
    },
    {
      id: 2,
      title: 'Form Validation - Empty Fields',
      description: 'Test form validation with empty required fields',
      steps: [
        'Navigate to registration form',
        'Leave required fields empty',
        'Click submit button',
        'Verify error messages appear'
      ],
      expectedResult: 'Appropriate error messages should be displayed',
      status: 'PENDING',
      priority: 'MEDIUM',
      taskId: 2,
      taskTitle: 'Add form validation',
      lastExecuted: null,
      executedBy: null
    },
    {
      id: 3,
      title: 'Password Strength Validation',
      description: 'Test password strength requirements',
      steps: [
        'Navigate to password change form',
        'Enter weak password',
        'Verify strength indicator',
        'Enter strong password',
        'Verify acceptance'
      ],
      expectedResult: 'Password strength should be accurately displayed',
      status: 'FAILED',
      priority: 'HIGH',
      taskId: 2,
      taskTitle: 'Add form validation',
      lastExecuted: '2024-01-14T14:20:00Z',
      executedBy: 'John Tester'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || testCase.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || testCase.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASSED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'RUNNING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASSED': return <CheckCircle2 className="w-4 h-4" />;
      case 'FAILED': return <XCircle className="w-4 h-4" />;
      case 'RUNNING': return <Clock className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-700 bg-red-50';
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const executeTestCase = (testCaseId) => {
    setTestCases(prev => prev.map(tc =>
      tc.id === testCaseId
        ? { ...tc, status: 'RUNNING', lastExecuted: new Date().toISOString(), executedBy: 'Current User' }
        : tc
    ));

    setTimeout(() => {
      setTestCases(prev => prev.map(tc =>
        tc.id === testCaseId
          ? { ...tc, status: 'PASSED' }
          : tc
      ));
    }, 2000);
  };

  const statusCounts = {
    all: filteredTestCases.length,
    PASSED: filteredTestCases.filter(tc => tc.status === 'PASSED').length,
    FAILED: filteredTestCases.filter(tc => tc.status === 'FAILED').length,
    PENDING: filteredTestCases.filter(tc => tc.status === 'PENDING').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Test Cases</h2>
          <p className="text-gray-600">Manage and execute test cases for your projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Test Case</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.PASSED}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.FAILED}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
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
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="PASSED">Passed</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-4">
        {filteredTestCases.map((testCase) => (
          <div key={testCase.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(testCase.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(testCase.status)}`}>
                    {testCase.status}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{testCase.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Related to: {testCase.taskTitle}</span>
                    <span className={`px-2 py-1 rounded ${getPriorityColor(testCase.priority)}`}>
                      {testCase.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => executeTestCase(testCase.id)}
                  disabled={testCase.status === 'RUNNING'}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                    testCase.status === 'RUNNING'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>{testCase.status === 'RUNNING' ? 'Running...' : 'Execute'}</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Test Steps */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Test Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                {testCase.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Expected Result */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Expected Result:</h4>
              <p className="text-sm text-blue-800">{testCase.expectedResult}</p>
            </div>

            {/* Execution Info */}
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Last executed: {formatDate(testCase.lastExecuted)}</span>
              {testCase.executedBy && <span>by {testCase.executedBy}</span>}
            </div>
          </div>
        ))}

        {filteredTestCases.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No test cases found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first test case'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Test Case</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCases;