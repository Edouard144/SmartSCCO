import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smartphone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortalLayout from "@/components/portal/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await api.get('/devices/my-devices');
        setDevices(res.data.devices || []);
      } catch (error) {
        console.error("Failed to fetch devices", error);
      } finally {
        setLoadingDevices(false);
      }
    };
    fetchDevices();
  }, []);

  const [form, setForm] = useState({
    phone: user?.phone || "",
  });

  const handleUpdate = async () => {
    try {
      await api.put("/users/profile", {
        phone: form.phone,
      });
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <PortalLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Profile</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-accent text-primary-foreground text-xl font-bold">
                  {user?.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-foreground">{user?.full_name}</p>
                  <p className="text-sm text-muted-foreground font-normal">{user?.email}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={form.phone} onChange={(e) => setForm(p => ({...p, phone: e.target.value}))} placeholder="+250788123456" />
              </div>
              <Button onClick={handleUpdate} className="bg-gradient-accent text-primary-foreground hover:opacity-90">Save Changes</Button>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-lg">Your Devices</CardTitle></CardHeader>
          <CardContent className="space-y-3">
             {loadingDevices ? (
                 <p className="text-sm text-muted-foreground">Loading devices...</p>
             ) : devices.length === 0 ? (
                 <p className="text-sm text-muted-foreground">No devices found.</p>
             ) : (
                devices.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.device_name || d.device_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(d.last_login).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
             )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default ProfilePage;
