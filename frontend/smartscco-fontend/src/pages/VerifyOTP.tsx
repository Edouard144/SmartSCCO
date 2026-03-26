import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyOtp, pendingEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(pendingEmail || "", otp);
      toast.success("Verification successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!pendingEmail) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">SmartSCCO</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground">Verify OTP</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            We sent a verification code to <strong className="text-foreground">{pendingEmail}</strong>
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-left">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-lg tracking-[0.5em] font-mono"
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-accent text-primary-foreground hover:opacity-90"
              size="lg"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            Didn't receive the code?{" "}
            <button className="text-primary hover:underline font-medium">Resend OTP</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
