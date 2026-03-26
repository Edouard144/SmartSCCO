import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", national_id: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        national_id: form.national_id,
        password: form.password,
      });
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-hero items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold text-primary-foreground">
              Smart<span className="text-gradient-gold">SCCO</span>
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            Join SmartSCCO
          </h1>
          <p className="text-primary-foreground/60 text-lg">
            Open your digital banking account in minutes. Secure, fast, and fully digital.
          </p>
        </motion.div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <h2 className="font-display text-2xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-muted-foreground">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input placeholder="+250788123456" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>National ID</Label>
              <Input placeholder="1199080012345678" value={form.national_id} onChange={(e) => update("national_id", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-accent text-primary-foreground hover:opacity-90 shadow-hero" size="lg">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
          <p className="mt-2 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Home</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
