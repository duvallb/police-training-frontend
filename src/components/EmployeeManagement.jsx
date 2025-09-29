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
  Users, 
  Shield,
  Phone,
  Mail,
  Award,
  Calendar
} from 'lucide-react'

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    badge_number: '',
    rank_title: '',
    department_unit: '',
    contact_info: ''
  })

  // Mock data for demonstration
  useEffect(() => {
    setEmployees([
      {
        employee_id: 1,
        first_name: 'John',
        last_name: 'Smith',
        badge_number: 'B001',
        rank_title: 'Sergeant',
        department_unit: 'Patrol Division',
        contact_info: 'john.smith@police.gov'
      },
      {
        employee_id: 2,
        first_name: 'Sarah',
        last_name: 'Johnson',
        badge_number: 'B002',
        rank_title: 'Officer',
        department_unit: 'Traffic Division',
        contact_info: 'sarah.johnson@police.gov'
      },
      {
        employee_id: 3,
        first_name: 'Michael',
        last_name: 'Davis',
        badge_number: 'B003',
        rank_title: 'Detective',
        department_unit: 'Investigations',
        contact_info: 'michael.davis@police.gov'
      },
      {
        employee_id: 4,
        first_name: 'Lisa',
        last_name: 'Wilson',
        badge_number: 'B004',
        rank_title: 'Lieutenant',
        department_unit: 'SWAT Team',
        contact_info: 'lisa.wilson@police.gov'
      }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingEmployee) {
      setEmployees(employees.map(employee => 
        employee.employee_id === editingEmployee.employee_id 
          ? { ...formData, employee_id: editingEmployee.employee_id }
          : employee
      ))
    } else {
      setEmployees([...employees, { ...formData, employee_id: Date.now() }])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      badge_number: '',
      rank_title: '',
      department_unit: '',
      contact_info: ''
    })
    setEditingEmployee(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (employee) => {
    setFormData(employee)
    setEditingEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleDelete = (employeeId) => {
    setEmployees(employees.filter(employee => employee.employee_id !== employeeId))
  }

  const ranks = ['Officer', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain', 'Major', 'Chief']
  const departments = ['Patrol Division', 'Traffic Division', 'Investigations', 'SWAT Team', 'K-9 Unit', 'Community Relations', 'Training Division']

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Officer Management</h2>
          <p className="text-gray-600">Manage police officers and their information</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Officer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEmployee ? 'Edit Officer' : 'Add New Officer'}</DialogTitle>
              <DialogDescription>
                {editingEmployee ? 'Update officer information' : 'Add a new police officer to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge_number">Badge Number</Label>
                  <Input
                    id="badge_number"
                    value={formData.badge_number}
                    onChange={(e) => setFormData({...formData, badge_number: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rank_title">Rank/Title</Label>
                  <Select value={formData.rank_title} onValueChange={(value) => setFormData({...formData, rank_title: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rank" />
                    </SelectTrigger>
                    <SelectContent>
                      {ranks.map(rank => (
                        <SelectItem key={rank} value={rank}>{rank}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="department_unit">Department/Unit</Label>
                <Select value={formData.department_unit} onValueChange={(value) => setFormData({...formData, department_unit: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact_info">Contact Information</Label>
                <Input
                  id="contact_info"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                  placeholder="Email or phone number"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingEmployee ? 'Update Officer' : 'Add Officer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Officers Directory</span>
          </CardTitle>
          <CardDescription>
            Complete list of all police officers in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Badge</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {employee.badge_number}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">
                        {employee.first_name} {employee.last_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {employee.rank_title}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.department_unit}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      {employee.contact_info?.includes('@') ? (
                        <Mail className="h-3 w-3" />
                      ) : (
                        <Phone className="h-3 w-3" />
                      )}
                      <span>{employee.contact_info}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(employee.employee_id)}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Officers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">Active personnel</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(employees.map(e => e.department_unit)).size}
            </div>
            <p className="text-xs text-muted-foreground">Active units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supervisors</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.filter(e => ['Sergeant', 'Lieutenant', 'Captain', 'Major', 'Chief'].includes(e.rank_title)).length}
            </div>
            <p className="text-xs text-muted-foreground">Leadership roles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeManagement

