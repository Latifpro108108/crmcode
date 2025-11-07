import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { RiDeleteBinLine, RiEditLine } from 'react-icons/ri'
import type { LeadItem, PipelineColumn, RevenuePoint, WinRatePoint } from '../types'
import { formatCurrency, formatDateOnly, formatPercent } from '../utils/formatters'

interface SalesProps {
  leads: LeadItem[]
  columns: PipelineColumn[]
  onAddLead: (lead: Omit<LeadItem, 'id'>) => void
  onUpdateLead: (id: string, updates: Partial<LeadItem>) => void
  onDeleteLead: (id: string) => void
  onMoveLead: (leadId: string, sourceStage: PipelineColumn['id'], targetStage: PipelineColumn['id'], targetIndex: number) => void
  revenueTrend: RevenuePoint[]
  winRate: WinRatePoint[]
}

const stageColors: Record<PipelineColumn['id'], string> = {
  prospect: '#a855f7',
  qualified: '#2563eb',
  proposal: '#f97316',
  negotiation: '#facc15',
  won: '#22c55e'
}

const emptyLeadForm: Omit<LeadItem, 'id'> = {
  company: '',
  owner: '',
  stage: 'prospect',
  value: 50000,
  lastContact: new Date().toISOString().split('T')[0],
  confidence: 40
}

