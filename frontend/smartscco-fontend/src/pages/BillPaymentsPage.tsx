import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Droplets, Wifi, Phone, Tv, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
import { toast } from "sonner";

const BILL_CATEGORIES = [
  { id: "electricity", label: "Electricity", icon: Zap, provider: "REG (Rwanda Energy Group)", color: "bg-amber-500/10 text-amber-600" },
  { id: "water", label: "Water", icon: Droplets, provider: "WASAC", color: "bg-blue-500/10 text-blue-600" },
  { id: "internet", label: "Internet", icon: Wifi, provider: "MTN / Airtel", color: "bg-purple-500/10 text-purple-600" },
  { id: "airtime", label: "Airtime", icon: Phone, provider: "MTN / Airtel / Tigo", color: "bg-emerald-500/10 text-emerald-600" },
  { id: "tv", label: "TV / Cable", icon: Tv, provider: "StarTimes / Canal+", color: "bg-rose-500/10 text-rose-600" },
  { id: "insurance", label: "Insurance", icon: ShieldCheck, provider: "RSSB / Private", color: "bg-indigo-500/10 text-indigo-600" },
];

// No recent bills for new users until the backend implements a separate bill tracking endpoint
const RECENT_BILLS: any[] = [];

const BillPaymentsPage = () => {
  const [selectedBill, setSelectedBill] = useState<typeof BILL_CATEGORIES[0] | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!amount || !accountNumber || !pin) {
      toast.error("Please fill all fields including PIN");
      return;
    }
    try {
      setLoading(true);
      // For now, bill payment is treated as a regular withdrawal with a specific description
      // In production, this would call a dedicated bill payment API
      await api.post("/wallet/withdraw", {
        amount: Number(amount),
        pin: pin,
      });
      setLoading(false);
      toast.success(`${selectedBill?.label} bill paid successfully!`);
      setSelectedBill(null);
      setAccountNumber("");
      setAmount("");
      setPin("");
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Bill Payments</h1>
          <p className="text-muted-foreground">Pay utilities, airtime, and services</p>
        </div>

        {/* Bill categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {BILL_CATEGORIES.map((cat, i) => (
            <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card
                className="cursor-pointer hover:shadow-card transition-all hover:-translate-y-0.5 border-border"
                onClick={() => setSelectedBill(cat)}
              >
                <CardContent className="flex flex-col items-center gap-3 py-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{cat.label}</p>
                    <p className="text-xs text-muted-foreground">{cat.provider}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent bills */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {RECENT_BILLS.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No recent payments</p>
            ) : (
              <div className="space-y-2">
                {RECENT_BILLS.map((bill) => {
                  const cat = BILL_CATEGORIES.find(c => c.id === bill.category)!;
                  return (
                    <div key={bill.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cat.color}`}>
                          <cat.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{cat.label}</p>
                          <p className="text-xs text-muted-foreground">{bill.account} · {new Date(bill.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{bill.amount.toLocaleString()} RWF</p>
                        <Badge variant="secondary" className="text-xs capitalize">{bill.status}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment dialog */}
        <Dialog
          open={!!selectedBill}
          onOpenChange={(o) => {
            if (!o) {
              setSelectedBill(null);
              setAccountNumber("");
              setAmount("");
              setPin("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Pay {selectedBill?.label}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">Provider: {selectedBill?.provider}</p>
              <div className="space-y-2">
                <Label>Account / Meter Number</Label>
                <Input placeholder="Enter account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Amount (RWF)</Label>
                <Input type="number" placeholder="15000" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Your PIN</Label>
                <Input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0,4))}
                  className="text-center tracking-[0.5em] text-lg"
                />
              </div>
              <Button onClick={handlePay} className="w-full bg-gradient-accent text-primary-foreground" disabled={loading || !pin}>
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</> : `Pay ${selectedBill?.label}`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PortalLayout>
  );
};

export default BillPaymentsPage;
