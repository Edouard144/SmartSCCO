import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            Smart<span className="text-gradient-gold">SCCO</span>
          </span>
        </div>

        <div className="flex gap-8 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          <a href="#" className="hover:text-foreground transition-colors">Careers</a>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SmartSCCO. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
