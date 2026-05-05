import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/src/services/supabase';
import { UserProfile } from '@/src/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deductCredit: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setProfile: (profile) => set({ profile }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      set({ profile: data as UserProfile });
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
      
      set({ profile: newProfile as UserProfile });
    }
  },
  deductCredit: async () => {
    const { user, profile } = get();
    if (!user || !profile || profile.credits <= 0) return;

    // Update local state instantly for snappy UI
    set({ profile: { ...profile, credits: profile.credits - 1 } });

    // Attempt to update database (will fail silently if table doesn't exist, preserving local state)
    try {
      await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', user.id);
    } catch (e) {
      console.warn("Could not update credits in database", e);
    }
  },
}));
