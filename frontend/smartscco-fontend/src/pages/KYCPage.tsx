import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type KYCStatus = "not_submitted" | "pending" | "verified" | "rejected";

const statusConfig: Record<KYCStatus, { label: string; icon: any; color: string }> = {
  not_submitted: { label: "Not Submitted", icon: Upload, color: "bg-muted text-muted-foreground" },
  pending: { label: "Pending Review", icon: Clock, color: "bg-primary/10 text-primary" },
  verified: { label: "Verified", icon: CheckCircle, color: "bg-accent/10 text-accent" },
  rejected: { label: "Rejected", icon: XCircle, color: "bg-destructive/10 text-destructive" },
};

const KYCPage = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<KYCStatus>("not_submitted");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/users/profile');
        const kycStatus = res.data.user?.kyc_status;
        
        // Map backend status to frontend status
        if (!kycStatus) {
           setStatus("not_submitted");
        } else if (kycStatus === true || kycStatus === 'verified' || kycStatus === 'active') {
           setStatus("verified");
        } else if (kycStatus === 'pending') {
           setStatus("pending");
        } else if (kycStatus === 'rejected') {
           setStatus("rejected");
        } else {
           setStatus("not_submitted");
        }
      } catch (error) {
        console.error("Failed to fetch KYC status", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleUpload = async () => {
    setUploading(true);
    try {
      await api.post('/users/kyc');
      setStatus("pending");
      toast.success("Documents submitted for review!");
    } catch (error) {
      toast.error("Failed to submit documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Checking verification status...</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">KYC Verification</h1>
          <p className="text-muted-foreground">Verify your identity to unlock full features</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.color}`}>
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Status</p>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>
              </div>

              {status === "not_submitted" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Upload a clear photo of your National ID card (front and back) to verify your identity.</p>
                  <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Drag & drop your National ID photo here</p>
                    <p className="text-xs text-muted-foreground/60">PNG, JPG up to 5MB</p>
                  </div>
                  <Button onClick={handleUpload} disabled={uploading} className="bg-gradient-accent text-primary-foreground hover:opacity-90">
                    {uploading ? "Uploading..." : "Submit for Verification"}
                  </Button>
                </div>
              )}

              {status === "pending" && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 text-center">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-display text-lg font-semibold text-foreground">Under Review</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your documents are being reviewed. This usually takes 1-2 business days.</p>
                </div>
              )}

              {status === "verified" && (
                <div className="rounded-xl bg-accent/5 border border-accent/20 p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-accent mx-auto mb-3" />
                  <h3 className="font-display text-lg font-semibold text-foreground">Identity Verified</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your identity has been successfully verified. All features are unlocked.</p>
                </div>
              )}

              {status === "rejected" && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-6 text-center">
                    <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                    <h3 className="font-display text-lg font-semibold text-foreground">Verification Rejected</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your documents could not be verified. Please resubmit with clearer photos.</p>
                  </div>
                  <Button onClick={() => setStatus("not_submitted")} variant="outline">Resubmit Documents</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalLayout>
  );
};

export default KYCPage;
