import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Edit, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  memberCount: number;
  created_at: string;
}

const AdminBranchesPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", manager: "" });
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const res = await api.get("/branches");
      setBranches(res.data.branches || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.location) { toast.error("Fill in all fields"); return; }
    try {
      await api.post("/branches", form);
      toast.success("Branch created!");
      setDialogOpen(false);
      setForm({ name: "", location: "", manager: "" });
      fetchBranches();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create branch");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/branches/${id}`);
      toast.success("Branch deleted");
      fetchBranches();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete branch");
    }
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

        {loading ? (
          <div className="py-12 text-center text-muted-foreground flex items-center justify-center">
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            Loading branches...
          </div>
        ) : branches.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No branches found.</p>
            </CardContent>
          </Card>
        ) : (
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
                      <span className="font-medium">{branch.memberCount || 0}</span>
                      <span className="text-muted-foreground">members</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Created {new Date(branch.created_at).toLocaleDateString()}</p>
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

export default AdminBranchesPage;
