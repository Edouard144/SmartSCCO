import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      toast.success(result.message || "Login successful!");
      // If OTP was sent, redirect to verify page; otherwise go to dashboard
      if (result.message?.includes("OTP")) {
        navigate("/verify-otp");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-primary-foreground">
              Smart<span className="text-gradient-gold">SCCO</span>
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            Welcome Back
          </h1>
          <p className="text-primary-foreground/60 text-lg">
            Access your secure banking portal with industry-leading security.
          </p>
          <div className="mt-8 space-y-3">
            {["Bank-grade encryption", "OTP verification", "24/7 access"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-primary-foreground/70">
                <div className="h-2 w-2 rounded-full bg-emerald" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-primary-foreground/10 p-4 border border-primary-foreground/20">
            <p className="text-primary-foreground/80 text-sm font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-primary-foreground/60 text-xs">
              <p><strong className="text-primary-foreground/80">Admin:</strong> admin@smartscco.com / admin123</p>
              <p><strong className="text-primary-foreground/80">User:</strong> user@smartscco.com / user123</p>
              <p><strong className="text-primary-foreground/80">Demo:</strong> demo@smartscco.com / demo123</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right - Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              SmartSCCO
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground">Sign In</h2>
          <p className="mt-2 text-muted-foreground">Enter your credentials to continue</p>

          {/* Mobile demo credentials */}
          <div className="lg:hidden mt-4 rounded-xl bg-muted p-3 border border-border">
            <p className="text-foreground text-xs font-medium mb-1">Demo Accounts:</p>
            <div className="space-y-0.5 text-muted-foreground text-xs">
              <p><strong>Admin:</strong> admin@smartscco.com / admin123</p>
              <p><strong>User:</strong> user@smartscco.com / user123</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-accent text-primary-foreground hover:opacity-90 shadow-hero"
              size="lg"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Get Started
              </Link>
            </p>
            <p>
              <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
          <p className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
