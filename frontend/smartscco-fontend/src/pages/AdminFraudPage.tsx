import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";

interface FraudAlert {
  id: string;
  user: string;
  description: string;
  severity: "HIGH" | "MEDIUM";
  status: "open" | "resolved";
  created_at: string;
}

const INITIAL_ALERTS: FraudAlert[] = [
  { id: "f1", user: "Patrick Niyonzima", description: "Multiple failed login attempts from unknown IP (45.33.12.88)", severity: "HIGH", status: "open", created_at: "2025-03-10T18:00:00Z" },
  { id: "f2", user: "Marie Claire Uwimana", description: "Large transfer attempt (5,000,000 RWF) exceeding daily limit", severity: "HIGH", status: "open", created_at: "2025-03-09T14:30:00Z" },
  { id: "f3", user: "Alice Mukamana", description: "Login from unusual location (Lagos, Nigeria)", severity: "MEDIUM", status: "open", created_at: "2025-03-08T22:15:00Z" },
  { id: "f4", user: "Eric Habimana", description: "Rapid consecutive transfers to new beneficiaries", severity: "MEDIUM", status: "resolved", created_at: "2025-03-07T11:00:00Z" },
  { id: "f5", user: "David Nsengimana", description: "Account access from 3 different countries within 1 hour", severity: "HIGH", status: "resolved", created_at: "2025-03-05T06:45:00Z" },
];

const AdminFraudPage = () => {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" as const } : a));
    toast.success("Alert resolved");
  };

  const openCount = alerts.filter(a => a.status === "open").length;

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Fraud Alerts</h1>
          <p className="text-muted-foreground">{openCount} open alert{openCount !== 1 ? "s" : ""} requiring attention</p>
        </div>

        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <motion.div key={alert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`shadow-card ${alert.status === "open" ? "border-l-4 border-l-destructive" : ""}`}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${alert.status === "open" ? "bg-destructive/10" : "bg-accent/10"}`}>
                    {alert.status === "open" ? <AlertTriangle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-accent" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{alert.user}</p>
                      <Badge variant={alert.severity === "HIGH" ? "destructive" : "secondary"} className="text-[10px]">{alert.severity}</Badge>
                      <Badge variant="outline" className={alert.status === "resolved" ? "text-accent border-accent/30" : "text-destructive border-destructive/30"}>
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                  {alert.status === "open" && (
                    <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)} className="shrink-0">
                      Resolve
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminFraudPage;
