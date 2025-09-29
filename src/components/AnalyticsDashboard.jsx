import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users, FileText, Award, DollarSign } from 'lucide-react';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [quarter, setQuarter] = useState(Math.ceil((new Date().getMonth() + 1) / 3));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [period, year, month, quarter]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        period,
        ...(year && { year: year.toString() }),
        ...(period === 'monthly' && month && { month: month.toString() }),
        ...(period === 'quarterly' && quarter && { quarter: quarter.toString() })
      });

      const response = await fetch(`/api/analytics/dashboard-summary?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          {period === 'yearly' && (
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}

          {period === 'monthly' && (
            <>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </>
          )}

          {period === 'quarterly' && (
            <>
              <select
                value={quarter}
                onChange={(e) => setQuarter(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>Q1</option>
                <option value={2}>Q2</option>
                <option value={3}>Q3</option>
                <option value={4}>Q4</option>
              </select>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.training_completion && (
          <StatCard
            title="Training Completion Rate"
            value={`${analyticsData.training_completion.completion_rate}%`}
            icon={TrendingUp}
            color="bg-green-500"
            subtitle={`${analyticsData.training_completion.completed_enrollments}/${analyticsData.training_completion.total_enrollments} completed`}
          />
        )}

        {analyticsData.expense_trends && analyticsData.expense_trends.data.length > 0 && (
          <StatCard
            title="Total Expenses"
            value={formatCurrency(analyticsData.expense_trends.data.reduce((sum, item) => sum + item.total_amount, 0))}
            icon={DollarSign}
            color="bg-blue-500"
            subtitle={`${analyticsData.expense_trends.data.reduce((sum, item) => sum + item.count, 0)} expense reports`}
          />
        )}

        {analyticsData.certification_status && (
          <StatCard
            title="Active Certifications"
            value={analyticsData.certification_status.active_certifications}
            icon={Award}
            color="bg-purple-500"
            subtitle={`${analyticsData.certification_status.expired_certifications} expired`}
          />
        )}

        {analyticsData.document_processing && (
          <StatCard
            title="Documents Processed"
            value={analyticsData.document_processing.total_documents}
            icon={FileText}
            color="bg-orange-500"
            subtitle={`${analyticsData.document_processing.verified_documents} verified`}
          />
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Training by Category */}
        {analyticsData.training_by_category && analyticsData.training_by_category.data.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.training_by_category.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.training_by_category.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expense Trends */}
        {analyticsData.expense_trends && analyticsData.expense_trends.data.length > 1 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.expense_trends.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="total_amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Progress */}
        {analyticsData.employee_progress && analyticsData.employee_progress.data.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Training Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.employee_progress.data.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion_rate" fill="#8884d8" name="Completion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Training Requests Status */}
        {analyticsData.training_requests && analyticsData.training_requests.by_status.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Requests Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.training_requests.by_status}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Document Processing Status */}
      {analyticsData.document_processing && analyticsData.document_processing.by_status.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Processing Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analyticsData.document_processing.by_status}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.document_processing.by_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {analyticsData.document_processing.by_status.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium capitalize">{item.status}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

