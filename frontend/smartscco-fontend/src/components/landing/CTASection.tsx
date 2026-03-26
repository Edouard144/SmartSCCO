import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-hero px-8 py-20 text-center sm:px-16"
        >
          {/* Decorative */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
              Ready to Transform Banking?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-primary-foreground/60">
              Join the growing network of financial institutions modernizing with SmartSCCO.
              Schedule a demo to see the platform in action.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-accent text-primary-foreground px-10 text-base font-semibold shadow-hero hover:opacity-90"
              >
                Schedule Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              >
                Download Pitch Deck
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
