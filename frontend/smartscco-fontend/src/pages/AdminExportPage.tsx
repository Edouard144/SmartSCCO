import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Users, CreditCard, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
import { toast } from "sonner";

const AdminExportPage = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleExport = async (type: string, filename: string) => {
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      const url = `/export/${type}?${params.toString()}`;

      const res = await api.get(url, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv" });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(downloadUrl);
      toast.success(`${filename} exported successfully`);
    } catch (err: any) {
      console.error("Export error", err);
      toast.error("Failed to export data");
    }
  };

  const exportsData = [
    {
      title: "Members Report",
      description: "Export all member data including status and registration date",
      icon: Users,
      color: "bg-primary/10 text-primary",
      action: () => handleExport("members", "members.csv"),
    },
    {
      title: "Transactions Report",
      description: "Export complete transaction history with categories",
      icon: CreditCard,
      color: "bg-accent/10 text-accent",
      action: () => handleExport("transactions", "transactions.csv"),
    },
    {
      title: "Loans Report",
      description: "Export loan applications, status and repayment details",
      icon: FileText,
      color: "bg-primary/10 text-primary",
      action: () => handleExport("loans", "loans.csv"),
    },
    {
      title: "Fraud Alerts Report",
      description: "Export fraud alert history for compliance records",
      icon: AlertTriangle,
      color: "bg-destructive/10 text-destructive",
      action: () => handleExport("fraud-alerts", "fraud-alerts.csv"),
    },
  ];

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
          {exportsData.map((exp, i) => (
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
