import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const TrainingEvents = () => {
  const [events, setEvents] = useState([])
  const [courses, setCourses] = useState([])
  const [employees, setEmployees] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    course_id: '',
    event_date_time: '',
    location: '',
    instructors: ''
  })

  // Mock data for demonstration
  useEffect(() => {
    setCourses([
      { course_id: 1, name: 'Defensive Tactics Level 1' },
      { course_id: 2, name: 'Firearms Qualification' },
      { course_id: 3, name: 'De-escalation Techniques' }
    ])

    setEmployees([
      { employee_id: 1, first_name: 'John', last_name: 'Smith', badge_number: 'B001' },
      { employee_id: 2, first_name: 'Sarah', last_name: 'Johnson', badge_number: 'B002' },
      { employee_id: 3, first_name: 'Michael', last_name: 'Davis', badge_number: 'B003' },
      { employee_id: 4, first_name: 'Lisa', last_name: 'Wilson', badge_number: 'B004' }
    ])

    setEvents([
      {
        event_id: 1,
        course_id: 1,
        course_name: 'Defensive Tactics Level 1',
        event_date_time: '2024-01-15T09:00:00',
        location: 'Training Center A',
        instructors: 'Instructor Johnson, Instructor Smith',
        status: 'Scheduled',
        attendees: [
          { employee_id: 1, name: 'John Smith', status: 'Scheduled', completion_status: null },
          { employee_id: 2, name: 'Sarah Johnson', status: 'Scheduled', completion_status: null }
        ]
      },
      {
        event_id: 2,
        course_id: 2,
        course_name: 'Firearms Qualification',
        event_date_time: '2024-01-10T08:00:00',
        location: 'Shooting Range',
        instructors: 'Instructor Davis',
        status: 'Completed',
        attendees: [
          { employee_id: 3, name: 'Michael Davis', status: 'Completed', completion_status: 'Passed' },
          { employee_id: 4, name: 'Lisa Wilson', status: 'Completed', completion_status: 'Passed' }
        ]
      }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const course = courses.find(c => c.course_id === parseInt(formData.course_id))
    
    if (editingEvent) {
      setEvents(events.map(event => 
        event.event_id === editingEvent.event_id 
          ? { 
              ...formData, 
              event_id: editingEvent.event_id,
              course_name: course?.name,
              status: 'Scheduled',
              attendees: editingEvent.attendees || []
            }
          : event
      ))
    } else {
      setEvents([...events, { 
        ...formData, 
        event_id: Date.now(),
        course_name: course?.name,
        status: 'Scheduled',
        attendees: []
      }])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      course_id: '',
      event_date_time: '',
      location: '',
      instructors: ''
    })
    setEditingEvent(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (event) => {
    setFormData({
      course_id: event.course_id.toString(),
      event_date_time: event.event_date_time,
      location: event.location,
      instructors: event.instructors
    })
    setEditingEvent(event)
    setIsDialogOpen(true)
  }

  const handleDelete = (eventId) => {
    setEvents(events.filter(event => event.event_id !== eventId))
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>
      case 'Completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
      case 'Cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCompletionIcon = (completion_status) => {
    switch (completion_status) {
      case 'Passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'In Progress':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Training Events</h2>
          <p className="text-gray-600">Schedule and manage training events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Training Event' : 'Schedule New Training Event'}</DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update event details' : 'Create a new training event'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="course_id">Course</Label>
                <Select value={formData.course_id} onValueChange={(value) => setFormData({...formData, course_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date_time">Date & Time</Label>
                  <Input
                    id="event_date_time"
                    type="datetime-local"
                    value={formData.event_date_time}
                    onChange={(e) => setFormData({...formData, event_date_time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Training venue"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructors">Instructors</Label>
                <Input
                  id="instructors"
                  value={formData.instructors}
                  onChange={(e) => setFormData({...formData, instructors: e.target.value})}
                  placeholder="Instructor names (comma separated)"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingEvent ? 'Update Event' : 'Schedule Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.event_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.course_name}</CardTitle>
                  {getStatusBadge(event.status)}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event.event_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(event.event_date_time).toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {event.instructors}
                </div>
              </div>

              {event.attendees && event.attendees.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attendees ({event.attendees.length})</h4>
                  <div className="space-y-1">
                    {event.attendees.slice(0, 3).map((attendee) => (
                      <div key={attendee.employee_id} className="flex items-center justify-between text-xs">
                        <span>{attendee.name}</span>
                        {getCompletionIcon(attendee.completion_status)}
                      </div>
                    ))}
                    {event.attendees.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{event.attendees.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Combined View Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Combined Event View</span>
          </CardTitle>
          <CardDescription>
            Manage all training events from a single interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Instructors</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.event_id}>
                  <TableCell className="font-medium">{event.course_name}</TableCell>
                  <TableCell>{new Date(event.event_date_time).toLocaleString()}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.instructors}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {event.attendees?.length || 0} officers
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(event.event_id)}
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

export default TrainingEvents

