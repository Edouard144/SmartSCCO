import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Plus, Trash2, Play, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";

interface ScheduledTransfer {
  id: string;
  recipient: string;
  amount: number;
  description: string;
  frequency: string;
  nextDate: string;
  active: boolean;
}

const INITIAL_TRANSFERS: ScheduledTransfer[] = [
  { id: "st-1", recipient: "demo@smartscco.com", amount: 50000, description: "Monthly rent payment", frequency: "monthly", nextDate: "2025-04-01", active: true },
  { id: "st-2", recipient: "alice@example.com", amount: 15000, description: "Weekly savings contribution", frequency: "weekly", nextDate: "2025-03-14", active: true },
  { id: "st-3", recipient: "eric@example.com", amount: 100000, description: "Business payment", frequency: "monthly", nextDate: "2025-04-05", active: false },
];

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const ScheduledTransfersPage = () => {
  const [transfers, setTransfers] = useState<ScheduledTransfer[]>(INITIAL_TRANSFERS);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ recipient: "", amount: "", description: "", frequency: "monthly", startDate: "" });

  const handleCreate = () => {
    if (!form.recipient || !form.amount || !form.startDate) {
      toast.error("Please fill all required fields");
      return;
    }
    const newTransfer: ScheduledTransfer = {
      id: `st-${Date.now()}`,
      recipient: form.recipient,
      amount: Number(form.amount),
      description: form.description,
      frequency: form.frequency,
      nextDate: form.startDate,
      active: true,
    };
    setTransfers(prev => [newTransfer, ...prev]);
    toast.success("Scheduled transfer created!");
    setOpenDialog(false);
    setForm({ recipient: "", amount: "", description: "", frequency: "monthly", startDate: "" });
  };

  const toggleActive = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
    toast.success("Schedule updated");
  };

  const removeTransfer = (id: string) => {
    setTransfers(prev => prev.filter(t => t.id !== id));
    toast.success("Scheduled transfer removed");
  };

  const activeCount = transfers.filter(t => t.active).length;
  const totalMonthly = transfers.filter(t => t.active).reduce((sum, t) => {
    const multiplier = t.frequency === "daily" ? 30 : t.frequency === "weekly" ? 4 : t.frequency === "biweekly" ? 2 : t.frequency === "quarterly" ? 0.33 : 1;
    return sum + t.amount * multiplier;
  }, 0);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Scheduled Transfers</h1>
            <p className="text-muted-foreground">Set up recurring payments</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" /> New Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Create Scheduled Transfer</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Recipient Email</Label>
                  <Input placeholder="recipient@example.com" value={form.recipient} onChange={(e) => setForm(p => ({ ...p, recipient: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Amount (RWF)</Label>
                  <Input type="number" placeholder="50000" value={form.amount} onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Monthly rent" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={form.frequency} onValueChange={(v) => setForm(p => ({ ...p, frequency: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map(f => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm(p => ({ ...p, startDate: e.target.value }))} />
                </div>
                <Button onClick={handleCreate} className="w-full bg-gradient-accent text-primary-foreground">Create Schedule</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Active Schedules</p>
                <p className="font-display text-3xl font-bold text-foreground mt-1">{activeCount}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Est. Monthly Outflow</p>
                <p className="font-display text-3xl font-bold text-foreground mt-1">{Math.round(totalMonthly).toLocaleString()} RWF</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Schedules list */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Your Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            {transfers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No scheduled transfers yet</p>
            ) : (
              <div className="space-y-3">
                {transfers.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className={`flex items-center justify-between rounded-lg border border-border p-4 transition-opacity ${!t.active ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <CalendarClock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.description || `Transfer to ${t.recipient}`}</p>
                        <p className="text-xs text-muted-foreground">{t.recipient} · <span className="capitalize">{t.frequency}</span></p>
                        <p className="text-xs text-muted-foreground">Next: {new Date(t.nextDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{t.amount.toLocaleString()} RWF</p>
                        <Badge variant={t.active ? "default" : "secondary"} className="text-xs">
                          {t.active ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Switch checked={t.active} onCheckedChange={() => toggleActive(t.id)} />
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeTransfer(t.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default ScheduledTransfersPage;