export function Sales({ leads, columns, onAddLead, onUpdateLead, onDeleteLead, onMoveLead, revenueTrend, winRate }: SalesProps) {
  const [formState, setFormState] = useState(emptyLeadForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const leadLookup = useMemo(() => Object.fromEntries(leads.map((lead) => [lead.id, lead])), [leads])

  const pipelineStats = useMemo(
    () =>
      columns.map((column) => ({
        id: column.id,
        title: column.title,
        count: column.leadIds.length,
        value: column.leadIds.reduce((total, leadId) => total + (leadLookup[leadId]?.value ?? 0), 0)
      })),
    [columns, leadLookup]
  )

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const leadId = result.draggableId
    const sourceStage = result.source.droppableId as PipelineColumn['id']
    const targetStage = result.destination.droppableId as PipelineColumn['id']
    if (sourceStage === targetStage && result.source.index === result.destination.index) return
    onMoveLead(leadId, sourceStage, targetStage, result.destination.index)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.company.trim() || !formState.owner.trim()) return
    const payload = {
      ...formState,
      company: formState.company.trim(),
      owner: formState.owner.trim(),
      value: Number(formState.value),
      confidence: Number(formState.confidence)
    }
    if (editingId) {
      onUpdateLead(editingId, payload)
    } else {
      onAddLead(payload)
    }
    setFormState(emptyLeadForm)
    setEditingId(null)
  }

  const handleEdit = (lead: LeadItem) => {
    setFormState({
      company: lead.company,
      owner: lead.owner,
      stage: lead.stage,
      value: lead.value,
      lastContact: lead.lastContact,
      confidence: lead.confidence
    })
    setEditingId(lead.id)
  }

  const cancelEdit = () => {
    setFormState(emptyLeadForm)
    setEditingId(null)
  }

  return (
    <section className="module" aria-label="Sales workspace">
      <div className="module__grid">
        <div className="module__column">
          <section className="panel">
            <header className="panel__header">
              <h2>Pipeline Board</h2>
              <p>Drag and drop to advance opportunities.</p>
            </header>
            <div className="pipeline-board">
              <DragDropContext onDragEnd={handleDragEnd}>
                {columns.map((column) => (
                  <Droppable key={column.id} droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`pipeline-column ${snapshot.isDraggingOver ? 'pipeline-column--active' : ''}`}
                      >
                        <header className="pipeline-column__header" style={{ borderColor: stageColors[column.id] }}>
                          <span>{column.title}</span>
                          <span className="pipeline-column__count">{column.leadIds.length}</span>
                        </header>
                        <p className="pipeline-column__hint">{column.description}</p>
                        <ul className="pipeline-list">
                          {column.leadIds.map((leadId, index) => {
                            const lead = leadLookup[leadId]
                            if (!lead) return null
                            return (
                              <Draggable key={leadId} draggableId={leadId} index={index}>
                                {(dragProvided, dragSnapshot) => (
                                  <li
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    className={`pipeline-card ${dragSnapshot.isDragging ? 'pipeline-card--dragging' : ''}`}
                                  >
                                    <h3>{lead.company}</h3>
                                    <p>{formatCurrency(lead.value)}</p>
                                    <div className="pipeline-card__meta">
                                      <span>{lead.owner}</span>
                                      <span>{lead.confidence}%</span>
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                          {column.leadIds.length === 0 && <li className="pipeline-card pipeline-card--empty">Drop leads here</li>}
                        </ul>
                      </div>
                    )}
                  </Droppable>
                ))}
              </DragDropContext>
            </div>
          </section>

          <section className="panel">
            <header className="panel__header">
              <h2>Lead Registry</h2>
              <p>Maintain data accuracy with inline edits.</p>
            </header>
            <form className="lead-form" onSubmit={handleSubmit} aria-label="Lead details form">
              <div className="lead-form__grid">
                <label>
                  Company
                  <input
                    required
                    value={formState.company}
                    onChange={(event) => setFormState((prev) => ({ ...prev, company: event.target.value }))}
                    placeholder="Acme Health"
                  />
                </label>
                <label>
                  Owner
                  <input
                    required
                    value={formState.owner}
                    onChange={(event) => setFormState((prev) => ({ ...prev, owner: event.target.value }))}
                    placeholder="Account executive"
                  />
                </label>
                <label>
                  Stage
                  <select
                    value={formState.stage}
                    onChange={(event) => setFormState((prev) => ({ ...prev, stage: event.target.value as LeadItem['stage'] }))}
                  >
                    {columns.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Deal Value (USD)
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={formState.value}
                    onChange={(event) => setFormState((prev) => ({ ...prev, value: Number(event.target.value) }))}
                  />
                </label>
                <label>
                  Confidence %
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formState.confidence}
                    onChange={(event) => setFormState((prev) => ({ ...prev, confidence: Number(event.target.value) }))}
                  />
                </label>
                <label>
                  Last Contact
                  <input
                    type="date"
                    value={formState.lastContact}
                    onChange={(event) => setFormState((prev) => ({ ...prev, lastContact: event.target.value }))}
                  />
                </label>
              </div>
              <div className="lead-form__actions">
                <button type="submit" className="primary-btn">{editingId ? 'Save Changes' : 'Add Lead'}</button>
                {editingId && (
                  <button type="button" className="ghost-btn" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <table className="data-table">
              <caption className="visually-hidden">Lead table with edit controls</caption>
              <thead>
                <tr>
                  <th scope="col">Company</th>
                  <th scope="col">Owner</th>
                  <th scope="col">Stage</th>
                  <th scope="col">Value</th>
                  <th scope="col">Contacted</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.company}</td>
                    <td>{lead.owner}</td>
                    <td>
                      <span className={`tag tag--${lead.stage}`}>{columns.find((column) => column.id === lead.stage)?.title ?? lead.stage}</span>
                    </td>
                    <td>{formatCurrency(lead.value)}</td>
                    <td>{formatDateOnly(lead.lastContact)}</td>
                    <td>{lead.confidence}%</td>
                    <td className="table-actions">
                      <button type="button" className="ghost-btn ghost-btn--pill" onClick={() => handleEdit(lead)}>
                        <RiEditLine aria-hidden />
                        Edit
                      </button>
                      <button type="button" className="ghost-btn ghost-btn--pill" onClick={() => onDeleteLead(lead.id)}>
                        <RiDeleteBinLine aria-hidden />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="module__column">
          <section className="panel">
            <header className="panel__header">
              <h2>Performance Analytics</h2>
              <p>Actual revenue vs target, month over month.</p>
            </header>
            <div className="chart-container" role="img" aria-label="Line chart showing revenue actual vs target">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.35)" />
                  <XAxis dataKey="month" dy={6} tickLine={false} axisLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number, key) => [`${value}k`, key === 'actual' ? 'Booked' : 'Target']} />
                  <Legend verticalAlign="bottom" height={36} />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} dot={false} name="Target" />
                  <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} name="Booked" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel">
            <header className="panel__header">
              <h2>Stage Conversion</h2>
              <p>Conversion likelihood from discovery to close.</p>
            </header>
            <div className="chart-container" role="img" aria-label="Bar chart showing win rate per stage">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={winRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                  <XAxis dataKey="stage" tickFormatter={(value) => columns.find((column) => column.id === value)?.title ?? value} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [formatPercent(value), 'Win Chance']} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {winRate.map((item) => (
                      <Cell key={item.stage} fill={stageColors[item.stage]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="pipeline-summary">
              {pipelineStats.map((stage) => (
                <li key={stage.id}>
                  <span className="pipeline-summary__label">{stage.title}</span>
                  <span className="pipeline-summary__value">{stage.count} deals · {formatCurrency(stage.value)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel panel--accent">
            <header className="panel__header">
              <h2>Win Distribution</h2>
              <p>Visualize where the team is most effective.</p>
            </header>
            <div className="chart-container chart-container--compact" role="img" aria-label="Pie chart showing stage distribution">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pipelineStats} dataKey="count" nameKey="title" innerRadius={60} outerRadius={90} paddingAngle={4}>
                    {pipelineStats.map((stage) => (
                      <Cell key={stage.id} fill={stageColors[stage.id]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name) => [`${value} deals`, name]} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

