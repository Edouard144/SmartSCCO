import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "Metrics", href: "#metrics" },
    { label: "Platform", href: "#platform" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-dark"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-accent">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-primary-foreground">
            Smart<span className="text-gradient-gold">SCCO</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle variant="nav" />
          <Link to="/login">
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-accent text-primary-foreground hover:opacity-90 shadow-hero">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="text-primary-foreground md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-dark border-t border-primary-foreground/10 md:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-primary-foreground/70"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link to="/register">
              <Button className="bg-gradient-accent text-primary-foreground mt-2 w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
