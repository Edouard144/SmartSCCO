import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import WalletPage from "./pages/WalletPage";
import BillPaymentsPage from "./pages/BillPaymentsPage";
import ScheduledTransfersPage from "./pages/ScheduledTransfersPage";
import LoansPage from "./pages/LoansPage";
import BeneficiariesPage from "./pages/BeneficiariesPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import SecurityPage from "./pages/SecurityPage";
import CreditScorePage from "./pages/CreditScorePage";
import KYCPage from "./pages/KYCPage";
import SavingsGoalsPage from "./pages/SavingsGoalsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminTransactions from "./pages/AdminTransactions";
import AdminLoans from "./pages/AdminLoans";
import AdminAuditPage from "./pages/AdminAuditPage";
import AdminFraudPage from "./pages/AdminFraudPage";
import AdminBranchesPage from "./pages/AdminBranchesPage";
import AdminExportPage from "./pages/AdminExportPage";
import NotFound from "./pages/NotFound";
import ChatbotWidget from "./components/ChatbotWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
            <Route path="/bills" element={<ProtectedRoute><BillPaymentsPage /></ProtectedRoute>} />
            <Route path="/scheduled" element={<ProtectedRoute><ScheduledTransfersPage /></ProtectedRoute>} />
            <Route path="/loans" element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
            <Route path="/beneficiaries" element={<ProtectedRoute><BeneficiariesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
            <Route path="/credit" element={<ProtectedRoute><CreditScorePage /></ProtectedRoute>} />
            <Route path="/kyc" element={<ProtectedRoute><KYCPage /></ProtectedRoute>} />
            <Route path="/savings" element={<ProtectedRoute><SavingsGoalsPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/members" element={<ProtectedRoute adminOnly><AdminMembers /></ProtectedRoute>} />
            <Route path="/admin/transactions" element={<ProtectedRoute adminOnly><AdminTransactions /></ProtectedRoute>} />
            <Route path="/admin/loans" element={<ProtectedRoute adminOnly><AdminLoans /></ProtectedRoute>} />
            <Route path="/admin/audit" element={<ProtectedRoute adminOnly><AdminAuditPage /></ProtectedRoute>} />
            <Route path="/admin/fraud" element={<ProtectedRoute adminOnly><AdminFraudPage /></ProtectedRoute>} />
            <Route path="/admin/branches" element={<ProtectedRoute adminOnly><AdminBranchesPage /></ProtectedRoute>} />
            <Route path="/admin/export" element={<ProtectedRoute adminOnly><AdminExportPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
