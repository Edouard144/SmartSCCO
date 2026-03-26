import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Users, CreditCard, Building2 } from "lucide-react";

const metrics = [
  { icon: Users, value: "50,000+", label: "Active Members", color: "text-emerald" },
  { icon: CreditCard, value: "$12.4M", label: "Monthly Transactions", color: "text-gold" },
  { icon: Building2, value: "15+", label: "Branch Locations", color: "text-navy-light" },
  { icon: TrendingUp, value: "340%", label: "Year-over-Year Growth", color: "text-emerald" },
];

const MetricsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="metrics" ref={ref} className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary ${m.color}`}>
                <m.icon className="h-6 w-6" />
              </div>
              <p className="font-display text-3xl font-bold text-foreground">{m.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
