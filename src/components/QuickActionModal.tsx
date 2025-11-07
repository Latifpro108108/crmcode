import { useEffect, useMemo, useState } from 'react'
import type { InvoiceItem, LeadItem, QuickActionType, TaskItem } from '../types'

interface QuickActionModalProps {
  isOpen: boolean
  type: QuickActionType
  onClose: () => void
  onCreateTask: (payload: Omit<TaskItem, 'id' | 'status'> & { status?: TaskItem['status'] }) => void
  onCreateLead: (payload: Omit<LeadItem, 'id'>) => void
  onCreateInvoice: (payload: Omit<InvoiceItem, 'id' | 'status'> & { status?: InvoiceItem['status'] }) => void
}

const leadStages: LeadItem['stage'][] = ['prospect', 'qualified', 'proposal', 'negotiation', 'won']

export function QuickActionModal({ isOpen, type, onClose, onCreateTask, onCreateLead, onCreateInvoice }: QuickActionModalProps) {
  const [taskForm, setTaskForm] = useState({ title: '', owner: 'You', due: '' })
  const [leadForm, setLeadForm] = useState({ company: '', owner: '', stage: leadStages[0], value: 45000, confidence: 40 })
  const [invoiceForm, setInvoiceForm] = useState({ client: '', amount: 0, dueDate: '', status: 'Pending' as InvoiceItem['status'] })

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    setTaskForm({ title: '', owner: 'You', due: '' })
    setLeadForm({ company: '', owner: '', stage: leadStages[0], value: 45000, confidence: 40 })
    setInvoiceForm({ client: '', amount: 0, dueDate: '', status: 'Pending' })
  }, [isOpen, type])

  const heading = useMemo(() => {
    switch (type) {
      case 'lead':
        return 'Quick add lead'
      case 'invoice':
        return 'Log invoice reminder'
      default:
        return 'Capture quick task'
    }
  }, [type])

  if (!isOpen) return null

  const handleTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!taskForm.title) return
    onCreateTask({ title: taskForm.title, owner: taskForm.owner, due: taskForm.due || new Date().toISOString() })
  }

  const handleLeadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!leadForm.company || !leadForm.owner) return
    onCreateLead({
      company: leadForm.company,
      owner: leadForm.owner,
      stage: leadForm.stage,
      value: Number(leadForm.value),
      lastContact: new Date().toISOString().split('T')[0],
      confidence: Number(leadForm.confidence)
    })
  }

  const handleInvoiceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!invoiceForm.client || !invoiceForm.amount || !invoiceForm.dueDate) return
    onCreateInvoice({
      client: invoiceForm.client,
      amount: Number(invoiceForm.amount),
      dueDate: invoiceForm.dueDate,
      status: invoiceForm.status
    })
  }

  return (
    <div className="quick-action" role="dialog" aria-modal="true" aria-labelledby="quick-action-title">
      <div className="quick-action__overlay" aria-hidden onClick={onClose} />
      <div className="quick-action__panel">
        <header className="quick-action__header">
          <div>
            <h2 id="quick-action-title">{heading}</h2>
            <p>Press Esc to close. Triggered by triple tapping Enter for fluid workflows.</p>
          </div>
          <button type="button" className="ghost-btn ghost-btn--small" onClick={onClose}>
            Close
          </button>
        </header>
        {type === 'task' && (
          <form className="quick-action__form" onSubmit={handleTaskSubmit}>
            <label>
              Task title
              <input
                autoFocus
                value={taskForm.title}
                onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Follow up with enterprise lead"
                required
              />
            </label>
            <label>
              Owner
              <input
                value={taskForm.owner}
                onChange={(event) => setTaskForm((prev) => ({ ...prev, owner: event.target.value }))}
              />
            </label>
            <label>
              Due by
              <input
                type="datetime-local"
                value={taskForm.due}
                onChange={(event) => setTaskForm((prev) => ({ ...prev, due: event.target.value }))}
              />
            </label>
            <button type="submit" className="primary-btn">Add task</button>
          </form>
        )}

        {type === 'lead' && (
          <form className="quick-action__form" onSubmit={handleLeadSubmit}>
            <label>
              Company
              <input
                autoFocus
                value={leadForm.company}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, company: event.target.value }))}
                placeholder="Acme Health"
                required
              />
            </label>
            <label>
              Owner
              <input
                value={leadForm.owner}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, owner: event.target.value }))}
                placeholder="Account executive"
                required
              />
            </label>
            <label>
              Stage
              <select value={leadForm.stage} onChange={(event) => setLeadForm((prev) => ({ ...prev, stage: event.target.value as LeadItem['stage'] }))}>
                {leadStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Deal value (USD)
              <input
                type="number"
                value={leadForm.value}
                step={1000}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, value: Number(event.target.value) }))}
              />
            </label>
            <label>
              Confidence %
              <input
                type="number"
                min={0}
                max={100}
                value={leadForm.confidence}
                onChange={(event) => setLeadForm((prev) => ({ ...prev, confidence: Number(event.target.value) }))}
              />
            </label>
            <button type="submit" className="primary-btn">Add lead</button>
          </form>
        )}

        {type === 'invoice' && (
          <form className="quick-action__form" onSubmit={handleInvoiceSubmit}>
            <label>
              Client
              <input
                autoFocus
                value={invoiceForm.client}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, client: event.target.value }))}
                required
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                value={invoiceForm.amount}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, amount: Number(event.target.value) }))}
                required
              />
            </label>
            <label>
              Due date
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, dueDate: event.target.value }))}
                required
              />
            </label>
            <label>
              Status
              <select value={invoiceForm.status} onChange={(event) => setInvoiceForm((prev) => ({ ...prev, status: event.target.value as InvoiceItem['status'] }))}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </label>
            <button type="submit" className="primary-btn">Save invoice</button>
          </form>
        )}
      </div>
    </div>
  )
}

