import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";

import { toast } from "sonner";

const AdminMembers = () => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/members');
      setMembers(res.data.members || res.data || []);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleKyc = async (id: string) => {
    try {
      await api.put(`/admin/kyc/${id}`);
      toast.success("KYC Approved");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Action failed");
    }
  };

  const toggleSuspend = async (id: string, isSuspended: boolean) => {
    try {
      if (isSuspended) await api.put(`/admin/unsuspend/${id}`);
      else await api.put(`/admin/suspend/${id}`);
      toast.success(isSuspended ? "Member restored" : "Member suspended");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Action failed");
    }
  };

  const filtered = search
    ? members.filter(m =>
        m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase())
      )
    : members;

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Member Management</h1>
            <p className="text-muted-foreground">View and manage all members</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search members..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading members...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No members found</TableCell></TableRow>
                ) : filtered.map((m, i) => (
                  <TableRow key={m.id || i}>
                    <TableCell className="font-medium">{m.full_name}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{m.phone || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={m.status === "active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}>
                        {m.status || "active"}
                      </Badge>
                    </TableCell>
                    <TableCell>{m.created_at ? new Date(m.created_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {!m.kyc_verified && (
                        <button onClick={() => handleKyc(m.id)} className="text-xs text-primary hover:underline">
                          Approve KYC
                        </button>
                      )}
                      <button 
                        onClick={() => toggleSuspend(m.id, m.status === "suspended")} 
                        className={`text-xs hover:underline ${m.status === "suspended" ? "text-emerald" : "text-destructive"}`}
                      >
                        {m.status === "suspended" ? "Restore" : "Suspend"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default AdminMembers;
