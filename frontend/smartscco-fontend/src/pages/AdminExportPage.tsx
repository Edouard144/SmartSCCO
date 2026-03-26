import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Users, CreditCard, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortalLayout from "@/components/portal/PortalLayout";
import { MOCK_MEMBERS, MOCK_TRANSACTIONS, MOCK_LOANS } from "@/lib/mockData";
import { toast } from "sonner";

const downloadCSV = (filename: string, headers: string[], rows: string[][]) => {
  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${filename} downloaded`);
};

const exports = [
  {
    title: "Members Report",
    description: "Export all member data including status and registration date",
    icon: Users,
    color: "bg-primary/10 text-primary",
    action: () => downloadCSV("members.csv",
      ["Name", "Email", "Phone", "Status", "Joined"],
      MOCK_MEMBERS.map(m => [m.full_name, m.email, m.phone || "", m.status || "active", m.created_at])
    ),
  },
  {
    title: "Transactions Report",
    description: "Export complete transaction history with categories",
    icon: CreditCard,
    color: "bg-accent/10 text-accent",
    action: () => downloadCSV("transactions.csv",
      ["ID", "Type", "Amount", "Description", "Category", "Status", "Date"],
      MOCK_TRANSACTIONS.map(t => [t.id, t.type, String(t.amount), t.description, t.category, t.status, t.created_at])
    ),
  },
  {
    title: "Loans Report",
    description: "Export loan applications, status and repayment details",
    icon: FileText,
    color: "bg-primary/10 text-primary",
    action: () => downloadCSV("loans.csv",
      ["ID", "User", "Amount", "Purpose", "Term", "Rate", "Status", "Date"],
      MOCK_LOANS.map(l => [l.id, l.user_name, String(l.amount), l.purpose, `${l.term_months}mo`, `${l.interest_rate}%`, l.status, l.created_at])
    ),
  },
  {
    title: "Fraud Alerts Report",
    description: "Export fraud alert history for compliance records",
    icon: AlertTriangle,
    color: "bg-destructive/10 text-destructive",
    action: () => downloadCSV("fraud-alerts.csv",
      ["User", "Description", "Severity", "Status", "Date"],
      [
        ["Patrick Niyonzima", "Multiple failed login attempts", "HIGH", "open", "2025-03-10"],
        ["Marie Claire Uwimana", "Large transfer exceeding limit", "HIGH", "open", "2025-03-09"],
        ["Alice Mukamana", "Login from unusual location", "MEDIUM", "open", "2025-03-08"],
      ]
    ),
  },
];

const AdminExportPage = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Export Reports</h1>
          <p className="text-muted-foreground">Download data as CSV files</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> From</Label>
                <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-40" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> To</Label>
                <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-40" />
              </div>
              <p className="text-xs text-muted-foreground pb-2">Date filters apply to exported data</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {exports.map((exp, i) => (
            <motion.div key={exp.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${exp.color}`}>
                    <exp.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base font-semibold text-foreground">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                  <Button onClick={exp.action} variant="outline" className="shrink-0">
                    <Download className="h-4 w-4 mr-1" /> CSV
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminExportPage;
