import { Logo } from '@/src/components/Logo';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered background removal for professionals. Fast, precise, and high-quality processing in seconds.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link to="/api-docs" className="hover:text-primary">API Reference</Link></li>
              <li><Link to="/showcase" className="hover:text-primary">Showcase</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/cookie" className="hover:text-primary">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SnapCut AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">Twitter</span>T</a>
            <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">GitHub</span>G</a>
            <a href="#" className="text-muted-foreground hover:text-primary"><span className="sr-only">LinkedIn</span>L</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
