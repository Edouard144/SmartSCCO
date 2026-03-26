import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight, ArrowDownLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TRANSACTION_CATEGORIES, type TransactionCategory } from "@/lib/mockData";
import { useState } from "react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  user_email: string;
  created_at: string;
  category?: TransactionCategory;
  reference?: string;
}

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransactionDetailsDialog = ({ transaction, open, onOpenChange }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const isCredit = transaction.type === "credit" || transaction.type === "deposit";
  const cat = TRANSACTION_CATEGORIES[transaction.category || "other"];
  const ref = transaction.reference || transaction.id.toUpperCase();

  const copyRef = () => {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Transaction Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Amount hero */}
          <div className="flex flex-col items-center gap-2 py-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isCredit ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
              {isCredit ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
            </div>
            <span className={`font-display text-3xl font-bold ${isCredit ? "text-accent" : "text-destructive"}`}>
              {isCredit ? "+" : "-"}{Number(transaction.amount).toLocaleString()} RWF
            </span>
            <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="capitalize">
              {transaction.status}
            </Badge>
          </div>

          <Separator />

          {/* Details grid */}
          <div className="space-y-3 text-sm">
            <Row label="Description" value={transaction.description} />
            <Row label="Type" value={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} />
            <Row label="Category">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.label}
              </span>
            </Row>
            <Row label="Date" value={new Date(transaction.created_at).toLocaleString()} />
            <Row label="Recipient" value={transaction.user_email} />
            <Row label="Reference">
              <span className="flex items-center gap-1.5 font-mono text-xs">
                {ref}
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyRef}>
                  {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
                </Button>
              </span>
            </Row>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
  <div className="flex items-start justify-between">
    <span className="text-muted-foreground">{label}</span>
    {children || <span className="font-medium text-foreground text-right max-w-[60%]">{value}</span>}
  </div>
);

export default TransactionDetailsDialog;
