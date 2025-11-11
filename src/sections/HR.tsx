import { useMemo, useState } from 'react'
import { ResponsiveContainer, RadialBar, RadialBarChart, Tooltip } from 'recharts'
import type { LeaveRequestItem, TeamMember } from '../types'
import { attendanceSummary } from '../data/mockData'

interface HRProps {
  directory: TeamMember[]
  leaveRequests: LeaveRequestItem[]
  onAddMember: (member: Omit<TeamMember, 'id'>) => void
  onUpdateMemberStatus: (id: string, status: TeamMember['status']) => void
  onUpdateLeaveStatus: (id: string, status: LeaveRequestItem['status']) => void
}

const statusOptions: TeamMember['status'][] = ['Online', 'In Meeting', 'Available', 'Offline']

export function HR({ directory, leaveRequests, onAddMember, onUpdateMemberStatus, onUpdateLeaveStatus }: HRProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [newMember, setNewMember] = useState({ name: '', role: '', location: '', status: 'Available' as TeamMember['status'] })

  const filteredDirectory = useMemo(
    () =>
      directory.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.role.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [directory, searchTerm]
  )

  const handleMemberSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newMember.name || !newMember.role) return
    onAddMember({ ...newMember })
    setNewMember({ name: '', role: '', location: '', status: 'Available' })
  }

  return (
    <section className="module" aria-label="Human Resources workspace">
      <div className="module__grid">
        <div className="module__column">
          <section className="panel">
            <header className="panel__header">
              <h2>Team Directory</h2>
              <p>Search and connect with your colleagues.</p>
            </header>
            <div className="directory-controls">
              <input
                type="search"
                placeholder="Search by name or role"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search team members"
              />
            </div>
            <ul className="directory-list">
              {filteredDirectory.map((person) => (
                <li key={person.id}>
                  <div>
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <p className="directory-list__meta">{person.location}</p>
                  </div>
                  <select
                    className={`status-dot status-dot--${person.status.toLowerCase().replace(/\s/g, '-')}`}
                    value={person.status}
                    onChange={(event) => onUpdateMemberStatus(person.id, event.target.value as TeamMember['status'])}
                    aria-label={`Update presence status for ${person.name}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="ghost-btn ghost-btn--small">Message</button>
                </li>
              ))}
              {filteredDirectory.length === 0 && <li className="directory-list__empty">No matching teammates.</li>}
            </ul>
            <form className="directory-form" onSubmit={handleMemberSubmit} aria-label="Add new team member">
              <div className="directory-form__grid">
                <input
                  placeholder="Full name"
                  value={newMember.name}
                  onChange={(event) => setNewMember((prev) => ({ ...prev, name: event.target.value }))}
                  required
                />
                <input
                  placeholder="Role"
                  value={newMember.role}
                  onChange={(event) => setNewMember((prev) => ({ ...prev, role: event.target.value }))}
                  required
                />
                <input
                  placeholder="Location"
                  value={newMember.location}
                  onChange={(event) => setNewMember((prev) => ({ ...prev, location: event.target.value }))}
                />
                <select
                  value={newMember.status}
                  onChange={(event) => setNewMember((prev) => ({ ...prev, status: event.target.value as TeamMember['status'] }))}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="primary-btn">Add teammate</button>
            </form>
          </section>

          <section className="panel">
            <header className="panel__header">
              <h2>Attendance Snapshot</h2>
              <p>Keep a pulse on team reliability.</p>
            </header>
            <div className="chart-container chart-container--compact" role="img" aria-label="Radial chart showing attendance split">
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart
                  innerRadius="40%"
                  outerRadius="100%"
                  data={attendanceSummary.map((item) => ({ ...item, fill: item.label === 'On Time' ? '#22c55e' : item.label === 'Late' ? '#f97316' : '#ef4444' }))}
                >
                  <RadialBar background dataKey="value" cornerRadius={12} />
                  <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="module__column">
          <section className="panel panel--table">
            <header className="panel__header">
              <h2>Leave Requests</h2>
              <p>Respond quickly with context-aware suggestions.</p>
            </header>
            <table className="data-table">
              <caption className="visually-hidden">Pending leave requests</caption>
              <thead>
                <tr>
                  <th scope="col">Employee</th>
                  <th scope="col">Type</th>
                  <th scope="col">Dates</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.employee}</td>
                    <td>{request.type}</td>
                    <td>{request.dates}</td>
                    <td>
                      <span className={`tag tag--${request.status.toLowerCase()}`}>{request.status}</span>
                    </td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="ghost-btn ghost-btn--pill"
                        onClick={() => onUpdateLeaveStatus(request.id, 'Approved')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="ghost-btn ghost-btn--pill"
                        onClick={() => onUpdateLeaveStatus(request.id, 'Declined')}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="panel panel--accent" aria-live="polite">
            <header className="panel__header">
              <h2>People Insights</h2>
              <p>Recommendations to support your teams.</p>
            </header>
            <ul className="note-list">
              <li>Schedule stay interviews for top performers in Customer Success.</li>
              <li>Launch micro-learning on inclusive leadership next Monday.</li>
              <li>Remind managers to submit Q4 growth conversations by Dec 1.</li>
            </ul>
            <button type="button" className="primary-btn">Open People Dashboard</button>
          </section>
        </div>
      </div>
    </section>
  )
}

