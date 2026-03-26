import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PortalLayout from "@/components/portal/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const Dashboard = () => {
  const { user } = useAuth();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [balanceRes, txRes, loansRes] = await Promise.all([
          api.get("/wallet/balance"),
          api.get("/wallet/transactions"),
          api.get("/loans/my-loans")
        ]);
        
        setBalance(Number(balanceRes.data.balance) || 0);
        setTransactions(txRes.data.transactions || txRes.data || []);
        setLoans(loansRes.data.loans || loansRes.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const stats = [
    {
      label: "Account Balance",
      value: `${balance.toLocaleString()} RWF`,
      icon: Wallet,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Loans",
      value: loans.filter((l) => l.status === "active" || l.status === "approved").length.toString(),
      icon: CreditCard,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Total Transactions",
      value: transactions.length.toString(),
      icon: TrendingUp,
      color: "bg-gold/10 text-gold",
    },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome back, {user?.full_name ? user.full_name.split(" ")[0] : "User"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's your financial overview</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="shadow-card">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Send Money", icon: ArrowUpRight, href: "/wallet", color: "bg-primary" },
            { label: "Deposit", icon: ArrowDownLeft, href: "/wallet", color: "bg-accent" },
            { label: "Apply Loan", icon: CreditCard, href: "/loans", color: "bg-gold" },
            { label: "Beneficiaries", icon: Users, href: "/beneficiaries", color: "bg-navy-light" },
          ].map((action) => (
            <Link key={action.label} to={action.href}>
              <Button variant="outline" className="w-full justify-start gap-3 h-14 border-border hover:shadow-card-hover transition-shadow">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color} text-primary-foreground`}>
                  <action.icon className="h-4 w-4" />
                </div>
                {action.label}
              </Button>
            </Link>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent Transactions</CardTitle>
            <Link to="/wallet" className="text-sm text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        tx.type === "credit" || tx.type === "deposit" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                      }`}>
                        {tx.type === "credit" || tx.type === "deposit" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.description || tx.type}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      tx.type === "credit" || tx.type === "deposit" ? "text-accent" : "text-destructive"
                    }`}>
                      {tx.type === "credit" || tx.type === "deposit" ? "+" : "-"}{Number(tx.amount).toLocaleString()} RWF
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default Dashboard;
