import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, ShieldCheck, Briefcase } from "lucide-react";

const roles = [
  {
    icon: Users,
    title: "Member Portal",
    points: ["Account & wallet management", "Instant transfers & payments", "Loan applications & tracking", "Transaction history & statements"],
  },
  {
    icon: Briefcase,
    title: "Staff Dashboard",
    points: ["Customer service tools", "Loan review & approval", "Transaction monitoring", "Daily operational reports"],
  },
  {
    icon: ShieldCheck,
    title: "Admin Console",
    points: ["Full system control", "Branch & user management", "Compliance & audit logs", "Financial analytics & KPIs"],
  },
];

const PlatformSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="platform" ref={ref} className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald">
            Role-Based Access
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            One Platform, Three Powerful Portals
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tailored experiences for every user — from account holders to bank administrators.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {roles.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl bg-card p-8 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-accent text-primary-foreground">
                <r.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">{r.title}</h3>
              <ul className="mt-4 space-y-3">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
