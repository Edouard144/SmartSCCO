import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Wallet, CreditCard, Activity, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
import { useEffect } from "react";

const monthlyData = [
  { month: "Jan", deposits: 2400000, withdrawals: 1200000, loans: 800000 },
  { month: "Feb", deposits: 3100000, withdrawals: 1500000, loans: 1200000 },
  { month: "Mar", deposits: 2800000, withdrawals: 1800000, loans: 950000 },
  { month: "Apr", deposits: 3500000, withdrawals: 1400000, loans: 1500000 },
  { month: "May", deposits: 4200000, withdrawals: 2100000, loans: 1800000 },
  { month: "Jun", deposits: 3800000, withdrawals: 1700000, loans: 2200000 },
  { month: "Jul", deposits: 4600000, withdrawals: 2300000, loans: 1900000 },
  { month: "Aug", deposits: 5100000, withdrawals: 2500000, loans: 2500000 },
];

const memberGrowth = [
  { month: "Jan", members: 45 }, { month: "Feb", members: 72 }, { month: "Mar", members: 98 },
  { month: "Apr", members: 134 }, { month: "May", members: 178 }, { month: "Jun", members: 215 },
  { month: "Jul", members: 267 }, { month: "Aug", members: 312 },
];

const loanDistribution = [
  { name: "Business", value: 45 }, { name: "Education", value: 20 },
  { name: "Agriculture", value: 18 }, { name: "Personal", value: 17 },
];

const CHART_COLORS = ["hsl(221, 83%, 33%)", "hsl(162, 63%, 41%)", "hsl(43, 96%, 56%)", "hsl(221, 70%, 45%)"];
const formatCurrency = (v: number) => `${(v / 1000000).toFixed(1)}M`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_members: 0,
    total_deposits: 0,
    total_loans_disbursed: 0,
    open_fraud_alerts: 0
  });
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, txRes] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/transactions")
        ]);
        setStats(statsRes.data.stats || {
          total_members: 0, total_deposits: 0, total_loans_disbursed: 0, open_fraud_alerts: 0
        });
        setRecentTx((txRes.data.transactions || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const statCards = [
    { label: "Total Members", value: stats.total_members, icon: Users, color: "bg-primary/10 text-primary", trend: "" },
    { label: "Total Deposits", value: `${Number(stats.total_deposits).toLocaleString()} RWF`, icon: Wallet, color: "bg-accent/10 text-accent", trend: "" },
    { label: "Loans Disbursed", value: `${Number(stats.total_loans_disbursed).toLocaleString()} RWF`, icon: CreditCard, color: "bg-gold/10 text-gold", trend: "" },
    { label: "Fraud Alerts", value: stats.open_fraud_alerts, icon: Activity, color: "bg-navy-light/10 text-navy-light", trend: "" },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and real-time analytics</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="font-display text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                    <TrendingUp className="h-3 w-3" />{card.trend}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display text-lg">Financial Overview</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="gradDeposits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradWithdrawals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                    <Tooltip formatter={(value: number) => [`${Number(value).toLocaleString()} RWF`]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)", boxShadow: "0 4px 12px rgba(0,0,0,.08)" }} />
                    <Legend />
                    <Area type="monotone" dataKey="deposits" name="Deposits" stroke={CHART_COLORS[1]} fill="url(#gradDeposits)" strokeWidth={2} />
                    <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke={CHART_COLORS[0]} fill="url(#gradWithdrawals)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="shadow-card h-full">
              <CardHeader><CardTitle className="font-display text-lg">Loan Distribution</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={loanDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                      {loanDistribution.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                  {loanDistribution.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="ml-auto font-semibold text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display text-lg">Member Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={memberGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                    <Bar dataKey="members" name="Members" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display text-lg">Loan Volume</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                    <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
                    <Tooltip formatter={(v: number) => [`${Number(v).toLocaleString()} RWF`]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                    <Bar dataKey="loans" name="Loans Disbursed" fill={CHART_COLORS[2]} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-display text-lg">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTx.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        tx.type === "credit" || tx.type === "deposit" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                      }`}>
                        {tx.type === "credit" || tx.type === "deposit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.description || tx.type}</p>
                        <p className="text-xs text-muted-foreground">{tx.user_email} · {new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${tx.type === "credit" || tx.type === "deposit" ? "text-accent" : "text-destructive"}`}>
                      {tx.type === "credit" || tx.type === "deposit" ? "+" : "-"}{Number(tx.amount).toLocaleString()} RWF
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalLayout>
  );
};

export default AdminDashboard;
