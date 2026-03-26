import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PortalLayout from "@/components/portal/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

const statusColor: Record<string, string> = {
  active: "bg-accent/10 text-accent border-accent/20",
  approved: "bg-accent/10 text-accent border-accent/20",
  pending: "bg-gold/10 text-gold border-gold/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  paid: "bg-primary/10 text-primary border-primary/20",
};

const LoansPage = () => {
  const { user } = useAuth();
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);
  const [applyOpen, setApplyOpen] = useState(false);
  const [repayOpen, setRepayOpen] = useState<string | null>(null);
  const [form, setForm] = useState({ amount: "", purpose: "", term_months: "12" });
  const [repayAmount, setRepayAmount] = useState("");

  const [loans, setLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLoans = async () => {
    try {
      const res = await api.get("/loans/my-loans");
      setLoans(res.data.loans || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLoans();
  }, [user, forceUpdate]);

  const handleApply = async () => {
    try {
      await api.post("/loans/apply", { amount: Number(form.amount), duration_months: Number(form.term_months) });
      toast.success("Loan application submitted!");
      setApplyOpen(false);
      setForm({ amount: "", purpose: "", term_months: "12" });
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleRepay = async (loanId: string) => {
    try {
      await api.post(`/loans/repay/${loanId}`, { amount: Number(repayAmount) });
      toast.success("Repayment successful!");
      setRepayOpen(null);
      setRepayAmount("");
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Loans</h1>
            <p className="text-muted-foreground">Manage your loan applications</p>
          </div>
          <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" /> Apply for Loan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Loan Application</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Amount (RWF)</Label><Input type="number" placeholder="100000" value={form.amount} onChange={(e) => setForm(p => ({...p, amount: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Purpose</Label><Input placeholder="Business expansion" value={form.purpose} onChange={(e) => setForm(p => ({...p, purpose: e.target.value}))} /></div>
                <div className="space-y-2"><Label>Term (months)</Label><Input type="number" placeholder="12" value={form.term_months} onChange={(e) => setForm(p => ({...p, term_months: e.target.value}))} /></div>
                <Button onClick={handleApply} className="w-full bg-gradient-accent text-primary-foreground">Submit Application</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loans.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No loans yet. Apply for your first loan!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {loans.map((loan, i) => (
              <motion.div key={loan.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">{loan.purpose || "Loan"}</CardTitle>
                    <Badge variant="outline" className={statusColor[loan.status] || ""}>{loan.status}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-semibold text-foreground">{Number(loan.amount).toLocaleString()} RWF</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Term</span>
                      <span className="text-foreground">{loan.term_months} months</span>
                    </div>
                    {loan.interest_rate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Interest Rate</span>
                        <span className="text-foreground">{loan.interest_rate}%</span>
                      </div>
                    )}
                    {(loan.status === "active" || loan.status === "approved") && (
                      <Dialog open={repayOpen === loan.id} onOpenChange={(o) => setRepayOpen(o ? loan.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full mt-2">Make Repayment</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Loan Repayment</DialogTitle></DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2"><Label>Amount (RWF)</Label><Input type="number" placeholder="25000" value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} /></div>
                            <Button onClick={() => handleRepay(loan.id)} className="w-full bg-gradient-accent text-primary-foreground">Pay</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default LoansPage;
