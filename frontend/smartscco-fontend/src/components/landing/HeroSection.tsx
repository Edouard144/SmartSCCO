import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-banking.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero pt-24">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald/5 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-navy-light/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-2 w-2 rounded-full bg-gold animate-pulse-glow" />
        <div className="absolute top-1/2 right-1/3 h-1.5 w-1.5 rounded-full bg-emerald animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/3 left-1/3 h-1 w-1 rounded-full bg-primary-foreground/40 animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="grid min-h-[85vh] items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full glass px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-xs font-medium text-primary-foreground/80">
                Trusted by 50,000+ members across East Africa
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              The Future of{" "}
              <span className="text-gradient-gold">Digital Banking</span>{" "}
              in Africa
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-primary-foreground/60">
              SmartSCCO delivers enterprise-grade financial infrastructure — secure transactions, 
              intelligent loan management, and real-time analytics — built for the next billion users.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-accent text-primary-foreground px-8 text-base font-semibold shadow-hero hover:opacity-90 transition-opacity"
              >
                Request a Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full glass">
                  <Play className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
                </div>
                Watch Overview
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex items-center gap-8">
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-primary-foreground">99.9%</span>
                <span className="text-xs text-primary-foreground/50">Uptime SLA</span>
              </div>
              <div className="h-8 w-px bg-primary-foreground/10" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-primary-foreground">256-bit</span>
                <span className="text-xs text-primary-foreground/50">AES Encryption</span>
              </div>
              <div className="h-8 w-px bg-primary-foreground/10" />
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-primary-foreground">PCI DSS</span>
                <span className="text-xs text-primary-foreground/50">Compliant</span>
              </div>
            </div>
          </motion.div>

          {/* Right — hero image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="SmartSCCO Banking Dashboard"
                className="w-full rounded-2xl shadow-hero"
              />
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-8 glass rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/20">
                    <span className="text-lg">📈</span>
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/60">Monthly Volume</p>
                    <p className="font-display text-lg font-bold text-primary-foreground">$12.4M</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
