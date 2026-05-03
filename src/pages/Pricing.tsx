import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      description: "For casual users and hobbyists.",
      features: [
        "5 images per day",
        "Standard resolution",
        "Limited history (24h)",
        "Community support"
      ],
      cta: "Get Started",
      variant: "outline"
    },
    {
      name: "Pro",
      price: "19",
      description: "For professionals and creators.",
      features: [
        "Unlimited images",
        "Ultra-HD resolution",
        "Full history access",
        "Priority support",
        "API access (1k req/mo)",
        "No watermarks"
      ],
      cta: "Upgrade to Pro",
      variant: "default",
      popular: true
    },
    {
      name: "Enterprise",
      price: "99",
      description: "For teams and high-volume needs.",
      features: [
        "Everything in Pro",
        "Unlimited API access",
        "SLA guarantee",
        "Dedicated manager",
        "Custom integration",
        "Team management"
      ],
      cta: "Contact Sales",
      variant: "outline"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Flexible Plans for Everyone</h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Choose the perfect plan for your creative workflow. Scale as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <Card key={i} className={`p-8 glass flex flex-col h-full relative ${plan.popular ? 'border-primary/50 neon-blue' : 'border-white/5'}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className={`w-4 h-4 ${plan.popular ? 'text-primary' : 'text-green-500'}`} />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              className={`w-full h-12 font-bold ${plan.variant === 'default' ? 'bg-gradient-to-r from-primary to-accent neon-blue' : 'border-white/10 hover:bg-white/5'}`}
              variant={plan.variant as any}
            >
              {plan.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
