import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

const INITIAL_GOALS: SavingsGoal[] = [
  { id: "sg1", name: "Emergency Fund", targetAmount: 2000000, currentAmount: 1200000, deadline: "2025-12-31" },
  { id: "sg2", name: "New Laptop", targetAmount: 800000, currentAmount: 350000, deadline: "2025-06-30" },
  { id: "sg3", name: "Education Fund", targetAmount: 5000000, currentAmount: 750000, deadline: "2026-09-01" },
];

const SavingsGoalsPage = () => {
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [createOpen, setCreateOpen] = useState(false);
  const [contributeId, setContributeId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", targetAmount: "", deadline: "" });
  const [contributeAmount, setContributeAmount] = useState("");

  const handleCreate = () => {
    if (!form.name || !form.targetAmount) { toast.error("Fill in required fields"); return; }
    setGoals(prev => [...prev, {
      id: `sg-${Date.now()}`, name: form.name, targetAmount: Number(form.targetAmount),
      currentAmount: 0, deadline: form.deadline || "2025-12-31"
    }]);
    toast.success("Savings goal created!");
    setCreateOpen(false);
    setForm({ name: "", targetAmount: "", deadline: "" });
  };

  const handleContribute = () => {
    const amount = Number(contributeAmount);
    if (!amount || amount <= 0) { toast.error("Enter a valid amount"); return; }
    setGoals(prev => prev.map(g => g.id === contributeId
      ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
      : g
    ));
    toast.success(`${amount.toLocaleString()} RWF contributed!`);
    setContributeId(null);
    setContributeAmount("");
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Savings Goals</h1>
            <p className="text-muted-foreground">Track and achieve your financial targets</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" /> New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Savings Goal</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Goal Name</Label><Input placeholder="e.g. New Car" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Target Amount (RWF)</Label><Input type="number" placeholder="1000000" value={form.targetAmount} onChange={e => setForm(p => ({ ...p, targetAmount: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} /></div>
                <Button onClick={handleCreate} className="w-full bg-gradient-accent text-primary-foreground">Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal, i) => {
            const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            return (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Target className={`h-5 w-5 ${pct >= 100 ? "text-accent" : "text-primary"}`} />
                      <CardTitle className="font-display text-base">{goal.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{goal.currentAmount.toLocaleString()} RWF</span>
                      <span className="font-medium text-foreground">{goal.targetAmount.toLocaleString()} RWF</span>
                    </div>
                    <Progress value={pct} className="h-2.5" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{pct}% reached</span>
                      <span className="text-xs text-muted-foreground">Due {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                    {pct < 100 && (
                      <Dialog open={contributeId === goal.id} onOpenChange={o => { if (!o) setContributeId(null); }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="w-full" onClick={() => setContributeId(goal.id)}>
                            <Wallet className="h-3.5 w-3.5 mr-1" /> Contribute
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Contribute to {goal.name}</DialogTitle></DialogHeader>
                          <div className="space-y-4 pt-4">
                            <p className="text-sm text-muted-foreground">Remaining: {(goal.targetAmount - goal.currentAmount).toLocaleString()} RWF</p>
                            <div className="space-y-2"><Label>Amount (RWF)</Label><Input type="number" placeholder="50000" value={contributeAmount} onChange={e => setContributeAmount(e.target.value)} /></div>
                            <Button onClick={handleContribute} className="w-full bg-gradient-accent text-primary-foreground">Contribute</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {pct >= 100 && (
                      <p className="text-center text-sm font-medium text-accent">🎉 Goal reached!</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PortalLayout>
  );
};

export default SavingsGoalsPage;
