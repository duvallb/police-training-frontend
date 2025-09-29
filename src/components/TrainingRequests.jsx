import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  User,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare
} from 'lucide-react'

const TrainingRequests = () => {
  const [requests, setRequests] = useState([])
  const [employees, setEmployees] = useState([])
  const [courses, setCourses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState(null)
  const [formData, setFormData] = useState({
    employee_id: '',
    requested_course_id: '',
    requested_course_name: '',
    justification: '',
    status: 'Pending'
  })

  // Mock data for demonstration
  useEffect(() => {
    setEmployees([
      { employee_id: 1, first_name: 'John', last_name: 'Smith', badge_number: 'B001' },
      { employee_id: 2, first_name: 'Sarah', last_name: 'Johnson', badge_number: 'B002' },
      { employee_id: 3, first_name: 'Michael', last_name: 'Davis', badge_number: 'B003' },
      { employee_id: 4, first_name: 'Lisa', last_name: 'Wilson', badge_number: 'B004' }
    ])

    setCourses([
      { course_id: 1, name: 'Defensive Tactics Level 1' },
      { course_id: 2, name: 'Firearms Qualification' },
      { course_id: 3, name: 'De-escalation Techniques' },
      { course_id: 4, name: 'SWAT Certification' },
      { course_id: 5, name: 'Crisis Negotiation' }
    ])

    setRequests([
      {
        request_id: 1,
        employee_id: 1,
        employee_name: 'John Smith',
        requested_course_id: 4,
        requested_course_name: 'SWAT Certification',
        justification: 'I have been selected for the SWAT team and need this certification to fulfill my new role requirements.',
        status: 'Pending',
        date_requested: '2024-01-10T09:30:00'
      },
      {
        request_id: 2,
        employee_id: 2,
        employee_name: 'Sarah Johnson',
        requested_course_id: null,
        requested_course_name: 'Advanced Traffic Investigation',
        justification: 'Our department needs specialized training in traffic accident investigation. This course would enhance our capabilities.',
        status: 'Approved',
        date_requested: '2024-01-08T14:15:00'
      },
      {
        request_id: 3,
        employee_id: 3,
        employee_name: 'Michael Davis',
        requested_course_id: 5,
        requested_course_name: 'Crisis Negotiation',
        justification: 'I am interested in developing crisis negotiation skills to better serve the community during high-stress situations.',
        status: 'Rejected',
        date_requested: '2024-01-05T11:45:00'
      }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const employee = employees.find(e => e.employee_id === parseInt(formData.employee_id))
    const course = courses.find(c => c.course_id === parseInt(formData.requested_course_id))
    
    if (editingRequest) {
      setRequests(requests.map(request => 
        request.request_id === editingRequest.request_id 
          ? { 
              ...formData, 
              request_id: editingRequest.request_id,
              employee_name: employee ? `${employee.first_name} ${employee.last_name}` : '',
              requested_course_name: formData.requested_course_id ? course?.name : formData.requested_course_name,
              date_requested: editingRequest.date_requested
            }
          : request
      ))
    } else {
      setRequests([...requests, { 
        ...formData, 
        request_id: Date.now(),
        employee_name: employee ? `${employee.first_name} ${employee.last_name}` : '',
        requested_course_name: formData.requested_course_id ? course?.name : formData.requested_course_name,
        date_requested: new Date().toISOString()
      }])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      employee_id: '',
      requested_course_id: '',
      requested_course_name: '',
      justification: '',
      status: 'Pending'
    })
    setEditingRequest(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (request) => {
    setFormData({
      employee_id: request.employee_id.toString(),
      requested_course_id: request.requested_course_id?.toString() || '',
      requested_course_name: request.requested_course_id ? '' : request.requested_course_name,
      justification: request.justification,
      status: request.status
    })
    setEditingRequest(request)
    setIsDialogOpen(true)
  }

  const handleDelete = (requestId) => {
    setRequests(requests.filter(request => request.request_id !== requestId))
  }

  const handleStatusUpdate = (requestId, newStatus) => {
    setRequests(requests.map(request => 
      request.request_id === requestId 
        ? { ...request, status: newStatus }
        : request
    ))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
      case 'Approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'Pending').length
  const approvedRequests = requests.filter(r => r.status === 'Approved').length
  const rejectedRequests = requests.filter(r => r.status === 'Rejected').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Training Requests</h2>
          <p className="text-gray-600">Manage employee training requests and approvals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRequest ? 'Edit Training Request' : 'Submit Training Request'}</DialogTitle>
              <DialogDescription>
                {editingRequest ? 'Update training request details' : 'Request training for an officer'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="employee_id">Officer</Label>
                <Select value={formData.employee_id} onValueChange={(value) => setFormData({...formData, employee_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select officer" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.employee_id} value={employee.employee_id.toString()}>
                        {employee.first_name} {employee.last_name} ({employee.badge_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="requested_course_id">Existing Course (Optional)</Label>
                <Select 
                  value={formData.requested_course_id} 
                  onValueChange={(value) => setFormData({...formData, requested_course_id: value, requested_course_name: ''})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select existing course or leave blank for new course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.course_id} value={course.course_id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!formData.requested_course_id && (
                <div>
                  <Label htmlFor="requested_course_name">New Course Name</Label>
                  <Input
                    id="requested_course_name"
                    value={formData.requested_course_name}
                    onChange={(e) => setFormData({...formData, requested_course_name: e.target.value})}
                    placeholder="Enter name for new course request"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="justification">Justification</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => setFormData({...formData, justification: e.target.value})}
                  placeholder="Explain why this training is needed and how it will benefit the officer and department"
                  rows={4}
                  required
                />
              </div>

              {editingRequest && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingRequest ? 'Update Request' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests}</div>
            <p className="text-xs text-muted-foreground">Ready for scheduling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests}</div>
            <p className="text-xs text-muted-foreground">Declined requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Training Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Training Requests</span>
          </CardTitle>
          <CardDescription>
            Employee-requested training courses and new course suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Officer</TableHead>
                <TableHead>Requested Course</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Justification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.request_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{request.employee_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span>{request.requested_course_name}</span>
                      {!request.requested_course_id && (
                        <Badge variant="outline" className="text-xs">New Course</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(request.date_requested).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-600 truncate" title={request.justification}>
                        {request.justification}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {request.status === 'Pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(request.request_id, 'Approved')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusUpdate(request.request_id, 'Rejected')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(request)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(request.request_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default TrainingRequests

