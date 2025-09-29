import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, LogOut, Award, TrendingUp, BookOpen, Users, Calendar, DollarSign, FileText } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CourseManagement from './components/CourseManagement';
import EmployeeManagement from './components/EmployeeManagement';
import TrainingEvents from './components/TrainingEvents';
import ExpenseReports from './components/ExpenseReports';
import TrainingRequests from './components/TrainingRequests';
import CertificateManager from './components/CertificateManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DocumentManager from './components/DocumentManager';
import CSVImport from './components/CSVImport';
import Login from './components/Login';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for stored authentication
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setActiveTab('dashboard');
  };

  const canAccess = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = { 'viewer': 1, 'editor': 2, 'admin': 3 };
    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'editor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Police Training Management</h1>
                <p className="text-sm text-gray-600">Comprehensive Training & Certification System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Welcome, {user.username}</span>
                <Badge className={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                System Active
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-10 mb-8 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            {canAccess('viewer') && (
              <TabsTrigger value="courses" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </TabsTrigger>
            )}
            {canAccess('viewer') && (
              <TabsTrigger value="employees" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Officers</span>
              </TabsTrigger>
            )}
            {canAccess('viewer') && (
              <TabsTrigger value="events" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Events</span>
              </TabsTrigger>
            )}
            {canAccess('viewer') && (
              <TabsTrigger value="expenses" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Expenses</span>
              </TabsTrigger>
            )}
            {canAccess('viewer') && (
              <TabsTrigger value="requests" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Requests</span>
              </TabsTrigger>
            )}
            {canAccess('viewer') && (
              <TabsTrigger value="certificates" className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Certificates</span>
              </TabsTrigger>
            )}
            {canAccess('viewer') && (
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
            )}
            {canAccess('editor') && (
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </TabsTrigger>
            )}
            {canAccess('editor') && (
              <TabsTrigger value="csv-import" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>CSV Import</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard user={user} token={token} />
          </TabsContent>

          {canAccess('viewer') && (
            <TabsContent value="courses">
              <CourseManagement user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('viewer') && (
            <TabsContent value="employees">
              <EmployeeManagement user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('viewer') && (
            <TabsContent value="events">
              <TrainingEvents user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('viewer') && (
            <TabsContent value="expenses">
              <ExpenseReports user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('viewer') && (
            <TabsContent value="requests">
              <TrainingRequests user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('viewer') && (
            <TabsContent value="certificates">
              <CertificateManager user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('viewer') && (
            <TabsContent value="analytics">
              <AnalyticsDashboard user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('editor') && (
            <TabsContent value="documents">
              <DocumentManager user={user} token={token} />
            </TabsContent>
          )}

          {canAccess('editor') && (
            <TabsContent value="csv-import">
              <CSVImport user={user} token={token} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}

export default App;

