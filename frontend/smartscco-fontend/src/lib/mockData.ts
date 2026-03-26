// Complete mock data store for offline/demo functionality

export type TransactionCategory = "savings" | "utilities" | "transfer" | "salary" | "rent" | "mobile_money" | "loan" | "airtime" | "food" | "other";

export const TRANSACTION_CATEGORIES: Record<TransactionCategory, { label: string; color: string }> = {
  savings: { label: "Savings", color: "hsl(162 63% 41%)" },
  utilities: { label: "Utilities", color: "hsl(221 83% 33%)" },
  transfer: { label: "Transfer", color: "hsl(43 96% 56%)" },
  salary: { label: "Salary", color: "hsl(162 63% 41%)" },
  rent: { label: "Rent", color: "hsl(0 84% 60%)" },
  mobile_money: { label: "Mobile Money", color: "hsl(271 60% 50%)" },
  loan: { label: "Loan", color: "hsl(221 70% 45%)" },
  airtime: { label: "Airtime", color: "hsl(30 90% 50%)" },
  food: { label: "Food & Dining", color: "hsl(340 70% 50%)" },
  other: { label: "Other", color: "hsl(220 9% 46%)" },
};

export const MOCK_USERS = [
  {
    id: "user-001",
    email: "admin@smartscco.com",
    full_name: "Jean Baptiste Mugabo",
    role: "admin",
    phone: "+250788100200",
    national_id: "1199080012345678",
    password: "admin123",
    status: "active",
    created_at: "2024-06-15T10:00:00Z",
  },
  {
    id: "user-002",
    email: "user@smartscco.com",
    full_name: "Marie Claire Uwimana",
    role: "member",
    phone: "+250788300400",
    national_id: "1199580098765432",
    password: "user123",
    status: "active",
    created_at: "2024-08-20T14:30:00Z",
  },
  {
    id: "user-003",
    email: "demo@smartscco.com",
    full_name: "Patrick Niyonzima",
    role: "member",
    phone: "+250788500600",
    national_id: "1198070011223344",
    password: "demo123",
    status: "active",
    created_at: "2024-09-05T09:15:00Z",
  },
];

export const MOCK_TRANSACTIONS = [
  { id: "tx-001", type: "deposit", amount: 500000, description: "Monthly savings deposit", status: "completed", user_email: "user@smartscco.com", created_at: "2025-03-01T10:00:00Z", category: "savings" as TransactionCategory, reference: "REF-2025030110001" },
  { id: "tx-002", type: "credit", amount: 250000, description: "Transfer from Patrick", status: "completed", user_email: "demo@smartscco.com", created_at: "2025-02-28T15:30:00Z", category: "transfer" as TransactionCategory, reference: "REF-2025022815302" },
  { id: "tx-003", type: "debit", amount: 75000, description: "Utility payment - WASAC", status: "completed", user_email: "user@smartscco.com", created_at: "2025-02-25T09:45:00Z", category: "utilities" as TransactionCategory, reference: "REF-2025022509453" },
  { id: "tx-004", type: "deposit", amount: 1200000, description: "Business revenue deposit", status: "completed", user_email: "user@smartscco.com", created_at: "2025-02-20T11:00:00Z", category: "salary" as TransactionCategory, reference: "REF-2025022011004" },
  { id: "tx-005", type: "debit", amount: 180000, description: "Rent payment", status: "completed", user_email: "user@smartscco.com", created_at: "2025-02-15T08:30:00Z", category: "rent" as TransactionCategory, reference: "REF-2025021508305" },
  { id: "tx-006", type: "credit", amount: 350000, description: "Loan disbursement", status: "completed", user_email: "demo@smartscco.com", created_at: "2025-02-10T14:00:00Z", category: "loan" as TransactionCategory, reference: "REF-2025021014006" },
  { id: "tx-007", type: "debit", amount: 45000, description: "Mobile money transfer", status: "completed", user_email: "user@smartscco.com", created_at: "2025-02-05T16:20:00Z", category: "mobile_money" as TransactionCategory, reference: "REF-2025020516207" },
  { id: "tx-008", type: "deposit", amount: 800000, description: "Salary deposit", status: "completed", user_email: "demo@smartscco.com", created_at: "2025-01-30T12:00:00Z", category: "salary" as TransactionCategory, reference: "REF-2025013012008" },
];

