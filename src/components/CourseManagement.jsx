import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Clock, 
  DollarSign,
  Users,
  Target
} from 'lucide-react'

const CourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    specialties: '',
    duration: '',
    prerequisites: '',
    budget: '',
    sponsors: '',
    reusable: false
  })

  // Mock data for demonstration
  useEffect(() => {
    setCourses([
      {
        course_id: 1,
        name: 'Defensive Tactics Level 1',
        description: 'Basic defensive tactics and self-defense techniques for patrol officers',
        category: 'Defensive Tactics',
        specialties: 'Patrol, General',
        duration: '8 hours',
        prerequisites: 'None',
        budget: 1500,
        sponsors: 'Police Academy',
        reusable: true
      },
      {
        course_id: 2,
        name: 'Firearms Qualification',
        description: 'Annual firearms training and qualification course',
        category: 'Firearms',
        specialties: 'All Units',
        duration: '4 hours',
        prerequisites: 'Basic Firearms Training',
        budget: 800,
        sponsors: 'Training Division',
        reusable: true
      },
      {
        course_id: 3,
        name: 'De-escalation Techniques',
        description: 'Advanced communication and de-escalation strategies',
        category: 'Professional Development',
        specialties: 'Patrol, Community Relations',
        duration: '6 hours',
        prerequisites: 'Basic Communication Skills',
        budget: 1200,
        sponsors: 'Community Relations Department',
        reusable: true
      }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingCourse) {
      setCourses(courses.map(course => 
        course.course_id === editingCourse.course_id 
          ? { ...formData, course_id: editingCourse.course_id }
          : course
      ))
    } else {
      setCourses([...courses, { ...formData, course_id: Date.now() }])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      specialties: '',
      duration: '',
      prerequisites: '',
      budget: '',
      sponsors: '',
      reusable: false
    })
    setEditingCourse(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (course) => {
    setFormData(course)
    setEditingCourse(course)
    setIsDialogOpen(true)
  }

  const handleDelete = (courseId) => {
    setCourses(courses.filter(course => course.course_id !== courseId))
  }

  const categories = ['Defensive Tactics', 'Firearms', 'Professional Development', 'In-Service', 'SWAT', 'Investigations']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Course Management</h2>
          <p className="text-gray-600">Create and manage training courses for police officers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update course details' : 'Add a new training course to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialties">Specialties</Label>
                  <Input
                    id="specialties"
                    value={formData.specialties}
                    onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                    placeholder="e.g., Patrol, SWAT, Investigations"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g., 8 hours, 2 days"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Input
                  id="prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                  placeholder="Required courses or certifications"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="sponsors">Sponsors</Label>
                  <Input
                    id="sponsors"
                    value={formData.sponsors}
                    onChange={(e) => setFormData({...formData, sponsors: e.target.value})}
                    placeholder="Sponsoring organizations"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reusable"
                  checked={formData.reusable}
                  onChange={(e) => setFormData({...formData, reusable: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="reusable">Reusable course template</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.course_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {course.category}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(course.course_id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {course.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="h-4 w-4 mr-2" />
                  {course.specialties}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ${course.budget?.toLocaleString()}
                </div>
              </div>

              {course.reusable && (
                <Badge variant="outline" className="mt-3 bg-green-50 text-green-700 border-green-200">
                  Reusable Template
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CourseManagement

