import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Lock, Eye, FileCheck, ServerCrash } from "lucide-react";
import shieldImage from "@/assets/security-shield.png";

const items = [
  { icon: Lock, title: "End-to-End Encryption", desc: "256-bit AES encryption for all data at rest and in transit." },
  { icon: Eye, title: "Fraud Detection", desc: "Real-time monitoring with automated suspicious activity alerts." },
  { icon: FileCheck, title: "Regulatory Compliance", desc: "PCI DSS, KYC/AML compliant with full audit trail logging." },
  { icon: ServerCrash, title: "99.9% Uptime SLA", desc: "Redundant infrastructure with automated failover and backups." },
];

const SecuritySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="security" ref={ref} className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
              <img src={shieldImage} alt="Security" className="relative h-72 w-72 object-contain" />
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald">
              Bank-Grade Security
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Built on Trust & Compliance
            </h2>
            <p className="mt-4 mb-10 text-muted-foreground">
              Security isn't an afterthought — it's our foundation. Every layer of SmartSCCO 
              is engineered to protect member data and meet the highest regulatory standards.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {items.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-foreground">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