export const MOCK_LOANS = [
  { id: "loan-001", user_id: "user-002", user_name: "Marie Claire Uwimana", email: "user@smartscco.com", amount: 500000, purpose: "Business expansion", term_months: 12, interest_rate: 15, status: "active", created_at: "2025-01-15T10:00:00Z" },
  { id: "loan-002", user_id: "user-002", user_name: "Marie Claire Uwimana", email: "user@smartscco.com", amount: 200000, purpose: "Education fees", term_months: 6, interest_rate: 12, status: "paid", created_at: "2024-09-10T14:00:00Z" },
  { id: "loan-003", user_id: "user-003", user_name: "Patrick Niyonzima", email: "demo@smartscco.com", amount: 1000000, purpose: "Agriculture investment", term_months: 24, interest_rate: 14, status: "pending", created_at: "2025-03-01T09:00:00Z" },
  { id: "loan-004", user_id: "user-003", user_name: "Patrick Niyonzima", email: "demo@smartscco.com", amount: 300000, purpose: "Personal emergency", term_months: 6, interest_rate: 18, status: "pending", created_at: "2025-03-05T11:30:00Z" },
];

export const MOCK_BENEFICIARIES = [
  { id: "ben-001", full_name: "Patrick Niyonzima", email: "demo@smartscco.com", phone: "+250788500600" },
  { id: "ben-002", full_name: "Alice Mukamana", email: "alice@example.com", phone: "+250788700800" },
  { id: "ben-003", full_name: "Eric Habimana", email: "eric@example.com", phone: "+250788900100" },
];

export const MOCK_DEVICES = [
  { device_name: "Chrome on Windows", last_login: "2025-03-07T18:00:00Z" },
  { device_name: "Safari on iPhone", last_login: "2025-03-06T10:30:00Z" },
];

export const MOCK_MEMBERS = [
  ...MOCK_USERS.map(u => ({ ...u })),
  { id: "user-004", full_name: "Alice Mukamana", email: "alice@example.com", phone: "+250788700800", status: "active", created_at: "2024-10-12T08:00:00Z" },
  { id: "user-005", full_name: "Eric Habimana", email: "eric@example.com", phone: "+250788900100", status: "active", created_at: "2024-11-03T13:00:00Z" },
  { id: "user-006", full_name: "Grace Ingabire", email: "grace@example.com", phone: "+250788110220", status: "active", created_at: "2024-12-01T07:00:00Z" },
  { id: "user-007", full_name: "David Nsengimana", email: "david@example.com", phone: "+250788330440", status: "inactive", created_at: "2025-01-20T15:00:00Z" },
  { id: "user-008", full_name: "Sandra Uwase", email: "sandra@example.com", phone: "+250788550660", status: "active", created_at: "2025-02-14T11:00:00Z" },
];

// Mock data store (mutable for in-session operations)
class MockStore {
  private balance = 2450000;
  private transactions = [...MOCK_TRANSACTIONS];
  private loans = [...MOCK_LOANS];
  private beneficiaries = [...MOCK_BENEFICIARIES];
  private registeredUsers = [...MOCK_USERS];

  getBalance() { return this.balance; }

  getTransactions(search = "") {
    if (!search) return this.transactions;
    const s = search.toLowerCase();
    return this.transactions.filter(t => 
      t.description.toLowerCase().includes(s) || t.type.includes(s)
    );
  }

