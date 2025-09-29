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
  DollarSign, 
  Download,
  Filter,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

const ExpenseReports = () => {
  const [expenses, setExpenses] = useState([])
  const [employees, setEmployees] = useState([])
  const [events, setEvents] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [formData, setFormData] = useState({
    employee_id: '',
    event_id: '',
    total_amount: '',
    status: 'Pending',
    items: '',
    payment_status: 'Unpaid'
  })

  // Mock data for demonstration
  useEffect(() => {
    setEmployees([
      { employee_id: 1, first_name: 'John', last_name: 'Smith', badge_number: 'B001' },
      { employee_id: 2, first_name: 'Sarah', last_name: 'Johnson', badge_number: 'B002' },
      { employee_id: 3, first_name: 'Michael', last_name: 'Davis', badge_number: 'B003' },
      { employee_id: 4, first_name: 'Lisa', last_name: 'Wilson', badge_number: 'B004' }
    ])

    setEvents([
      { event_id: 1, course_name: 'Defensive Tactics Level 1' },
      { event_id: 2, course_name: 'Firearms Qualification' },
      { event_id: 3, course_name: 'De-escalation Techniques' }
    ])

    setExpenses([
      {
        report_id: 1,
        employee_id: 1,
        employee_name: 'John Smith',
        event_id: 1,
        event_name: 'Defensive Tactics Level 1',
        date_submitted: '2024-01-12T10:30:00',
        total_amount: 250.00,
        status: 'Approved',
        items: 'Travel expenses: $150, Accommodation: $100',
        payment_status: 'Paid'
      },
      {
        report_id: 2,
        employee_id: 2,
        employee_name: 'Sarah Johnson',
        event_id: 2,
        event_name: 'Firearms Qualification',
        date_submitted: '2024-01-10T14:15:00',
        total_amount: 180.00,
        status: 'Pending',
        items: 'Travel expenses: $120, Meals: $60',
        payment_status: 'Unpaid'
      },
      {
        report_id: 3,
        employee_id: 3,
        employee_name: 'Michael Davis',
        event_id: 1,
        event_name: 'Defensive Tactics Level 1',
        date_submitted: '2024-01-08T09:45:00',
        total_amount: 320.00,
        status: 'Rejected',
        items: 'Travel expenses: $200, Accommodation: $120',
        payment_status: 'Unpaid'
      }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const employee = employees.find(e => e.employee_id === parseInt(formData.employee_id))
    const event = events.find(e => e.event_id === parseInt(formData.event_id))
    
    if (editingExpense) {
      setExpenses(expenses.map(expense => 
        expense.report_id === editingExpense.report_id 
          ? { 
              ...formData, 
              report_id: editingExpense.report_id,
              employee_name: employee ? `${employee.first_name} ${employee.last_name}` : '',
              event_name: event?.course_name || '',
              date_submitted: editingExpense.date_submitted,
              total_amount: parseFloat(formData.total_amount)
            }
          : expense
      ))
    } else {
      setExpenses([...expenses, { 
        ...formData, 
        report_id: Date.now(),
        employee_name: employee ? `${employee.first_name} ${employee.last_name}` : '',
        event_name: event?.course_name || '',
        date_submitted: new Date().toISOString(),
        total_amount: parseFloat(formData.total_amount)
      }])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      employee_id: '',
      event_id: '',
      total_amount: '',
      status: 'Pending',
      items: '',
      payment_status: 'Unpaid'
    })
    setEditingExpense(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (expense) => {
    setFormData({
      employee_id: expense.employee_id.toString(),
      event_id: expense.event_id?.toString() || '',
      total_amount: expense.total_amount.toString(),
      status: expense.status,
      items: expense.items,
      payment_status: expense.payment_status
    })
    setEditingExpense(expense)
    setIsDialogOpen(true)
  }

  const handleDelete = (reportId) => {
    setExpenses(expenses.filter(expense => expense.report_id !== reportId))
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

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'Paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>
      case 'Unpaid':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Unpaid</Badge>
      default:
        return <Badge variant="outline">{paymentStatus}</Badge>
    }
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.total_amount, 0)
  const approvedExpenses = expenses.filter(e => e.status === 'Approved').reduce((sum, expense) => sum + expense.total_amount, 0)
  const pendingExpenses = expenses.filter(e => e.status === 'Pending').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Expense Reports</h2>
          <p className="text-gray-600">Track and manage training-related expenses</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Expense Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingExpense ? 'Edit Expense Report' : 'Create New Expense Report'}</DialogTitle>
                <DialogDescription>
                  {editingExpense ? 'Update expense report details' : 'Submit a new training expense report'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Label htmlFor="event_id">Training Event (Optional)</Label>
                    <Select value={formData.event_id} onValueChange={(value) => setFormData({...formData, event_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map(event => (
                          <SelectItem key={event.event_id} value={event.event_id.toString()}>
                            {event.course_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total_amount">Total Amount ($)</Label>
                    <Input
                      id="total_amount"
                      type="number"
                      step="0.01"
                      value={formData.total_amount}
                      onChange={(e) => setFormData({...formData, total_amount: e.target.value})}
                      required
                    />
                  </div>
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
                </div>

                <div>
                  <Label htmlFor="items">Expense Items</Label>
                  <Textarea
                    id="items"
                    value={formData.items}
                    onChange={(e) => setFormData({...formData, items: e.target.value})}
                    placeholder="Detailed breakdown of expenses (e.g., Travel: $150, Accommodation: $100)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select value={formData.payment_status} onValueChange={(value) => setFormData({...formData, payment_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingExpense ? 'Update Report' : 'Submit Report'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All submitted reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${approvedExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Expense Reports</span>
          </CardTitle>
          <CardDescription>
            All training-related expense reports with filtering and export options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Officer</TableHead>
                <TableHead>Training Event</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.report_id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{expense.employee_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{expense.event_name || 'General Training'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(expense.date_submitted).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${expense.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell>{getPaymentBadge(expense.payment_status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.report_id)}
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

export default ExpenseReports

