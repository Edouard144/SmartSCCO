import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Edit, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  memberCount: number;
  created_at: string;
}

const INITIAL_BRANCHES: Branch[] = [
  { id: "b1", name: "Kigali Main", location: "KN 4 Ave, Kigali", manager: "Jean Baptiste Mugabo", memberCount: 245, created_at: "2024-01-15T08:00:00Z" },
  { id: "b2", name: "Huye Branch", location: "Huye District", manager: "Alice Mukamana", memberCount: 128, created_at: "2024-06-20T10:00:00Z" },
  { id: "b3", name: "Musanze Branch", location: "Musanze District", manager: "Eric Habimana", memberCount: 97, created_at: "2024-09-10T09:00:00Z" },
];

const AdminBranchesPage = () => {
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", manager: "" });

  const handleCreate = () => {
    if (!form.name || !form.location) { toast.error("Fill in all fields"); return; }
    setBranches(prev => [...prev, {
      id: `b-${Date.now()}`, ...form, memberCount: 0, created_at: new Date().toISOString()
    }]);
    toast.success("Branch created!");
    setDialogOpen(false);
    setForm({ name: "", location: "", manager: "" });
  };

  const handleDelete = (id: string) => {
    setBranches(prev => prev.filter(b => b.id !== id));
    toast.success("Branch deleted");
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Branch Management</h1>
            <p className="text-muted-foreground">{branches.length} branches registered</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" /> Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create New Branch</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Branch Name</Label><Input placeholder="e.g. Rubavu Branch" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Location</Label><Input placeholder="e.g. Rubavu District" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Manager</Label><Input placeholder="Branch manager name" value={form.manager} onChange={e => setForm(p => ({ ...p, manager: e.target.value }))} /></div>
                <Button onClick={handleCreate} className="w-full bg-gradient-accent text-primary-foreground">Create Branch</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch, i) => (
            <motion.div key={branch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle className="font-display text-base">{branch.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => handleDelete(branch.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">{branch.location}</p>
                  <p className="text-sm"><span className="text-muted-foreground">Manager:</span> <span className="text-foreground font-medium">{branch.manager || "—"}</span></p>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium">{branch.memberCount}</span>
                    <span className="text-muted-foreground">members</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Created {new Date(branch.created_at).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminBranchesPage;
