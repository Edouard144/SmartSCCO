import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PortalLayout from "@/components/portal/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

const BeneficiariesPage = () => {
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);
  const [addOpen, setAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");

  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBeneficiaries = async () => {
    try {
      const res = await api.get("/beneficiaries");
      setBeneficiaries(res.data.beneficiaries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBeneficiaries();
  }, [user, forceUpdate]);

  // Search for users to add as beneficiary
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data.users || []);
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };

  const handleSelectUser = (u: any) => {
    setSelectedUser(u);
    setSearchQuery("");
    setSearchResults([]);
    setNickname(u.full_name);
  };

  const handleAdd = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }
    if (!nickname.trim()) {
      toast.error("Please enter a nickname");
      return;
    }
    try {
      await api.post("/beneficiaries", {
        beneficiary_user_id: selectedUser.id,
        nickname: nickname.trim(),
      });
      toast.success("Beneficiary added!");
      setAddOpen(false);
      setSelectedUser(null);
      setNickname("");
      setSearchQuery("");
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await api.delete(`/beneficiaries/${id}`);
      toast.success("Beneficiary removed");
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
            <h1 className="font-display text-2xl font-bold text-foreground">Beneficiaries</h1>
            <p className="text-muted-foreground">Manage your saved recipients</p>
          </div>
          <Dialog open={addOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-accent text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4 mr-1" /> Add Beneficiary
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Beneficiary</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Search User</Label>
                  <Input
                    placeholder="Search by email, phone, name, or ID"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="border border-border rounded-lg max-h-40 overflow-y-auto">
                    {searchResults.map((u) => (
                      <div
                        key={u.id}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => handleSelectUser(u)}
                      >
                        <p className="text-sm font-medium text-foreground">{u.full_name}</p>
                        <p className="text-xs text-muted-foreground">{u.email} · {u.phone}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected User */}
                {selectedUser && (
                  <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <p className="text-sm font-medium text-foreground">{selectedUser.full_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Nickname</Label>
                  <Input
                    placeholder="e.g. Mom, Boss, etc."
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>

                <Button onClick={handleAdd} className="w-full bg-gradient-accent text-primary-foreground" disabled={!selectedUser}>
                  Add Beneficiary
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {beneficiaries.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No beneficiaries yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {beneficiaries.map((b, i) => (
              <motion.div key={b.id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                  <CardContent className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold uppercase">
                        {(b.nickname || b.full_name)?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{b.nickname || b.full_name}</p>
                        <p className="text-xs text-muted-foreground">{b.email || b.phone || "No contact info"}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(b.beneficiary_id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default BeneficiariesPage;
