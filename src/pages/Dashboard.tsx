import { useState, useEffect } from 'react';
import { UploadArea } from '@/src/components/dashboard/UploadArea';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  History,
  Download,
  Trash2,
  Search,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { supabase } from '@/src/services/supabase';
import { useAuthStore } from '@/src/store/authStore';
import { UploadRecord } from '@/src/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function Dashboard() {
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile, refreshProfile } = useAuthStore();

  const fetchUploads = async () => {
    if (!user) return;

    // 1. Fast load from local storage
    const localKey = `snapcut_uploads_${user.id}`;
    const localStr = localStorage.getItem(localKey);
    if (localStr) {
      setUploads(JSON.parse(localStr));
      setIsLoading(false);
    }

    // 2. Fetch fresh from Supabase
    const { data } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      // 3. Merge data: if local knows it's 'completed' but Supabase says 'processing', trust local.
      let mergedData = [...data] as UploadRecord[];
      if (localStr) {
        const localData = JSON.parse(localStr) as UploadRecord[];
        mergedData = mergedData.map(remoteItem => {
          const localItem = localData.find(l => l.id === remoteItem.id);
          // If local has the result but DB hasn't caught up, use local
          if (localItem && localItem.status === 'completed' && remoteItem.status !== 'completed') {
            return localItem;
          }
          return remoteItem;
        });
      }

      setUploads(mergedData);
      localStorage.setItem(localKey, JSON.stringify(mergedData));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUploads();

    // Subscribe to changes
    const channel = supabase
      .channel('uploads_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'uploads',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchUploads();
        refreshProfile();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('uploads').delete().eq('id', id);

      if (error) throw error;

      // Instantly update local state for snappy UI
      setUploads(prev => prev.filter(item => item.id !== id));

      // Update local storage so it doesn't reappear on reload before DB syncs
      if (user) {
        const localKey = `snapcut_uploads_${user.id}`;
        const existingLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
        const updatedLocal = existingLocal.filter((item: any) => item.id !== id);
        localStorage.setItem(localKey, JSON.stringify(updatedLocal));
      }

      toast.success('Record deleted successfully');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between gap-8 py-8 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Workspace</h1>
          <p className="text-muted-foreground">Manage and process your creative assets.</p>
        </div>

        <div className="flex gap-3">
          <Card className="px-5 py-3 bg-white/[0.02] border-white/5 text-center min-w-[100px]">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Credits</p>
            <p className="text-xl font-bold text-primary">{profile?.credits || 0}</p>
          </Card>
          <Card className="px-5 py-3 bg-white/[0.02] border-white/5 text-center min-w-[100px]">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Plan</p>
            <p className="text-xl font-bold text-white uppercase text-[10px] mt-1">{profile?.subscription_status || 'Free'}</p>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Work Area */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <UploadArea onComplete={fetchUploads} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-lg font-bold tracking-tight">Recent Activity</h2>
              </div>
              <Button variant="link" size="sm" className="text-muted-foreground text-xs">View all</Button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />
                ))
              ) : uploads.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-sm text-muted-foreground">No recent activity detected.</p>
                </div>
              ) : (
                uploads.map((upload) => (
                  <Card key={upload.id} className="p-3 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] flex items-center gap-4 transition-colors rounded-2xl group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/20 flex-shrink-0 border border-white/5">
                      <img
                        src={upload.result_url || upload.original_url}
                        alt={upload.file_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold truncate text-sm">{upload.file_name}</span>
                        {upload.status === 'completed' && <CheckCircle className="w-3 h-3 text-primary" />}
                        {upload.status === 'failed' && <AlertCircle className="w-3 h-3 text-destructive" />}
                        {upload.status === 'processing' && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                        <span>{new Date(upload.created_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className={upload.status === 'completed' ? 'text-primary' : ''}>
                          {upload.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {upload.result_url && (
                        <a href={upload.result_url} download target="_blank" rel="noreferrer">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(upload.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar / Info */}
        <div className="space-y-8">
          <Card className="p-8 bg-white border-none text-black overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
              <Zap className="w-5 h-5 fill-current" /> Pro Plan
            </h3>
            <p className="text-sm text-black/70 mb-8 relative z-10">
              Unlock unlimited high-resolution processing and API priority access.
            </p>
            <Button className="w-full bg-black text-white hover:bg-black/90 font-bold rounded-full h-12 relative z-10">
              Upgrade Now
            </Button>
          </Card>

          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resources</h3>
            <div className="grid gap-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-primary/30 transition-colors cursor-pointer">
                <p className="text-sm font-bold mb-1 flex items-center gap-2">
                  Best Practices <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </p>
                <p className="text-xs text-muted-foreground">Learn how to get the cleanest cuts for complex subjects.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-primary/30 transition-colors cursor-pointer">
                <p className="text-sm font-bold mb-1 flex items-center gap-2">
                  API Keys <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </p>
                <p className="text-xs text-muted-foreground">Generate keys for your third-party integrations.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return <Zap className={className} />;
}
