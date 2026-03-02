import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseConnection, showConnectionError, isIndianISP } from '@/lib/connectionHelper';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isMaster: boolean;
  allowedPages: string[];
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refetchRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [allowedPages, setAllowedPages] = useState<string[]>(['/']);

  useEffect(() => {
    const initAuth = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isConnected = await checkSupabaseConnection(supabaseUrl);

      if (!isConnected && isIndianISP()) {
        toast({
          title: "Connection Issue - India DNS Block",
          description: "Supabase blocked hai India mein. DNS change karo (1.1.1.1) ya VPN use karo. Details: INDIA_DNS_FIX.md",
          variant: "destructive",
          duration: 10000,
        });
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsMaster(false);
          setAllowedPages(['/']);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    }).catch((error) => {
      console.error('Failed to get session:', error);
      if (isIndianISP()) {
        showConnectionError(() => window.location.reload());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, allowed_pages, is_master')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching role:', error);
        return;
      }

      if (data) {
        setIsAdmin(data.role === 'admin');
        setIsMaster(data.is_master || false);
        setAllowedPages(data.allowed_pages || ['/']);
      }
    } catch (err) {
      console.error('Error in fetchUserRole:', err);
    }
  };

  const refetchRole = async () => {
    if (user) {
      await fetchUserRole(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
          if (isIndianISP()) {
            toast({
              title: "Connection Failed - India DNS Block",
              description: "Supabase India mein block hai. DNS change karo (1.1.1.1) ya VPN use karo.",
              variant: "destructive",
              duration: 10000,
            });
            showConnectionError(() => window.location.reload());
          }
        }
      }

      return { error: error as Error | null };
    } catch (err) {
      console.error('Sign in error:', err);
      if (isIndianISP()) {
        showConnectionError(() => window.location.reload());
      }
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsMaster(false);
    setAllowedPages(['/']);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAdmin,
      isMaster,
      allowedPages,
      signIn,
      signOut,
      refetchRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};