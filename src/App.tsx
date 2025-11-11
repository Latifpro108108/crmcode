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
import { AuthScreen } from './components/AuthScreen'
import { OnboardingGuide, type OnboardingStep } from './components/OnboardingGuide'
import type {
  AppSection,
  ExpenseCategoryItem,
  InvoiceItem,
  LeadItem,
  PipelineColumn,
  QuickActionState,
  QuickActionType,
  SectionId,
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
const STORAGE_KEYS = {
  user: 'pulsecrm_user',
  onboarding: 'pulsecrm_onboarding_complete'
}

interface InsightCard {
  title: string
  description: string
  checklist?: string[]
}

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
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return Boolean(window.localStorage.getItem(STORAGE_KEYS.user))
  })
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string }>(() => {
    if (typeof window === 'undefined') return { name: '', email: '' }
    const stored = window.localStorage.getItem(STORAGE_KEYS.user)
    return stored ? JSON.parse(stored) : { name: '', email: '' }
  })
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(STORAGE_KEYS.onboarding) === 'true'
  })
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
  const [insight, setInsight] = useState<InsightCard | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (!isAuthenticated) {
      window.localStorage.removeItem(STORAGE_KEYS.user)
      return
    }
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(currentUser))
  }, [isAuthenticated, currentUser])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(STORAGE_KEYS.onboarding, String(hasCompletedOnboarding))
  }, [hasCompletedOnboarding])

  const handleSelectSection = useCallback(
    (section: AppSection) => {
      setActiveSection(section)
      setInsight(null)
    },
    []
  )

  const goToSection = useCallback(
    (sectionId: SectionId) => {
      const next = sections.find((section) => section.id === sectionId)
      if (next) {
        handleSelectSection(next)
      }
    },
    [handleSelectSection]
  )

  const handleAuthenticate = useCallback((profile: { name: string; email: string }) => {
    setCurrentUser(profile)
    setIsAuthenticated(true)
    setHasCompletedOnboarding(false)
  }, [])

  const handleContinueAsGuest = useCallback(() => {
    setCurrentUser({ name: 'Guest Explorer', email: 'guest@pulsecrm.com' })
    setIsAuthenticated(true)
    setHasCompletedOnboarding(false)
  }, [])

  const handleCompleteOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true)
    setInsight({
      title: 'Tour complete',
      description: 'Great! You can revisit the guide from the Help menu anytime.',
      checklist: ['Press Enter ×3 to capture a task', 'Use shortcuts on the right to jump to key flows']
    })
  }, [])

  const handleSkipOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true)
    setInsight({
      title: 'Tour skipped',
      description: 'No worries—open Help later if you want a guided walkthrough.'
    })
  }, [])

  const handleDismissInsight = useCallback(() => {
    setInsight(null)
  }, [])

  const handleShowHelp = useCallback(() => {
    if (hasCompletedOnboarding) {
      setHasCompletedOnboarding(false)
      return
    }
    setInsight({
      title: 'Workspace navigation tips',
      description: 'Use the sidebar to switch focus areas and the right panel for context quick wins.',
      checklist: [
        'Dashboard: monitor KPIs and urgent tasks',
        'Sales: keep deals moving stage by stage',
        'Finance: reconcile spend and invoices',
        'HR: balance approvals with staffing health'
      ]
    })
  }, [hasCompletedOnboarding])

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

  const openQuickAction = useCallback(
    (type: QuickActionType) => {
      setQuickAction({ isOpen: true, type, invokedAt: Date.now() })
    },
    []
  )


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
        openQuickAction(quickActionType)
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
  }, [openQuickAction, quickActionType])

  const onboardingSteps = useMemo<OnboardingStep[]>(
    () => [
      {
        id: 'dashboard',
        title: 'Step 1 · Dashboard overview',
        section: 'dashboard',
        summary: 'Pin the KPIs and tasks that drive your morning stand-up.',
        highlights: [
          'Drag widgets to prioritize metrics that matter right now.',
          'Use the quick add form to capture tasks without breaking focus.',
          'Review recent activity to spot cross-team updates in seconds.'
        ],
        cta: 'Show me Sales'
      },
      {
        id: 'sales',
        title: 'Step 2 · Sales pipeline',
        section: 'sales',
        summary: 'Keep deals flowing by focusing on momentum and confidence.',
        highlights: [
          'Drag cards between stages to keep forecasts accurate.',
          'Add confidence scores so leaders can unblock slow deals.',
          'Use the win-rate chart to coach the team on what works.'
        ],
        cta: 'Jump to Finance'
      },
      {
        id: 'finance',
        title: 'Step 3 · Finance pulse',
        section: 'finance',
        summary: 'Track spend, cashflow trends, and invoice reminders in one view.',
        highlights: [
          'Log a new expense category when budgets shift mid-quarter.',
          'Monitor cashflow variance to stay ahead of runway risks.',
          'Schedule invoice nudges before payment dates slip.'
        ],
        cta: 'Review HR'
      },
      {
        id: 'hr',
        title: 'Step 4 · People operations',
        section: 'hr',
        summary: 'Balance wellbeing with staffing coverage before approving leave.',
        highlights: [
          'Filter the directory to see availability at a glance.',
          'Approve or decline leave requests with a single click.',
          'Log follow-up tasks to keep people programs on track.'
        ]
      }
    ],
    []
  )

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

  const handleResetTour = useCallback(() => {
    setHasCompletedOnboarding(false)
    setInsight(null)
  }, [])

  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false)
    setCurrentUser({ name: '', email: '' })
    setAuthMode('login')
    setTasks(priorityTasks)
    setLeads(salesLeads)
    setColumns(pipelineColumns)
    setInvoices(financeInvoices)
    setCategories(expenseCategories)
    setDirectory(hrDirectory)
    setRequests(leaveRequests)
    setQuickAction(null)
    setInsight(null)
    setIsDrawerOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEYS.user)
      window.localStorage.removeItem(STORAGE_KEYS.onboarding)
    }
  }, [])

  const contextShortcuts: ShortcutAction[] = useMemo(() => {
    switch (activeSection.id) {
      case 'sales':
        return [
          { label: 'Add New Lead', action: () => openQuickAction('lead') },
          {
            label: 'View Pipeline Board',
            action: () => goToSection('sales')
          },
          {
            label: 'Analyze Win Rate',
            action: () =>
              setInsight({
                title: 'Win rate momentum',
                description: 'Focus on late-stage deals with confidence below 60%.',
                checklist: [
                  'Review negotiation-stage deals that stalled last week.',
                  'Coach owners on next-step commitments before Friday.',
                  'Share learnings on the team channel after each conversion.'
                ]
              })
          }
        ]
      case 'finance':
        return [
          {
            label: 'Record Expense Category',
            action: () => {
              if (typeof window === 'undefined') return
              const label = window.prompt('Expense category name?')
              if (!label) return
              const amountInput = window.prompt('How much was spent? (USD)')
              const amount = amountInput ? Number(amountInput) : 0
              if (Number.isNaN(amount) || amount <= 0) {
                setInsight({
                  title: 'Expense not saved',
                  description: 'Enter a positive amount next time to log the category.'
                })
                return
              }
              handleAddExpenseCategory(label.trim(), amount)
              setInsight({
                title: 'Expense captured',
                description: `${label.trim()} logged for $${amount.toLocaleString()}.`,
                checklist: [
                  'Tag large purchases with an owner for follow-up.',
                  'Run the cashflow view to confirm budgets stay on track.'
                ]
              })
            }
          },
          {
            label: 'Download Cashflow Summary',
            action: () =>
              setInsight({
                title: 'Cashflow summary queued',
                description: 'A shareable PDF will be prepared for your finance channel.',
                checklist: [
                  'Check inflow vs outflow variance for the last 30 days.',
                  'Flag any negative trend to leadership during stand-up.'
                ]
              })
          },
          { label: 'Schedule Invoice Reminder', action: () => openQuickAction('invoice') }
        ]
      case 'hr':
        return [
          { label: 'Create Follow-up Task', action: () => openQuickAction('task') },
          {
            label: 'Approve Leave',
            action: () => {
              const pending = requests.find((request) => request.status === 'Pending')
              if (!pending) {
                setInsight({
                  title: 'No pending requests',
                  description: 'All leave requests are up to date.'
                })
                return
              }
              handleUpdateLeaveStatus(pending.id, 'Approved')
              setInsight({
                title: 'Leave approved',
                description: `${pending.employee} has been notified.`,
                checklist: ['Update the team rota and share coverage notes.']
              })
            }
          },
          {
            label: 'Update Handbook',
            action: () =>
              setInsight({
                title: 'Handbook refresh',
                description: 'Document expectations around hybrid availability and wellbeing days.',
                checklist: ['Draft policy updates', 'Collect feedback from managers', 'Publish to employee hub']
              })
          }
        ]
      default:
        return [
          { label: 'Press Enter ×3 for Quick Add', action: () => openQuickAction('task') },
          {
            label: 'Review Priority Tasks',
            action: () =>
              setInsight({
                title: 'Priority pacing',
                description: 'Tackle overdue tasks first, then work through the fresh queue.',
                checklist: ['Filter by due date', 'Delegate blockers', 'Celebrate wins in weekly recap']
              })
          },
          {
            label: 'Share Weekly Report',
            action: () =>
              setInsight({
                title: 'Weekly report template',
                description: 'Summarize top metrics, pipeline health, and staffing insights.',
                checklist: ['Highlight top 3 wins', 'Call out at-risk deals', 'List staffing actions for next week']
              })
          }
        ]
    }
  }, [activeSection.id, goToSection, handleAddExpenseCategory, handleUpdateLeaveStatus, openQuickAction, requests])

  const closeQuickAction = useCallback(() => {
    setQuickAction(null)
  }, [])

  useEffect(() => {
    if (!isAuthenticated || hasCompletedOnboarding || onboardingSteps.length === 0) {
      return
    }
    goToSection(onboardingSteps[0].section)
  }, [goToSection, hasCompletedOnboarding, isAuthenticated, onboardingSteps])

  if (!isAuthenticated) {
    return (
      <AuthScreen
        mode={authMode}
        onSwitchMode={setAuthMode}
        onAuthenticate={handleAuthenticate}
        onContinueAsGuest={handleContinueAsGuest}
      />
    )
  }

  const showOnboarding = !hasCompletedOnboarding && onboardingSteps.length > 0

  return (
    <div className="app-shell">
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onNotificationsClick={() => setIsDrawerOpen(true)}
      />
      <div className="main-content" role="main">
        <TopBar
          activeSection={activeSection}
          onOpenNotifications={() => setIsDrawerOpen(true)}
          userName={currentUser.name}
          onShowHelp={handleShowHelp}
          onResetTour={handleResetTour}
          onSignOut={handleSignOut}
        />
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
          <ContextPanel section={activeSection} shortcuts={contextShortcuts} insight={insight} onDismissInsight={handleDismissInsight} />
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
      {showOnboarding && (
        <OnboardingGuide
          steps={onboardingSteps}
          onNavigate={goToSection}
          onComplete={handleCompleteOnboarding}
          onSkip={handleSkipOnboarding}
        />
      )}
    </div>
  )
}

