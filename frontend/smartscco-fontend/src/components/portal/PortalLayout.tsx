import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Wallet, CreditCard, Users, UserCircle, LogOut,
  Menu, X, Shield, ChevronDown, Bell, CalendarClock, Lock, TrendingUp,
  FileCheck, Target, BarChart3, Settings, HelpCircle, Building2,
  AlertTriangle, FileText, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const memberLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Bill Payments", href: "/bills", icon: CreditCard },
  { label: "Scheduled", href: "/scheduled", icon: CalendarClock },
  { label: "Loans", href: "/loans", icon: CreditCard },
  { label: "Savings Goals", href: "/savings", icon: Target },
  { label: "Beneficiaries", href: "/beneficiaries", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Credit Score", href: "/credit", icon: TrendingUp },
  { label: "KYC Verification", href: "/kyc", icon: FileCheck },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Security", href: "/security", icon: Lock },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help & Support", href: "/help", icon: HelpCircle },
];

const adminLinks = [
  { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Members", href: "/admin/members", icon: Users },
  { label: "Transactions", href: "/admin/transactions", icon: Wallet },
  { label: "Loans", href: "/admin/loans", icon: CreditCard },
  { label: "Audit Logs", href: "/admin/audit", icon: FileText },
  { label: "Fraud Alerts", href: "/admin/fraud", icon: AlertTriangle },
  { label: "Branches", href: "/admin/branches", icon: Building2 },
  { label: "Export Reports", href: "/admin/export", icon: Download },
];

const PortalLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = isAdmin
    ? [...adminLinks, ...memberLinks]
    : memberLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-hero transition-transform duration-200 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-primary-foreground/10">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-primary-foreground">
              Smart<span className="text-gradient-gold">SCCO</span>
            </span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {links.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-foreground/15 text-primary-foreground"
                      : "text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-primary-foreground/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
          <button
            className="lg:hidden text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center text-primary-foreground text-sm font-bold">
                {user?.full_name ? user.full_name.charAt(0) : "U"}
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {user?.full_name || "User"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
