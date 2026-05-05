import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, Copy, Key, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ApiDocs() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const codeSample = `curl -X POST https://api.snapcut.ai/v1/remove-bg \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@/path/to/image.jpg" \\
  -F "format=png"`;

  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
       <div className="flex flex-col md:flex-row gap-4 items-start mb-12">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Public API Docs</h1>
          <p className="text-muted-foreground">Integrate SnapCut AI directly into your applications and workflows.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 space-y-2 sticky top-24 h-fit">
          <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Introduction</h4>
          <a href="#auth" onClick={(e) => { e.preventDefault(); document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' }); }} className="block text-sm text-primary hover:underline py-1">Authentication</a>
          <a href="#endpoints" onClick={(e) => { e.preventDefault(); document.getElementById('endpoints')?.scrollIntoView({ behavior: 'smooth' }); }} className="block text-sm text-muted-foreground hover:text-primary py-1">Endpoints</a>
          <a href="#rate-limiting" onClick={(e) => { e.preventDefault(); document.getElementById('rate-limiting')?.scrollIntoView({ behavior: 'smooth' }); }} className="block text-sm text-muted-foreground hover:text-primary py-1">Rate Limiting</a>
          <a href="#errors" onClick={(e) => { e.preventDefault(); document.getElementById('errors')?.scrollIntoView({ behavior: 'smooth' }); }} className="block text-sm text-muted-foreground hover:text-primary py-1">Error Codes</a>
        </aside>

        <main className="lg:col-span-3 space-y-16">
          {/* Authentication */}
          <section id="auth" className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> Authentication
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All API requests must include your API key in the <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary">Authorization</code> header. You can generate API keys from your dashboard.
            </p>
            <Card className="p-4 bg-muted border-white/5 font-mono text-sm group relative">
              <code className="text-primary">Authorization: Bearer YOUR_API_KEY</code>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </Card>
          </section>

          {/* Endpoints */}
          <section id="endpoints" className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" /> Endpoints
            </h2>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl glass border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">POST</Badge>
                  <code className="font-bold">/v1/remove-bg</code>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Removes the background from the provided image file or URL.</p>
                
                <h4 className="text-xs uppercase font-bold tracking-widest mb-3">Sample Request</h4>
                <div className="relative group">
                  <pre className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs overflow-auto">
                    {codeSample}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(codeSample)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Rate Limiting */}
          <section id="rate-limiting" className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Rate Limiting
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To ensure stability and fair use, our API is rate-limited based on your current subscription plan.
              The limits are applied per API key.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card className="p-4 glass border-white/5">
                <h4 className="font-bold mb-1">Free Plan</h4>
                <p className="text-2xl font-display text-primary">60 <span className="text-sm text-muted-foreground font-sans">req / minute</span></p>
              </Card>
              <Card className="p-4 glass border-white/5">
                <h4 className="font-bold mb-1">Pro Plan</h4>
                <p className="text-2xl font-display text-primary">600 <span className="text-sm text-muted-foreground font-sans">req / minute</span></p>
              </Card>
            </div>
          </section>

          {/* Error Codes */}
          <section id="errors" className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" /> Error Codes
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use standard HTTP status codes to indicate the success or failure of an API request.
            </p>
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/40">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-bold">Code</th>
                    <th className="px-4 py-3 font-bold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-muted-foreground">
                  <tr>
                    <td className="px-4 py-3 font-mono text-white">200</td>
                    <td className="px-4 py-3">OK - The request was successful.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-destructive">400</td>
                    <td className="px-4 py-3">Bad Request - Invalid parameters or missing image data.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-destructive">401</td>
                    <td className="px-4 py-3">Unauthorized - Invalid or missing API key.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-destructive">429</td>
                    <td className="px-4 py-3">Too Many Requests - Rate limit exceeded.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-destructive">500</td>
                    <td className="px-4 py-3">Server Error - Something went wrong on our end.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Secure Your Keys</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Never share your API keys or expose them in client-side code. Use server-side proxying to protect your credentials and prevent unauthorized usage of your SnapCut AI quota.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
