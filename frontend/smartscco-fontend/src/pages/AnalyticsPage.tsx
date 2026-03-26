import { motion } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";
import PortalLayout from "@/components/portal/PortalLayout";
import { TRANSACTION_CATEGORIES } from "@/lib/mockData";

const spendingByCategory = [
  { name: "Savings", value: 500000, color: "hsl(162, 63%, 41%)" },
  { name: "Rent", value: 180000, color: "hsl(0, 84%, 60%)" },
  { name: "Utilities", value: 75000, color: "hsl(221, 83%, 33%)" },
  { name: "Mobile Money", value: 45000, color: "hsl(271, 60%, 50%)" },
  { name: "Food", value: 120000, color: "hsl(340, 70%, 50%)" },
  { name: "Other", value: 60000, color: "hsl(220, 9%, 46%)" },
];

const monthlyData = [
  { month: "Oct", income: 800000, expenses: 450000 },
  { month: "Nov", income: 1200000, expenses: 620000 },
  { month: "Dec", income: 950000, expenses: 780000 },
  { month: "Jan", income: 1100000, expenses: 550000 },
  { month: "Feb", income: 1550000, expenses: 480000 },
  { month: "Mar", income: 500000, expenses: 320000 },
];

const loanRepayment = [
  { month: "Jan", paid: 50000, remaining: 450000 },
  { month: "Feb", paid: 100000, remaining: 400000 },
  { month: "Mar", paid: 150000, remaining: 350000 },
  { month: "Apr", paid: 200000, remaining: 300000 },
  { month: "May", paid: 250000, remaining: 250000 },
];

const totalIncome = monthlyData.reduce((a, b) => a + b.income, 0);
const totalExpenses = monthlyData.reduce((a, b) => a + b.expenses, 0);

const AnalyticsPage = () => (
  <PortalLayout>
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground">Your financial insights at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-accent"><TrendingUp className="h-4 w-4" /><span className="text-sm text-muted-foreground">Total Income (6mo)</span></div>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{totalIncome.toLocaleString()} RWF</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive"><TrendingDown className="h-4 w-4" /><span className="text-sm text-muted-foreground">Total Expenses (6mo)</span></div>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{totalExpenses.toLocaleString()} RWF</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary"><BarChart3 className="h-4 w-4" /><span className="text-sm text-muted-foreground">Net Savings</span></div>
            <p className="font-display text-2xl font-bold text-accent mt-1">+{(totalIncome - totalExpenses).toLocaleString()} RWF</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spending by Category */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-lg">Spending by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {spendingByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} RWF`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income vs Expenses */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-lg">Income vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} RWF`} />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(162, 63%, 41%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Loan Repayment */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-lg">Loan Repayment Progress</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={loanRepayment}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} RWF`} />
                <Legend />
                <Line type="monotone" dataKey="paid" stroke="hsl(162, 63%, 41%)" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="remaining" stroke="hsl(0, 84%, 60%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </PortalLayout>
);

export default AnalyticsPage;
