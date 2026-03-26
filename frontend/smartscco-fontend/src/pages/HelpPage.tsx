import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageSquare, Send, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PortalLayout from "@/components/portal/PortalLayout";
import { toast } from "sonner";

const faqs = [
  { q: "How do I transfer money?", a: "Go to your Wallet page, click 'Send', enter the recipient's email and amount, then confirm the transfer." },
  { q: "How do I apply for a loan?", a: "Navigate to the Loans page, click 'Apply for Loan', fill in the amount, purpose, and term, then submit your application." },
  { q: "How long does loan approval take?", a: "Loan applications are typically reviewed within 1-3 business days. You'll be notified once a decision is made." },
  { q: "How do I set up a transaction PIN?", a: "Go to the Security page and click 'Set / Change PIN'. Enter your desired 4-6 digit PIN and confirm." },
  { q: "What is KYC verification?", a: "KYC (Know Your Customer) verification requires you to upload a photo of your National ID to verify your identity and unlock full features." },
  { q: "How do I change my password?", a: "Go to the Security page and click 'Change Password'. Enter your current password and your new password." },
  { q: "How can I view my transaction history?", a: "Your Wallet page shows all transactions. You can search and filter by category to find specific transactions." },
  { q: "How do I add a beneficiary?", a: "Go to the Beneficiaries page and click 'Add Beneficiary'. Enter their name, email, and phone number." },
];

const HelpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { toast.error("Fill in all fields"); return; }
    toast.success("Support ticket submitted! We'll respond within 24 hours.");
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Help & Support</h1>
          <p className="text-muted-foreground">Find answers or contact us</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <CardTitle className="font-display text-lg">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-sm text-left">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Send className="h-5 w-5 text-accent" />
                  <CardTitle className="font-display text-lg">Contact Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2"><Label>Name</Label><Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Message</Label><Textarea placeholder="Describe your issue..." rows={4} value={message} onChange={e => setMessage(e.target.value)} /></div>
                    <Button type="submit" className="w-full bg-gradient-accent text-primary-foreground hover:opacity-90">Submit Ticket</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Live Chat Placeholder */}
              <Card className="shadow-card">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <h3 className="font-display font-semibold text-foreground">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Chat with our support team in real-time</p>
                  <Button variant="outline" disabled>Coming Soon</Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default HelpPage;
