import type {
  CashFlowPoint,
  ExpenseCategoryItem,
  ExpenseTrendPoint,
  InvoiceItem,
  LeadItem,
  LeaveRequestItem,
  NotificationItem,
  PipelineColumn,
  RevenuePoint,
  TaskItem,
  TeamMember,
  WinRatePoint
} from '../types'

export const dashboardWidgets = [
  {
    id: 'sales-performance',
    title: 'Sales Performance',
    metric: '$1.2M',
    change: '+8.4%',
    description: 'Closed revenue this quarter'
  },
  {
    id: 'active-deals',
    title: 'Active Deals',
    metric: '36',
    change: '+5 new this week',
    description: 'Opportunities in progress'
  },
  {
    id: 'open-positions',
    title: 'Open Positions',
    metric: '5',
    change: '2 interviews today',
    description: 'Roles awaiting candidates'
  },
  {
    id: 'overdue-invoices',
    title: 'Overdue Invoices',
    metric: '3',
    change: '$18.4K outstanding',
    description: 'Needs finance follow up'
  },
  {
    id: 'team-happiness',
    title: 'Team Pulse',
    metric: '78',
    change: 'Stable since last week',
    description: 'Employee wellbeing index'
  }
]

export const recentActivities = [
  {
    id: 'activity-1',
    title: 'Quarterly review deck shared',
    time: '15 minutes ago',
    owner: 'Maya Patel'
  },
  {
    id: 'activity-2',
    title: 'Lead “Acme Health” moved to Proposal stage',
    time: '1 hour ago',
    owner: 'Luis Romero'
  },
  {
    id: 'activity-3',
    title: 'Invoice INV-2045 approved',
    time: '2 hours ago',
    owner: 'Finance automation'
  }
]

export const priorityTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Follow up with Q4 enterprise leads',
    due: '2025-11-07T16:00:00Z',
    owner: 'You',
    status: 'open'
  },
  {
    id: 'task-2',
    title: 'Confirm payroll adjustments',
    due: '2025-11-08T10:00:00Z',
    owner: 'Finance Team',
    status: 'in-progress'
  },
  {
    id: 'task-3',
    title: 'Review onboarding checklist for new hires',
    due: '2025-11-08T14:00:00Z',
    owner: 'HR Ops',
    status: 'open'
  }
]

export const salesLeads: LeadItem[] = [
  { id: 'lead-1', company: 'Acme Health', owner: 'Luis Romero', stage: 'proposal', value: 120000, lastContact: '2025-11-05', confidence: 65 },
  { id: 'lead-2', company: 'Metro Analytics', owner: 'Priya Singh', stage: 'prospect', value: 65000, lastContact: '2025-11-06', confidence: 35 },
  { id: 'lead-3', company: 'Northwind Labs', owner: 'Kim Lee', stage: 'negotiation', value: 210000, lastContact: '2025-11-07', confidence: 78 },
  { id: 'lead-4', company: 'BrightCore IoT', owner: 'Casey Morgan', stage: 'qualified', value: 85000, lastContact: '2025-11-04', confidence: 48 },
  { id: 'lead-5', company: 'BluePeak AI', owner: 'Maya Patel', stage: 'prospect', value: 54000, lastContact: '2025-11-01', confidence: 28 }
]

export const pipelineColumns: PipelineColumn[] = [
  {
    id: 'prospect',
    title: 'Prospect',
    description: 'Early conversations and qualification.',
    leadIds: ['lead-2', 'lead-5']
  },
  {
    id: 'qualified',
    title: 'Qualified',
    description: 'Validated pain points and budget.',
    leadIds: ['lead-4']
  },
  {
    id: 'proposal',
    title: 'Proposal',
    description: 'Decision makers reviewing offers.',
    leadIds: ['lead-1']
  },
  {
    id: 'negotiation',
    title: 'Negotiation',
    description: 'Pricing and terms under review.',
    leadIds: ['lead-3']
  },
  {
    id: 'won',
    title: 'Won',
    description: 'Signed and ready for implementation.',
    leadIds: []
  }
]

