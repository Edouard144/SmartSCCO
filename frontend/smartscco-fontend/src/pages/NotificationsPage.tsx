import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CreditCard, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";
import api from "@/lib/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "transaction" | "loan";
  read_status: boolean;
  created_at: string;
}

const typeConfig = {
  info: { icon: Info, color: "text-primary", bg: "bg-primary/10" },
  warning: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  transaction: { icon: ArrowUpRight, color: "text-accent", bg: "bg-accent/10" },
  loan: { icon: CreditCard, color: "text-primary", bg: "bg-primary/10" },
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications || res.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read_status).length;

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_status: true } : n));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4 mr-1" /> Mark All Read
            </Button>
          )}
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((n, i) => {
                  const type = (n.type as keyof typeof typeConfig) || "info";
                  const config = typeConfig[type];
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-start gap-3 p-4 transition-colors ${!n.read_status ? "bg-primary/5" : "hover:bg-muted/30"}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${!n.read_status ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                          {!n.read_status && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 h-4">New</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read_status && (
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markAsRead(n.id)}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => deleteNotification(n.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default NotificationsPage;
