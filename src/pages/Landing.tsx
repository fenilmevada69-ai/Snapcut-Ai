import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Shield, Zap, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative pt-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Sparkles className="w-3 h-3 text-primary" />
              Trusted by 10,000+ teams globally
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9] text-white">
              Studio quality <br />
              <span className="text-muted-foreground">in one click.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto leading-relaxed">
              Automate your creative workflow with our high-precision AI background removal engine. Built for pros, by pros.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-10 text-base bg-primary hover:bg-primary/90 text-white font-semibold rounded-full glow-sm">
                  Start Building <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/api-docs">
                <Button size="lg" variant="ghost" className="h-14 px-10 text-base hover:bg-white/5 font-semibold rounded-full border border-white/5">
                  Explore API
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-24 relative"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div className="rounded-2xl border border-white/10 overflow-hidden shadow-3xl bg-card/50 backdrop-blur-xl">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070" 
                alt="Product Interface Preview" 
                className="w-full h-auto grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="container mx-auto px-4">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-10 font-bold">Powering the world's most creative teams</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10 border-y border-white/5 filter grayscale opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex justify-center items-center font-display font-bold text-xl">VENTURE</div>
          <div className="flex justify-center items-center font-display font-bold text-xl">LUMINA</div>
          <div className="flex justify-center items-center font-display font-bold text-xl">AETHER</div>
          <div className="flex justify-center items-center font-display font-bold text-xl">NOVA</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Engineered for <br/>Scale and Speed.</h2>
            <p className="text-muted-foreground text-lg">
              We've optimized every layer of the stack to ensure your assets are processed with zero compromising on quality.
            </p>
          </div>
          <Link to="/features">
            <Button variant="link" className="text-primary font-bold gap-2 group">
              View all features <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5 text-primary" />,
              title: "Instant Execution",
              description: "A background removal pipeline that finishes in sub-second times, optimized for high-volume batches."
            },
            {
              icon: <Shield className="w-5 h-5 text-muted-foreground" />,
              title: "Enterprise Security",
              description: "End-to-end encryption and automatic asset purging. Your privacy is baked into our architecture."
            },
            {
              icon: <ImageIcon className="w-5 h-5 text-muted-foreground" />,
              title: "Raw Precision",
              description: "Retain every detail of hair, fur, and translucent objects with our neural masking technology."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              className="p-10 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-lg font-bold mb-4 tracking-tight">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Pricing that fits you.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
            <h3 className="text-xl font-bold mb-2">Essential</h3>
            <p className="text-sm text-muted-foreground mb-8">Perfect for independent creators.</p>
            <div className="text-5xl font-display font-bold mb-8">$0 <span className="text-base font-normal text-muted-foreground tracking-normal">/mo</span></div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> 5 studio-quality exports / day</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Global CDN storage</li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground/50"><XCircle className="w-4 h-4" /> Priority API access</li>
            </ul>
            <Link to="/register">
              <Button variant="outline" className="w-full h-12 rounded-full border-white/10 hover:bg-white/5 font-bold">Start Free</Button>
            </Link>
          </div>
          
          <div className="p-10 rounded-[32px] bg-primary/5 border border-primary/20 relative">
            <div className="absolute top-6 right-6 px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest border border-primary/20">Recommended</div>
            <h3 className="text-xl font-bold mb-2">Professional</h3>
            <p className="text-sm text-muted-foreground mb-8">For high-traffic production teams.</p>
            <div className="text-5xl font-display font-bold mb-8">$19 <span className="text-base font-normal text-muted-foreground tracking-normal">/mo</span></div>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited studio exports</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Bulk processing engine</li>
              <li className="flex items-center gap-3 text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> 24/7 Priority engineering support</li>
            </ul>
            <Link to="/register">
              <Button className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold glow-sm">Get Unlimited Access</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4">
        <div className="relative p-12 md:p-24 rounded-[48px] bg-card border border-white/5 overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10" />
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">Upgrade your creative <br/>workflow today.</h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto">
            Experience the future of asset processing. Secure, fast, and remarkably precise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register">
              <Button className="h-14 px-10 text-base bg-white text-black hover:bg-white/90 font-bold rounded-full">
                Create Free Account
              </Button>
            </Link>
            <Link to="/contact" className="text-sm font-bold text-muted-foreground hover:text-white transition-colors">
              Talk to a consultant →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function XCircle({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
  );
}

