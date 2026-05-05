import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Navbar } from '@/src/components/layout/Navbar';
import { Footer } from '@/src/components/layout/Footer';
import { Landing } from '@/src/pages/Landing';
import { Dashboard } from '@/src/pages/Dashboard';
import { Login } from '@/src/pages/Auth/Login';
import { Register } from '@/src/pages/Auth/Register';
import { Pricing } from '@/src/pages/Pricing';
import { ApiDocs } from '@/src/pages/ApiDocs';
import { supabase } from '@/src/services/supabase';
import { useAuthStore } from '@/src/store/authStore';

export default function App() {
  const { setUser, setProfile, isLoading } = useAuthStore();

  const fetchProfile = async (user: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data) {
        setProfile(data as any);
      } else if (error && (error.code === 'PGRST116' || error.code === 'PGRST205')) {
        // Table doesn't exist or no row exists. Try to create the row.
        let newProfile = null;
        
        if (error.code === 'PGRST116') {
          const { data: insertedData } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url,
              credits: 5,
              subscription_status: 'free'
            })
            .select()
            .single();
            
          newProfile = insertedData;
        }

        // If insert failed (e.g. table doesn't exist PGRST205) or we couldn't insert, use local fallback
        if (!newProfile) {
          newProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url,
            credits: 5,
            subscription_status: 'free'
          };
        }
        
        setProfile(newProfile as any);
      }
    } catch (e) {
      console.error("Error fetching profile", e);
    }
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    // 2. Listen for Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors theme="dark" />
      </BrowserRouter>
    </TooltipProvider>
  );
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <Component />;
}
