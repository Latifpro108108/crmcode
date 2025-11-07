import { useCallback, useEffect, useMemo, useState } from 'react'
import { RiDashboardLine, RiLineChartLine, RiMoneyDollarCircleLine, RiTeamLine } from 'react-icons/ri'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { Dashboard } from './sections/Dashboard'
import { Sales } from './sections/Sales'
import { Finance } from './sections/Finance'
import { HR } from './sections/HR'
import { ContextPanel } from './components/ContextPanel'
import { NotificationDrawer } from './components/NotificationDrawer'
import { QuickActionModal } from './components/QuickActionModal'
import { GuidanceBanner } from './components/GuidanceBanner'
import type {
  AppSection,
  ExpenseCategoryItem,
  InvoiceItem,
  LeadItem,
  PipelineColumn,
  QuickActionState,
  QuickActionType,
  ShortcutAction,
  TaskItem,
  TeamMember,
  LeaveRequestItem
} from './types'
import {
  cashFlowTrend,
  dashboardWidgets,
  expenseCategories,
  expenseTrend,
  financeInvoices,
  hrDirectory,
  leaveRequests,
  pipelineColumns,
  priorityTasks,
  recentActivities,
  revenueTrend,
  salesLeads,
  winRateByStage
} from './data/mockData'

const TRIPLE_ENTER_WINDOW = 600

