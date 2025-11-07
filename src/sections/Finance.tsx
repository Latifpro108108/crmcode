import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { RiCheckLine, RiSendPlaneLine } from 'react-icons/ri'
import type {
  CashFlowPoint,
  ExpenseCategoryItem,
  ExpenseTrendPoint,
  InvoiceItem
} from '../types'
import { formatCurrency, formatDateOnly, formatPercent } from '../utils/formatters'

interface FinanceProps {
  categories: ExpenseCategoryItem[]
  expenseTrend: ExpenseTrendPoint[]
  cashFlow: CashFlowPoint[]
  invoices: InvoiceItem[]
  onAddExpenseCategory: (label: string, amount: number) => void
  onAddInvoice: (payload: Omit<InvoiceItem, 'id' | 'status'> & { status?: InvoiceItem['status'] }) => void
  onUpdateInvoice: (id: string, updates: Partial<InvoiceItem>) => void
}

const expenseFormDefaults = { label: '', amount: '', description: '' }
const invoiceFormDefaults = { client: '', amount: '', dueDate: '', status: 'Pending' as InvoiceItem['status'] }

export function Finance({
  categories,
  expenseTrend,
  cashFlow,
  invoices,
  onAddExpenseCategory,
  onAddInvoice,
  onUpdateInvoice
}: FinanceProps) {
  const [expenseForm, setExpenseForm] = useState(expenseFormDefaults)
  const [expenseMessage, setExpenseMessage] = useState('')
  const [invoiceForm, setInvoiceForm] = useState(invoiceFormDefaults)

  const totalSpend = useMemo(
    () => categories.reduce((sum, item) => sum + item.amount, 0),
    [categories]
  )

  const handleExpenseSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!expenseForm.label || !expenseForm.amount) {
      setExpenseMessage('Add a label and amount to log the expense.')
      return
    }
    onAddExpenseCategory(expenseForm.label, Number(expenseForm.amount))
    setExpenseMessage('Expense captured for review.')
    setExpenseForm(expenseFormDefaults)
  }

  const handleInvoiceSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!invoiceForm.client || !invoiceForm.amount || !invoiceForm.dueDate) return
    onAddInvoice({
      client: invoiceForm.client,
      amount: Number(invoiceForm.amount),
      dueDate: invoiceForm.dueDate,
      status: invoiceForm.status
    })
    setInvoiceForm(invoiceFormDefaults)
  }

  return (
    <section className="module" aria-label="Finance workspace">
      <div className="module__grid">
        <div className="module__column">
          <section className="panel">
            <header className="panel__header">
              <h2>Record Expense</h2>
              <p>Submit purchases with clear descriptions.</p>
            </header>
            <form className="form" onSubmit={handleExpenseSubmit} aria-describedby="expense-help">
              <div className="form__field">
                <label>Label</label>
                <input
                  value={expenseForm.label}
                  onChange={(event) => setExpenseForm((prev) => ({ ...prev, label: event.target.value }))}
                  placeholder="e.g. Azure spike"
                  required
                />
              </div>
              <div className="form__field">
                <label>Amount</label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(event) => setExpenseForm((prev) => ({ ...prev, amount: event.target.value }))}
                  required
                />
              </div>
              <div className="form__field">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="What was purchased and why?"
                  value={expenseForm.description}
                  onChange={(event) => setExpenseForm((prev) => ({ ...prev, description: event.target.value }))}
                />
              </div>
              {expenseMessage && <p role="status" className="form__message">{expenseMessage}</p>}
              <div className="form__actions">
                <button type="submit" className="primary-btn">Log Expense</button>
                <button type="reset" className="ghost-btn" onClick={() => setExpenseForm(expenseFormDefaults)}>
                  Clear
                </button>
              </div>
            </form>
          </section>

          <section className="panel">
            <header className="panel__header">
              <h2>Spending Overview</h2>
              <p>Total spend {formatCurrency(totalSpend)} this quarter.</p>
            </header>
            <div className="chart-container" role="img" aria-label="Area chart showing expense trend">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={expenseTrend}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.18)" />
                  <XAxis dataKey="month" dy={6} axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}k`, 'Spend']} />
                  <Area type="monotone" dataKey="spend" stroke="#f97316" strokeWidth={3} fill="url(#expenseGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ul className="expense-list">
              {categories.map((item) => (
                <li key={item.id}>
                  <h3>{item.label}</h3>
                  <p>{formatCurrency(item.amount)}</p>
                  <span className={`expense-list__trend ${item.trend >= 0 ? 'expense-list__trend--up' : 'expense-list__trend--down'}`}>
                    {formatPercent(item.trend)} vs last month
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="module__column">
          <section className="panel">
            <header className="panel__header">
              <h2>Invoices</h2>
              <p>Download or send friendly reminders.</p>
            </header>
            <form className="invoice-form" onSubmit={handleInvoiceSubmit} aria-label="Add new invoice">
              <div className="invoice-form__grid">
                <label>
                  Client
                  <input
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
                    onChange={(event) => setInvoiceForm((prev) => ({ ...prev, amount: event.target.value }))}
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
                  <select
                    value={invoiceForm.status}
                    onChange={(event) => setInvoiceForm((prev) => ({ ...prev, status: event.target.value as InvoiceItem['status'] }))}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="primary-btn">Add Invoice</button>
            </form>
            <table className="data-table">
              <caption className="visually-hidden">Recent invoices</caption>
              <thead>
                <tr>
                  <th scope="col">Invoice</th>
                  <th scope="col">Client</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Due</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.client}</td>
                    <td>{formatCurrency(invoice.amount)}</td>
                    <td>{formatDateOnly(invoice.dueDate)}</td>
                    <td>
                      <span className={`tag tag--${invoice.status.toLowerCase()}`}>{invoice.status}</span>
                    </td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="ghost-btn ghost-btn--pill"
                        onClick={() => onUpdateInvoice(invoice.id, { status: 'Paid' })}
                      >
                        <RiCheckLine aria-hidden />
                        Mark paid
                      </button>
                      {invoice.status !== 'Overdue' && (
                        <button
                          type="button"
                          className="ghost-btn ghost-btn--pill"
                          onClick={() => onUpdateInvoice(invoice.id, { status: 'Overdue' })}
                        >
                          <RiSendPlaneLine aria-hidden />
                          Send reminder
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="panel">
            <header className="panel__header">
              <h2>Cash Flow Outlook</h2>
              <p>Compare inflow vs outflow (USD thousands).</p>
            </header>
            <div className="chart-container" role="img" aria-label="Bar chart showing cash flow">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={cashFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(37, 99, 235, 0.15)" />
                  <XAxis dataKey="month" />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${value}k`, 'Cash']} />
                  <Legend verticalAlign="bottom" height={36} />
                  <Bar dataKey="inflow" fill="#2563eb" radius={[12, 12, 0, 0]} name="Inflow" />
                  <Bar dataKey="outflow" fill="#94a3b8" radius={[12, 12, 0, 0]} name="Outflow" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel panel--accent" aria-live="polite">
            <header className="panel__header">
              <h2>Cash Flow Tip</h2>
              <p>System generated advice</p>
            </header>
            <p>
              Average invoice payment time has improved to 12 days. Maintain momentum by scheduling courtesy
              reminders 3 days before due dates.
            </p>
            <button type="button" className="primary-btn">Automate reminders</button>
          </section>
        </div>
      </div>
    </section>
  )
}

