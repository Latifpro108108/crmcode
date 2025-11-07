import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { RiCheckboxCircleLine, RiDeleteBinLine, RiPlayLine } from 'react-icons/ri'
import type { RevenuePoint, TaskItem } from '../types'
import { formatDate, getDueLabel } from '../utils/formatters'

interface DashboardProps {
  widgets: typeof import('../data/mockData').dashboardWidgets
  tasks: TaskItem[]
  activities: typeof import('../data/mockData').recentActivities
  onAddTask: (payload: Omit<TaskItem, 'id' | 'status'> & { status?: TaskItem['status'] }) => void
  onDeleteTask: (id: string) => void
  onUpdateTask: (id: string, updates: Partial<TaskItem>) => void
  revenueTrend: RevenuePoint[]
}

export function Dashboard({ widgets: initialWidgets, tasks, activities, onAddTask, onDeleteTask, onUpdateTask, revenueTrend }: DashboardProps) {
  const [widgets, setWidgets] = useState(initialWidgets)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDue, setNewTaskDue] = useState('')

  const openTasks = useMemo(() => tasks.filter((task) => task.status !== 'done'), [tasks])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const updated = Array.from(widgets)
    const [removed] = updated.splice(result.source.index, 1)
    updated.splice(result.destination.index, 0, removed)
    setWidgets(updated)
  }

  const handleTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newTaskTitle.trim()) return
    const dueDate = newTaskDue ? new Date(newTaskDue).toISOString() : new Date(Date.now() + 60 * 60 * 1000).toISOString()
    onAddTask({ title: newTaskTitle.trim(), owner: 'You', due: dueDate })
    setNewTaskTitle('')
    setNewTaskDue('')
  }

  return (
    <section className="module" aria-label="Organization overview">
      <div className="module__grid">
        <div className="module__column">
          <section className="panel">
            <header className="panel__header">
              <h2>Priority Metrics</h2>
              <p>Drag cards to personalize your dashboard.</p>
            </header>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="dashboard-widgets">
                {(provided) => (
                  <ul className="widget-list" ref={provided.innerRef} {...provided.droppableProps}>
                    {widgets.map((widget, index) => (
                      <Draggable key={widget.id} draggableId={widget.id} index={index}>
                        {(dragProvided, snapshot) => (
                          <li
                            className={`widget-card ${snapshot.isDragging ? 'widget-card--dragging' : ''}`}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            aria-roledescription="Draggable metric card"
                          >
                            <div className="widget-card__content">
                              <h3>{widget.title}</h3>
                              <p className="widget-card__metric">{widget.metric}</p>
                              <span className="widget-card__change">{widget.change}</span>
                              <p className="widget-card__description">{widget.description}</p>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </section>

          <section className="panel">
            <header className="panel__header">
              <h2>Revenue Momentum</h2>
              <p>Quarter-to-date booked vs target (USD, thousands).</p>
            </header>
            <div className="chart-container" role="img" aria-label="Area chart showing revenue momentum against targets">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(37, 99, 235, 0.15)" />
                  <XAxis dataKey="month" dy={6} tickLine={false} axisLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}k`, 'Booked']} />
                  <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} fillOpacity={0} name="Target" />
                  <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} fill="url(#colorActual)" name="Booked" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel">
            <header className="panel__header">
              <h2>Recent Activity</h2>
              <p>Updates from teams you follow.</p>
            </header>
            <ul className="timeline">
              {activities.map((activity) => (
                <li key={activity.id} className="timeline__item">
                  <h3>{activity.title}</h3>
                  <p>{activity.owner}</p>
                  <time dateTime={activity.time}>{activity.time}</time>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="module__column">
          <section className="panel">
            <header className="panel__header">
              <h2>Urgent Tasks</h2>
              <p>Focus on these action items today.</p>
            </header>
            <form className="task-form" onSubmit={handleTaskSubmit} aria-label="Add new task">
              <div className="task-form__fields">
                <input
                  type="text"
                  placeholder="Quick add task (press Enter ×3 for shortcut)"
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                  aria-label="Task title"
                />
                <input
                  type="datetime-local"
                  value={newTaskDue}
                  onChange={(event) => setNewTaskDue(event.target.value)}
                  aria-label="Task due date"
                />
                <button type="submit" className="primary-btn">Add</button>
              </div>
            </form>
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task ${task.status === 'done' ? 'task--done' : ''}`}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.owner}</p>
                    <time dateTime={task.due}>{formatDate(task.due)}</time>
                    <span className="task__badge">{getDueLabel(task.due)}</span>
                  </div>
                  <div className="task__actions">
                    <button
                      type="button"
                      className="ghost-btn ghost-btn--pill"
                      onClick={() => onUpdateTask(task.id, { status: task.status === 'done' ? 'open' : 'done' })}
                    >
                      {task.status === 'done' ? (
                        <>
                          <RiPlayLine aria-hidden />
                          Reopen
                        </>
                      ) : (
                        <>
                          <RiCheckboxCircleLine aria-hidden />
                          Complete
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="ghost-btn ghost-btn--pill task__delete"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      <RiDeleteBinLine aria-hidden />
                      Remove
                    </button>
                  </div>
                </li>
              ))}
              {tasks.length === 0 && (
                <li className="task task--empty">All clear! No open tasks.</li>
              )}
            </ul>
            <p className="task__hint" aria-live="polite">
              {openTasks.length > 0
                ? `${openTasks.length} open ${openTasks.length === 1 ? 'task' : 'tasks'} awaiting attention.`
                : 'Nothing urgent right now. Great job staying ahead!'}
            </p>
          </section>

          <section className="panel panel--accent" aria-live="polite">
            <header className="panel__header">
              <h2>Wellbeing Spotlight</h2>
              <p>Balanced teams perform better. Check-ins recommended.</p>
            </header>
            <p>
              Last wellbeing pulse response: <strong>78/100</strong>. Three employees noted workload concerns.
              Schedule quick syncs with their managers this week.
            </p>
            <button type="button" className="primary-btn">Arrange check-ins</button>
          </section>
        </div>
      </div>
    </section>
  )
}

