import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Message = { role: "user" | "bot"; content: string };

const knowledgeBase: { patterns: string[]; response: string }[] = [
  { patterns: ["transfer", "send money", "send funds"], response: "To transfer money, go to your **Wallet** page and click **Send**. Enter the recipient's email/phone and the amount, then confirm with your PIN." },
  { patterns: ["balance", "check balance", "how much"], response: "Your current balance is displayed at the top of the **Wallet** page. You can also see it on your **Dashboard**." },
  { patterns: ["loan", "borrow", "apply loan"], response: "Navigate to the **Loans** page, click **Apply for Loan**, enter the amount and duration, then submit. Applications are reviewed within 1-3 business days." },
  { patterns: ["repay", "pay loan", "loan payment"], response: "Go to the **Loans** page, find your active loan, and click **Repay**. Enter the amount you'd like to pay and confirm with your PIN." },
  { patterns: ["pin", "set pin", "change pin", "transaction pin"], response: "Go to the **Security** page and click **Set / Change PIN**. Enter your desired 4-6 digit PIN and confirm it." },
  { patterns: ["password", "change password", "reset password"], response: "Go to the **Security** page and click **Change Password**. You'll need to verify via OTP before setting a new password." },
  { patterns: ["kyc", "verify", "identity", "national id"], response: "Go to the **KYC Verification** page to upload your National ID. Once submitted, our team will review and verify your identity within 24 hours." },
  { patterns: ["notification", "alerts", "unread"], response: "Check the **Notifications** page (bell icon in the header) to see all alerts. You can mark them as read individually or all at once." },
  { patterns: ["savings", "goal", "save money"], response: "Visit the **Savings Goals** page to create a new goal, set your target amount, and track your progress. You can contribute anytime." },
  { patterns: ["bill", "pay bill", "utility", "airtime"], response: "Go to the **Bill Payments** page to pay for utilities (electricity, water), internet, airtime, or insurance." },
  { patterns: ["beneficiary", "add beneficiary", "recipient"], response: "Go to the **Beneficiaries** page and click **Add Beneficiary**. Save their name, email, and phone for quick future transfers." },
  { patterns: ["credit", "credit score", "score"], response: "Check your **Credit Score** page to see your rating (0-100), breakdown of factors, and tips to improve it." },
  { patterns: ["schedule", "recurring", "automatic"], response: "Visit **Scheduled Transfers** to set up recurring payments — daily, weekly, monthly, or quarterly." },
  { patterns: ["analytics", "spending", "report"], response: "The **Analytics** page shows your spending by category, income vs. expenses, and financial trends over time." },
  { patterns: ["settings", "preferences", "language"], response: "Go to **Settings** to manage notification preferences, OTP method, language, and currency settings." },
  { patterns: ["help", "support", "contact"], response: "You're chatting with our assistant! For more help, visit the **Help & Support** page to submit a ticket or check our FAQ." },
  { patterns: ["hello", "hi", "hey", "good morning", "good afternoon"], response: "Hello! 👋 Welcome to SmartSCCO support. How can I help you today?" },
  { patterns: ["thank", "thanks", "thank you"], response: "You're welcome! 😊 Is there anything else I can help you with?" },
];

function findResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.patterns.some((p) => lower.includes(p))) return entry.response;
  }
  return "I'm not sure about that. You can try asking about transfers, loans, bills, savings, security, or visit the **Help & Support** page for more assistance.";
}

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi! 👋 I'm SmartSCCO Assistant. Ask me about transfers, loans, bills, security, or anything else!" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", content: findResponse(text) }]);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            style={{ height: "min(500px, calc(100vh - 4rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="font-display text-sm font-bold text-primary-foreground">SmartSCCO Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "bot" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-full text-sm h-9"
                />
                <Button type="submit" size="icon" className="h-9 w-9 rounded-full shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
