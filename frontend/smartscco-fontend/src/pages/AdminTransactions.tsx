import { useState } from "react";
import { Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PortalLayout from "@/components/portal/PortalLayout";
import api from "@/lib/api";
import { useEffect } from "react";

const AdminTransactions = () => {
  const [search, setSearch] = useState("");
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/admin/transactions");
        setAllTransactions(res.data.transactions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const transactions = allTransactions.filter((t: any) => 
    (t.description || t.type).toLowerCase().includes(search.toLowerCase()) || 
    (t.user_email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Transaction Monitoring</h1>
            <p className="text-muted-foreground">Monitor all system transactions</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transactions..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No transactions found</TableCell></TableRow>
                ) : transactions.map((tx, i) => (
                  <TableRow key={tx.id || i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tx.type === "credit" || tx.type === "deposit" ? (
                          <ArrowDownLeft className="h-4 w-4 text-accent" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-destructive" />
                        )}
                        <span className="capitalize">{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tx.user_email || tx.user_id || "—"}</TableCell>
                    <TableCell className="font-semibold">{Number(tx.amount).toLocaleString()} RWF</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={tx.status === "completed" ? "bg-accent/10 text-accent" : "bg-gold/10 text-gold"}>
                        {tx.status || "completed"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
};

export default AdminTransactions;
