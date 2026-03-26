import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Globe, Shield, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";

const SettingsPage = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [txAlerts, setTxAlerts] = useState(true);
  const [loanAlerts, setLoanAlerts] = useState(true);
  const [otpMethod, setOtpMethod] = useState("email");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("RWF");

  const handleSave = () => toast.success("Settings saved!");

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Notification Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><Label>Email Notifications</Label></div>
                  <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><Label>SMS Notifications</Label></div>
                  <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><Label>Push Notifications</Label></div>
                  <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <Label>Transaction Alerts</Label>
                  <Switch checked={txAlerts} onCheckedChange={setTxAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Loan Updates</Label>
                  <Switch checked={loanAlerts} onCheckedChange={setLoanAlerts} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* OTP & Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <CardTitle className="font-display text-lg">Security Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>OTP Verification Method</Label>
                  <Select value={otpMethod} onValueChange={setOtpMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email OTP</SelectItem>
                      <SelectItem value="phone">Phone SMS OTP</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Choose how you receive verification codes</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Language & Currency */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card h-full">
              <CardHeader className="flex flex-row items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-lg">Language & Currency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="rw">Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RWF">RWF - Rwandan Franc</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Button onClick={handleSave} className="bg-gradient-accent text-primary-foreground hover:opacity-90" size="lg">
          Save Settings
        </Button>
      </div>
    </PortalLayout>
  );
};

export default SettingsPage;
