import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";
import api from "@/lib/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(emailFromState ? "verify" : "email");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Verification code sent!");
      setStep("verify");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (step === "email") {
    return (
      <PortalLayout>
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <Card className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </Link>
                </div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground text-center">Forgot Password?</h2>
                <p className="mt-2 text-muted-foreground text-center text-sm">
                  Enter your email address and we'll send you a verification code.
                </p>

                <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-accent text-primary-foreground hover:opacity-90">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {loading ? "Sending..." : "Send Reset Code"}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </PortalLayout>
      );
    }

  return (
    <PortalLayout>
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <Lock className="h-8 w-8 text-accent" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground text-center">Reset Password</h2>
              <p className="mt-2 text-muted-foreground text-center text-sm">
                Enter the code sent to <strong className="text-foreground">{email}</strong> and your new password.
              </p>

              <form onSubmit={handleReset} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0,6))}
                    className="text-center tracking-[0.5em] text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-accent text-primary-foreground hover:opacity-90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm">
                <Button variant="link" onClick={() => setStep("email")} className="text-primary hover:underline">
                  Use different email
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    );
  }
};

export default ResetPassword;
