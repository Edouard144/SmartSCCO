import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Wallet,
  BarChart3,
  ShieldCheck,
  Smartphone,
  ArrowLeftRight,
  Landmark,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Digital Wallets",
    desc: "Instant deposits, withdrawals, and peer-to-peer transfers with real-time balance tracking.",
  },
  {
    icon: Landmark,
    title: "Smart Loan Engine",
    desc: "Automated loan origination, risk scoring, and repayment scheduling with configurable parameters.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Live dashboards with KPIs, transaction monitoring, and predictive financial insights.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    desc: "OTP verification, role-based access, fraud detection, and full audit trails.",
  },
  {
    icon: ArrowLeftRight,
    title: "Multi-Branch Operations",
    desc: "Centralized management of branches, staff assignments, and inter-branch transfers.",
  },
  {
    icon: Smartphone,
    title: "Omnichannel Ready",
    desc: "Responsive web portal today, with mobile and USSD integrations on the roadmap.",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald">
            Platform Capabilities
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Everything a Modern Bank Needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete digital banking infrastructure designed for scale, security, and exceptional user experience.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
