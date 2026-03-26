import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Smartphone, Lock, Key, Eye, EyeOff, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
import { toast } from "sonner";

const SecurityPage = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  // PIN state
  const [pinDialog, setPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  // Password state
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

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

  const handleSetPin = async () => {
    if (pin.length < 4) { toast.error("PIN must be at least 4 digits"); return; }
    if (pin !== confirmPin) { toast.error("PINs do not match"); return; }
    try {
      await api.post("/pin/set", { pin });
      toast.success("PIN set successfully!");
      setPinDialog(false);
      setPin(""); setConfirmPin("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to set PIN");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) { toast.error("Fill in all fields"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    try {
      await api.post("/users/change-password", {
        current_password: currentPassword,
        new_password: newPassword
      });
      toast.success("Password changed successfully!");
      setPasswordDialog(false);
      setCurrentPassword(""); setNewPassword("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Security</h1>
          <p className="text-muted-foreground">Manage your security settings</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* PIN Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-display text-lg">Transaction PIN</CardTitle>
                  <p className="text-xs text-muted-foreground">Secure your transactions</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Set a 4-digit PIN to authorize transfers and payments.</p>
                <Dialog open={pinDialog} onOpenChange={setPinDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-accent text-primary-foreground hover:opacity-90">
                      <Lock className="h-4 w-4 mr-1" /> Set / Change PIN
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Set Transaction PIN</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>New PIN</Label>
                        <Input
                          type="password"
                          maxLength={4}
                          placeholder="••••"
                          value={pin}
                          onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0,4))}
                          className="text-center tracking-[0.5em] text-lg"
                        />
                        <p className="text-xs text-muted-foreground">4-digit PIN for transactions</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm PIN</Label>
                        <Input
                          type="password"
                          maxLength={4}
                          placeholder="••••"
                          value={confirmPin}
                          onChange={e => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0,4))}
                          className="text-center tracking-[0.5em] text-lg"
                        />
                      </div>
                      <Button onClick={handleSetPin} className="w-full bg-gradient-accent text-primary-foreground">Save PIN</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="font-display text-lg">Password</CardTitle>
                  <p className="text-xs text-muted-foreground">Update your password</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Change your account password for enhanced security.</p>
                <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Lock className="h-4 w-4 mr-1" /> Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input type={showPw ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <div className="relative">
                          <Input type={showPw ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <Button onClick={handleChangePassword} className="w-full bg-gradient-accent text-primary-foreground">Update Password</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Login Devices */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display text-lg">Login Devices</CardTitle>
                <p className="text-xs text-muted-foreground">Devices that have accessed your account</p>
              </div>
            </CardHeader>
            <CardContent>
              {loadingDevices ? (
                 <p className="text-sm text-muted-foreground">Loading devices...</p>
              ) : devices.length === 0 ? (
                 <p className="text-sm text-muted-foreground">No devices found.</p>
              ) : (
                <div className="space-y-3">
                  {devices.map((d, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{d.device_name || d.device_type}</p>
                          <p className="text-xs text-muted-foreground">Last active: {new Date(d.last_login).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {i === 0 && <Badge variant="outline" className="text-accent border-accent/30">Current</Badge>}
                        {i !== 0 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/60 hover:text-destructive" onClick={() => toast.success("Device removed")}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalLayout>
  );
};

export default SecurityPage;
