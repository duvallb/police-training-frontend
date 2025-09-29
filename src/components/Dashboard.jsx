import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Award,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOfficers: 0,
    totalCourses: 0,
    upcomingEvents: 0,
    pendingExpenses: 0,
    certificationsDueExpiry: 0,
    trainingCompletionRate: 0
  })

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalOfficers: 156,
      totalCourses: 24,
      upcomingEvents: 8,
      pendingExpenses: 12,
      certificationsDueExpiry: 5,
      trainingCompletionRate: 87
    })
  }, [])

  const recentActivities = [
    { id: 1, type: 'training', description: 'Defensive Tactics Level 2 completed by Officer Johnson', time: '2 hours ago' },
    { id: 2, type: 'expense', description: 'Expense report submitted for Firearms Training', time: '4 hours ago' },
    { id: 3, type: 'request', description: 'New training request for SWAT Certification', time: '6 hours ago' },
    { id: 4, type: 'certification', description: 'CPR Certification renewed for Officer Smith', time: '1 day ago' }
  ]

  const upcomingTrainings = [
    { id: 1, course: 'Firearms Qualification', date: '2024-01-15', attendees: 12 },
    { id: 2, course: 'De-escalation Techniques', date: '2024-01-18', attendees: 8 },
    { id: 3, course: 'Emergency Response', date: '2024-01-22', attendees: 15 }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Officers</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOfficers}</div>
            <p className="text-xs text-blue-100">Active personnel</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Courses</CardTitle>
            <BookOpen className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-green-100">Available programs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-orange-100">Next 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingExpenses}</div>
            <p className="text-xs text-purple-100">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Training Completion Rate</span>
          </CardTitle>
          <CardDescription>Overall completion rate for mandatory training programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{stats.trainingCompletionRate}%</span>
            </div>
            <Progress value={stats.trainingCompletionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0">
                    {activity.type === 'training' && <Award className="h-4 w-4 text-green-600" />}
                    {activity.type === 'expense' && <DollarSign className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'request' && <BookOpen className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'certification' && <Target className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Trainings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Training Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTrainings.map((training) => (
                <div key={training.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{training.course}</p>
                    <p className="text-sm text-gray-500">{training.date}</p>
                  </div>
                  <Badge variant="secondary">
                    {training.attendees} officers
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.certificationsDueExpiry > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Certification Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">
              {stats.certificationsDueExpiry} certifications are due for renewal within the next 30 days.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard

