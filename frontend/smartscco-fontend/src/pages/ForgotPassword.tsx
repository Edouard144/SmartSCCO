import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";
import api from "@/lib/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset code sent to your email!");
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <PortalLayout>
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <Card className="shadow-card">
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">Check Your Email</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  We've sent a 6-digit verification code to <strong className="text-foreground">{email}</strong>
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Enter this code along with your new password on the next page.
                </p>
                <Button onClick={() => navigate("/reset-password", { state: { email } })} className="mt-6 w-full bg-gradient-accent text-primary-foreground">
                  Continue to Reset Password
                </Button>
                <p className="mt-4 text-center">
                  <Button variant="link" onClick={() => setSubmitted(false)} className="text-primary hover:underline">
                    Use different email
                  </Button>
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground text-center">Forgot Password?</h2>
              <p className="mt-2 text-muted-foreground text-center text-sm">
                Enter your email address and we'll send you a verification code to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                  {loading ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm">
                <Link to="/login" className="font-medium text-primary hover:underline">
                  ← Back to Login
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    );
  }
};

export default ForgotPassword;
