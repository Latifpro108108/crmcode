import type { IconType } from 'react-icons'

export type SectionId = 'dashboard' | 'sales' | 'finance' | 'hr'

export interface AppSection {
  id: SectionId
  label: string
  icon: IconType
  description: string
}

export interface ShortcutAction {
  label: string
  action: () => void
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
  time: string
}

export interface TaskItem {
  id: string
  title: string
  owner: string
  due: string
  status: 'open' | 'in-progress' | 'done'
}

export type LeadStageId = 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'won'

export interface LeadItem {
  id: string
  company: string
  owner: string
  stage: LeadStageId
  value: number
  lastContact: string
  confidence: number
}

export interface PipelineColumn {
  id: LeadStageId
  title: string
  description: string
  leadIds: string[]
}

export interface RevenuePoint {
  month: string
  actual: number
  target: number
}

export interface WinRatePoint {
  stage: LeadStageId
  value: number
}

export interface InvoiceItem {
  id: string
  client: string
  amount: number
  dueDate: string
  status: 'Paid' | 'Pending' | 'Overdue'
}

export interface ExpenseCategoryItem {
  id: string
  label: string
  amount: number
  trend: number
}

export interface ExpenseTrendPoint {
  month: string
  spend: number
}

export interface CashFlowPoint {
  month: string
  inflow: number
  outflow: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  location: string
  status: 'Online' | 'In Meeting' | 'Available' | 'Offline'
}

export interface LeaveRequestItem {
  id: string
  employee: string
  type: string
  dates: string
  status: 'Pending' | 'Approved' | 'Declined'
}

export type QuickActionType = 'task' | 'lead' | 'invoice'

export interface QuickActionState {
  isOpen: boolean
  type: QuickActionType
  invokedAt: number
}

