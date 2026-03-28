import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
const ACTION_TYPES = ["All", "Approved Loan", "Rejected Loan", "Reversed Transaction", "Updated Member", "Created Branch", "Exported Report", "Resolved Fraud Alert"];

const actionColor: Record<string, string> = {
  "Approved Loan": "bg-accent/10 text-accent",
  "Rejected Loan": "bg-destructive/10 text-destructive",
  "Reversed Transaction": "bg-destructive/10 text-destructive",
  "Updated Member": "bg-primary/10 text-primary",
  "Created Branch": "bg-primary/10 text-primary",
  "Exported Report": "bg-muted text-muted-foreground",
  "Resolved Fraud Alert": "bg-accent/10 text-accent",
};

const AdminAuditPage = () => {
  const [filter, setFilter] = useState("All");
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await api.get('/audit');
        setAllLogs(res.data.logs || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, []);

  const logs = filter === "All" ? allLogs : allLogs.filter(l => l.action === filter);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-muted-foreground">Track all admin actions</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
            <SelectContent>
              {ACTION_TYPES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading audit logs...</TableCell></TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audit logs found</TableCell></TableRow>
                  ) : logs.map((log, i) => (
                    <TableRow key={log.id || i}>
                      <TableCell className="font-medium text-foreground">{log.admin_name || log.admin_id || log.user || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={actionColor[log.action] || ""}>{log.action}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.target}</TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">{log.ip_address || log.ip || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalLayout>
  );
};

export default AdminAuditPage;