const sections: AppSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: RiDashboardLine,
    description: 'Daily overview, key metrics, and quick actions.'
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: RiLineChartLine,
    description: 'Manage leads, deals, and revenue performance.'
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: RiMoneyDollarCircleLine,
    description: 'Track expenses, invoices, and financial health.'
  },
  {
    id: 'hr',
    label: 'HR',
    icon: RiTeamLine,
    description: 'Support people operations, attendance, and wellbeing.'
  }
]

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(sections[0])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [tasks, setTasks] = useState<TaskItem[]>(priorityTasks)
  const [leads, setLeads] = useState<LeadItem[]>(salesLeads)
  const [columns, setColumns] = useState<PipelineColumn[]>(pipelineColumns)
  const [invoices, setInvoices] = useState<InvoiceItem[]>(financeInvoices)
  const [categories, setCategories] = useState<ExpenseCategoryItem[]>(expenseCategories)
  const [quickAction, setQuickAction] = useState<QuickActionState | null>(null)
  const [directory, setDirectory] = useState<TeamMember[]>(hrDirectory)
  const [requests, setRequests] = useState<LeaveRequestItem[]>(leaveRequests)

  const guidance = useMemo(() => {
    switch (activeSection.id) {
      case 'sales':
        return {
          title: "Today's pipeline focus",
          summary: 'Keep momentum by nudging deals with stalled confidence scores.',
          highlights: ['Review negotiation-stage cards for new objections.', 'Use Enter ×3 to add a follow-up task.']
        }
      case 'finance':
        return {
          title: 'Finance priorities',
          summary: 'Surface overdue invoices and log any surprise spend spikes.',
          highlights: ['Log expenses immediately after purchases.', 'Send reminders for invoices due this week.']
        }
      case 'hr':
        return {
          title: 'People ops pulse',
          summary: 'Balance staffing questions with leave approvals in one pass.',
          highlights: ['Update statuses after stand-up.', 'Approve pending leave before 4 PM.']
        }
      default:
        return {
          title: 'Daily overview',
          summary: 'Start with high-impact metrics, then tackle the priority list.',
          highlights: ['Drag KPIs to match your flow.', 'Triple Enter opens quick capture for anything new.']
        }
    }
  }, [activeSection.id])

  const quickActionType: QuickActionType = useMemo(() => {
    switch (activeSection.id) {
      case 'sales':
        return 'lead'
      case 'finance':
        return 'invoice'
      default:
        return 'task'
    }
  }, [activeSection.id])

  useEffect(() => {
    let keyCount = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') {
        keyCount = 0
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        return
      }

      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        keyCount = 0
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        return
      }

      keyCount += 1

      if (timer) {
        clearTimeout(timer)
      }

      if (keyCount === 3) {
        event.preventDefault()
        setQuickAction({ isOpen: true, type: quickActionType, invokedAt: Date.now() })
        keyCount = 0
        timer = null
        return
      }

      timer = setTimeout(() => {
        keyCount = 0
        timer = null
      }, TRIPLE_ENTER_WINDOW)
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [quickActionType])

  const contextShortcuts: ShortcutAction[] = useMemo(() => {
    switch (activeSection.id) {
      case 'sales':
        return [
          { label: 'Add New Lead', action: () => setQuickAction({ isOpen: true, type: 'lead', invokedAt: Date.now() }) },
          { label: 'View Pipeline Board', action: () => undefined },
          { label: 'Analyze Win Rate', action: () => undefined }
        ]
      case 'finance':
        return [
          { label: 'Record Expense Category', action: () => undefined },
          { label: 'Download Cashflow Summary', action: () => undefined },
          { label: 'Schedule Invoice Reminder', action: () => setQuickAction({ isOpen: true, type: 'invoice', invokedAt: Date.now() }) }
        ]
      case 'hr':
        return [
          { label: 'Create Follow-up Task', action: () => setQuickAction({ isOpen: true, type: 'task', invokedAt: Date.now() }) },
          { label: 'Approve Leave', action: () => undefined },
          { label: 'Update Handbook', action: () => undefined }
        ]
      default:
        return [
          { label: 'Press Enter ×3 for Quick Add', action: () => setQuickAction({ isOpen: true, type: 'task', invokedAt: Date.now() }) },
          { label: 'Review Priority Tasks', action: () => undefined },
          { label: 'Share Weekly Report', action: () => undefined }
        ]
    }
  }, [activeSection.id])

  const handleAddTask = useCallback((payload: Omit<TaskItem, 'id' | 'status'> & { status?: TaskItem['status'] }) => {
    setTasks((prev) => [
      {
        id: `task-${crypto.randomUUID()}`,
        status: payload.status ?? 'open',
        ...payload
      },
      ...prev
    ])
  }, [])

  const handleUpdateTask = useCallback((id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }, [])

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const handleAddLead = useCallback((payload: Omit<LeadItem, 'id'>) => {
    const id = `lead-${crypto.randomUUID()}`
    setLeads((prev) => [{ id, ...payload }, ...prev])
    setColumns((prev) =>
      prev.map((column) =>
        column.id === payload.stage
          ? { ...column, leadIds: [id, ...column.leadIds] }
          : { ...column, leadIds: column.leadIds.filter((leadId) => leadId !== id) }
      )
    )
  }, [])

  const handleUpdateLead = useCallback((id: string, updates: Partial<LeadItem>) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)))
    if (updates.stage) {
      setColumns((prev) =>
        prev.map((column) => {
          const withoutLead = column.leadIds.filter((leadId) => leadId !== id)
          if (column.id === updates.stage) {
            return { ...column, leadIds: [id, ...withoutLead] }
          }
          return { ...column, leadIds: withoutLead }
        })
      )
    }
  }, [])

  const handleDeleteLead = useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id))
    setColumns((prev) => prev.map((column) => ({ ...column, leadIds: column.leadIds.filter((leadId) => leadId !== id) })))
  }, [])

  const handlePipelineMove = useCallback(
    (leadId: string, sourceStage: PipelineColumn['id'], targetStage: PipelineColumn['id'], targetIndex: number) => {
      const isSameStage = sourceStage === targetStage
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, stage: targetStage } : lead))
      )
      setColumns((prev) =>
        prev.map((column) => {
          const filtered = column.leadIds.filter((id) => id !== leadId)
          if (column.id === targetStage) {
            const nextIds = [...filtered]
            nextIds.splice(targetIndex, 0, leadId)
            return { ...column, leadIds: nextIds }
          }
          if (isSameStage) {
            return column
          }
          return { ...column, leadIds: filtered }
        })
      )
    },
    []
  )

  const handleAddInvoice = useCallback((payload: Omit<InvoiceItem, 'id' | 'status'> & { status?: InvoiceItem['status'] }) => {
    setInvoices((prev) => [
      {
        id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: payload.status ?? 'Pending',
        ...payload
      },
      ...prev
    ])
  }, [])

  const handleUpdateInvoice = useCallback((id: string, updates: Partial<InvoiceItem>) => {
    setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? { ...invoice, ...updates } : invoice)))
  }, [])

  const handleAddExpenseCategory = useCallback((label: string, amount: number) => {
    setCategories((prev) => [
      {
        id: `expense-${crypto.randomUUID()}`,
        label,
        amount,
        trend: 0
      },
      ...prev
    ])
  }, [])

  const handleAddMember = useCallback((payload: Omit<TeamMember, 'id'>) => {
    setDirectory((prev) => [...prev, { id: `team-${crypto.randomUUID()}`, ...payload }])
  }, [])

  const handleUpdateMemberStatus = useCallback((id: string, status: TeamMember['status']) => {
    setDirectory((prev) => prev.map((member) => (member.id === id ? { ...member, status } : member)))
  }, [])

  const handleUpdateLeaveStatus = useCallback((id: string, status: LeaveRequestItem['status']) => {
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)))
  }, [])

  const closeQuickAction = useCallback(() => {
    setQuickAction(null)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        onNotificationsClick={() => setIsDrawerOpen(true)}
      />
      <div className="main-content" role="main">
        <TopBar activeSection={activeSection} onOpenNotifications={() => setIsDrawerOpen(true)} />
        <GuidanceBanner section={activeSection} focus={guidance} />
        <div className="content-grid" aria-live="polite">
          {activeSection.id === 'dashboard' && (
            <Dashboard
              widgets={dashboardWidgets}
              tasks={tasks}
              activities={recentActivities}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              revenueTrend={revenueTrend}
            />
          )}
          {activeSection.id === 'sales' && (
            <Sales
              leads={leads}
              columns={columns}
              onAddLead={handleAddLead}
              onUpdateLead={handleUpdateLead}
              onDeleteLead={handleDeleteLead}
              onMoveLead={handlePipelineMove}
              revenueTrend={revenueTrend}
              winRate={winRateByStage}
            />
          )}
          {activeSection.id === 'finance' && (
            <Finance
              categories={categories}
              expenseTrend={expenseTrend}
              cashFlow={cashFlowTrend}
              invoices={invoices}
              onAddExpenseCategory={handleAddExpenseCategory}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoice={handleUpdateInvoice}
            />
          )}
          {activeSection.id === 'hr' && (
            <HR
              directory={directory}
              leaveRequests={requests}
              onAddMember={handleAddMember}
              onUpdateMemberStatus={handleUpdateMemberStatus}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
            />
          )}
          <ContextPanel section={activeSection} shortcuts={contextShortcuts} />
        </div>
      </div>
      <NotificationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <QuickActionModal
        isOpen={Boolean(quickAction?.isOpen)}
        type={quickAction?.type ?? quickActionType}
        onClose={closeQuickAction}
        onCreateTask={(payload) => {
          handleAddTask(payload)
          closeQuickAction()
        }}
        onCreateLead={(payload) => {
          handleAddLead(payload)
          closeQuickAction()
        }}
        onCreateInvoice={(payload) => {
          handleAddInvoice(payload)
          closeQuickAction()
        }}
      />
    </div>
  )
}