export const revenueTrend: RevenuePoint[] = [
  { month: 'Jun', actual: 680, target: 650 },
  { month: 'Jul', actual: 720, target: 700 },
  { month: 'Aug', actual: 740, target: 730 },
  { month: 'Sep', actual: 760, target: 760 },
  { month: 'Oct', actual: 810, target: 780 },
  { month: 'Nov', actual: 840, target: 820 }
]

export const winRateByStage: WinRatePoint[] = [
  { stage: 'prospect', value: 24 },
  { stage: 'qualified', value: 36 },
  { stage: 'proposal', value: 52 },
  { stage: 'negotiation', value: 68 },
  { stage: 'won', value: 100 }
]

export const financeInvoices: InvoiceItem[] = [
  { id: 'INV-2045', client: 'Northwind Labs', amount: 32500, dueDate: '2025-11-12', status: 'Paid' },
  { id: 'INV-2046', client: 'Acme Health', amount: 18400, dueDate: '2025-11-15', status: 'Overdue' },
  { id: 'INV-2047', client: 'Metro Analytics', amount: 9600, dueDate: '2025-11-18', status: 'Pending' },
  { id: 'INV-2048', client: 'BrightCore IoT', amount: 14200, dueDate: '2025-11-20', status: 'Pending' }
]

export const expenseCategories: ExpenseCategoryItem[] = [
  { id: 'expense-1', label: 'Cloud Infrastructure', amount: 42300, trend: 6 },
  { id: 'expense-2', label: 'Team Training', amount: 12450, trend: 2 },
  { id: 'expense-3', label: 'Travel & Events', amount: 8700, trend: -4 },
  { id: 'expense-4', label: 'Contractors', amount: 5400, trend: 3 }
]

export const expenseTrend: ExpenseTrendPoint[] = [
  { month: 'Jun', spend: 54 },
  { month: 'Jul', spend: 58 },
  { month: 'Aug', spend: 62 },
  { month: 'Sep', spend: 65 },
  { month: 'Oct', spend: 61 },
  { month: 'Nov', spend: 59 }
]

export const cashFlowTrend: CashFlowPoint[] = [
  { month: 'Jun', inflow: 82, outflow: 64 },
  { month: 'Jul', inflow: 88, outflow: 66 },
  { month: 'Aug', inflow: 91, outflow: 69 },
  { month: 'Sep', inflow: 95, outflow: 72 },
  { month: 'Oct', inflow: 102, outflow: 75 },
  { month: 'Nov', inflow: 108, outflow: 78 }
]

export const hrDirectory: TeamMember[] = [
  { id: 'team-1', name: 'Maya Patel', role: 'HR Lead', location: 'Remote · NYC', status: 'Online' },
  { id: 'team-2', name: 'Lucas Martin', role: 'Talent Partner', location: 'Austin HQ', status: 'In Meeting' },
  { id: 'team-3', name: 'Sophia Chen', role: 'People Ops Analyst', location: 'Remote · Seattle', status: 'Available' },
  { id: 'team-4', name: 'Devin Brooks', role: 'HRIS Specialist', location: 'Austin HQ', status: 'Online' }
]

export const leaveRequests: LeaveRequestItem[] = [
  { id: 'leave-1', employee: 'Dmitri Volkov', type: 'Parental Leave', dates: 'Nov 12 - Nov 26', status: 'Pending' },
  { id: 'leave-2', employee: 'Hannah Kim', type: 'Vacation', dates: 'Nov 18 - Nov 22', status: 'Approved' },
  { id: 'leave-3', employee: 'Nora Singh', type: 'Medical', dates: 'Nov 25 - Nov 29', status: 'Pending' }
]

export const attendanceSummary = [
  { label: 'On Time', value: 92 },
  { label: 'Late', value: 5 },
  { label: 'Absent', value: 3 }
]

export const notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Pipeline Momentum',
    message: 'You have three deals entering the negotiation stage. Prep pricing guidance now.',
    type: 'info',
    time: '5 minutes ago'
  },
  {
    id: 'notif-2',
    title: 'Invoice Overdue',
    message: 'Invoice INV-2046 is 3 days overdue. Send a courtesy reminder to the client.',
    type: 'warning',
    time: '20 minutes ago'
  },
  {
    id: 'notif-3',
    title: 'Welcome New Hire',
    message: 'Patricia Gomez joins the Customer Success team today. Assign a mentor.',
    type: 'success',
    time: '2 hours ago'
  }
]