  deposit(amount: number) {
    this.balance += amount;
    this.transactions.unshift({
      id: `tx-${Date.now()}`, type: "deposit", amount, description: "Deposit via bank transfer",
      status: "completed", user_email: "user@smartscco.com", created_at: new Date().toISOString(),
      category: "savings" as TransactionCategory, reference: `REF-${Date.now()}`,
    });
  }

  withdraw(amount: number) {
    if (amount > this.balance) throw new Error("Insufficient balance");
    this.balance -= amount;
    this.transactions.unshift({
      id: `tx-${Date.now()}`, type: "debit", amount, description: "Withdrawal to bank",
      status: "completed", user_email: "user@smartscco.com", created_at: new Date().toISOString(),
      category: "other" as TransactionCategory, reference: `REF-${Date.now()}`,
    });
  }

  transfer(recipientEmail: string, amount: number, description: string) {
    if (amount > this.balance) throw new Error("Insufficient balance");
    this.balance -= amount;
    this.transactions.unshift({
      id: `tx-${Date.now()}`, type: "debit", amount, description: description || `Transfer to ${recipientEmail}`,
      status: "completed", user_email: recipientEmail, created_at: new Date().toISOString(),
      category: "transfer" as TransactionCategory, reference: `REF-${Date.now()}`,
    });
  }

  getLoans(userId?: string) {
    if (userId) return this.loans.filter(l => l.user_id === userId);
    return this.loans;
  }

  getPendingLoans() { return this.loans.filter(l => l.status === "pending"); }

  applyLoan(userId: string, amount: number, purpose: string, termMonths: number) {
    const user = this.registeredUsers.find(u => u.id === userId);
    const loan = {
      id: `loan-${Date.now()}`, user_id: userId, user_name: user?.full_name || "User",
      email: user?.email || "", amount, purpose, term_months: termMonths,
      interest_rate: 15, status: "pending" as const, created_at: new Date().toISOString(),
    };
    this.loans.unshift(loan);
    return loan;
  }

  approveLoan(loanId: string, approvedAmount: number, interestRate: number, termMonths: number) {
    const loan = this.loans.find(l => l.id === loanId);
    if (loan) { loan.status = "active"; loan.amount = approvedAmount; loan.interest_rate = interestRate; loan.term_months = termMonths; }
  }

  rejectLoan(loanId: string) {
    const loan = this.loans.find(l => l.id === loanId);
    if (loan) loan.status = "rejected";
  }

  repayLoan(loanId: string, amount: number) {
    this.balance -= amount;
    this.transactions.unshift({
      id: `tx-${Date.now()}`, type: "debit", amount, description: `Loan repayment (${loanId})`,
      status: "completed", user_email: "user@smartscco.com", created_at: new Date().toISOString(),
      category: "loan" as TransactionCategory, reference: `REF-${Date.now()}`,
    });
  }

  getBeneficiaries() { return this.beneficiaries; }

  addBeneficiary(data: { full_name: string; email: string; phone: string }) {
    const b = { id: `ben-${Date.now()}`, ...data };
    this.beneficiaries.push(b);
    return b;
  }

  removeBeneficiary(id: string) {
    this.beneficiaries = this.beneficiaries.filter(b => b.id !== id);
  }

  findUser(email: string, password: string) {
    return this.registeredUsers.find(u => u.email === email && u.password === password);
  }

  findUserById(id: string) {
    return this.registeredUsers.find(u => u.id === id);
  }

  registerUser(data: { full_name: string; email: string; phone: string; national_id: string; password: string }) {
    if (this.registeredUsers.find(u => u.email === data.email)) throw new Error("Email already registered");
    const user = { id: `user-${Date.now()}`, ...data, role: "member", status: "active", created_at: new Date().toISOString() };
    this.registeredUsers.push(user);
    return user;
  }

  getMembers() { return MOCK_MEMBERS; }
}

export const mockStore = new MockStore();
