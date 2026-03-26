import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PortalLayout from "@/components/portal/PortalLayout";

const AUDIT_LOGS = [
  { id: "a1", user: "Jean Baptiste Mugabo", action: "Approved Loan", target: "Loan #loan-003", ip: "192.168.1.45", created_at: "2025-03-10T14:30:00Z" },
  { id: "a2", user: "Jean Baptiste Mugabo", action: "Rejected Loan", target: "Loan #loan-004", ip: "192.168.1.45", created_at: "2025-03-10T14:25:00Z" },
  { id: "a3", user: "Jean Baptiste Mugabo", action: "Reversed Transaction", target: "TX #tx-007", ip: "192.168.1.45", created_at: "2025-03-09T10:15:00Z" },
  { id: "a4", user: "Jean Baptiste Mugabo", action: "Updated Member", target: "User #user-005", ip: "192.168.1.45", created_at: "2025-03-08T16:00:00Z" },
  { id: "a5", user: "Jean Baptiste Mugabo", action: "Created Branch", target: "Branch: Kigali Main", ip: "10.0.0.1", created_at: "2025-03-07T09:30:00Z" },
  { id: "a6", user: "Jean Baptiste Mugabo", action: "Exported Report", target: "Members CSV", ip: "10.0.0.1", created_at: "2025-03-06T11:00:00Z" },
  { id: "a7", user: "Jean Baptiste Mugabo", action: "Resolved Fraud Alert", target: "Alert #f2", ip: "192.168.1.45", created_at: "2025-03-05T13:45:00Z" },
  { id: "a8", user: "Jean Baptiste Mugabo", action: "Approved Loan", target: "Loan #loan-001", ip: "10.0.0.1", created_at: "2025-03-04T08:20:00Z" },
];

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
  const logs = filter === "All" ? AUDIT_LOGS : AUDIT_LOGS.filter(l => l.action === filter);

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
                  {logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-foreground">{log.user}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={actionColor[log.action] || ""}>{log.action}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.target}</TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">{log.ip}</TableCell>
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
