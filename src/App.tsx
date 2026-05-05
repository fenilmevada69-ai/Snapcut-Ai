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

import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        <Route path="/api-docs" element={<PageTransition><ApiDocs /></PageTransition>} />
        <Route path="/dashboard" element={<ProtectedRoute component={() => <PageTransition><Dashboard /></PageTransition>} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

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
            <AnimatedRoutes />
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
