import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

const AdminLoans = () => {
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);
  const [actionLoan, setActionLoan] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [approveForm, setApproveForm] = useState({ approved_amount: "", interest_rate: "15", term_months: "12" });
  const [rejectReason, setRejectReason] = useState("");

  const [allLoans, setAllLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingLoans = async () => {
    try {
      const res = await api.get("/loans/pending");
      setAllLoans(res.data.loans || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLoans();
  }, [forceUpdate]);

  const statusColor: Record<string, string> = {
    pending: "bg-gold/10 text-gold",
    approved: "bg-accent/10 text-accent",
    active: "bg-accent/10 text-accent",
    rejected: "bg-destructive/10 text-destructive",
    paid: "bg-primary/10 text-primary",
  };

  const handleApprove = async () => {
    try {
      await api.put(`/loans/approve/${actionLoan.id}`, { 
        approved_amount: Number(approveForm.approved_amount), 
        interest_rate: Number(approveForm.interest_rate), 
        term_months: Number(approveForm.term_months) 
      });
      toast.success("Loan approved!");
      setActionType(null);
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleReject = async () => {
    try {
      await api.put(`/loans/reject/${actionLoan.id}`, { reason: rejectReason });
      toast.success("Loan rejected");
      setActionType(null);
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Loan Administration</h1>
          <p className="text-muted-foreground">Review and manage loan applications</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allLoans.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No loans</TableCell></TableRow>
                ) : allLoans.map((loan, i) => (
                  <TableRow key={loan.id || i}>
                    <TableCell className="font-medium">{loan.user_name || loan.full_name || loan.email || "—"}</TableCell>
                    <TableCell>{Number(loan.amount).toLocaleString()} RWF</TableCell>
                    <TableCell>{loan.purpose || "—"}</TableCell>
                    <TableCell>{loan.term_months}mo</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[loan.status] || ""}>{loan.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {loan.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-accent" onClick={() => { setActionLoan(loan); setActionType("approve"); setApproveForm({ approved_amount: String(loan.amount), interest_rate: "15", term_months: String(loan.term_months) }); }}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => { setActionLoan(loan); setActionType("reject"); setRejectReason(""); }}>
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={actionType === "approve"} onOpenChange={(o) => !o && setActionType(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Approve Loan</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Approved Amount</Label><Input type="number" value={approveForm.approved_amount} onChange={(e) => setApproveForm(p => ({...p, approved_amount: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Interest Rate (%)</Label><Input type="number" value={approveForm.interest_rate} onChange={(e) => setApproveForm(p => ({...p, interest_rate: e.target.value}))} /></div>
              <div className="space-y-2"><Label>Term (months)</Label><Input type="number" value={approveForm.term_months} onChange={(e) => setApproveForm(p => ({...p, term_months: e.target.value}))} /></div>
              <Button onClick={handleApprove} className="w-full bg-gradient-accent text-primary-foreground">Approve Loan</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={actionType === "reject"} onOpenChange={(o) => !o && setActionType(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Reject Loan</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Reason</Label><Input placeholder="Insufficient credit history" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></div>
              <Button onClick={handleReject} variant="destructive" className="w-full">Reject Loan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
};

export default AdminLoans;
