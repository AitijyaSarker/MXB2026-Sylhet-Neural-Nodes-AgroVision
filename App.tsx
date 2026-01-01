
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/common/Hero';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { SpecialistDashboard } from './components/specialist/SpecialistDashboard';
import { About } from './components/common/About';
import { Datasets } from './components/common/Datasets';
import { Contact } from './components/common/Contact';
import { Footer } from './components/common/Footer';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Language, UserRole } from './types';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('agrovision-lang') as Language) || 'bn';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('agrovision-theme') as 'light' | 'dark') || 'light';
  });
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  const loadUserProfile = async (user: any, retryCount = 0) => {
    try {
      console.log('Loading user profile for:', user.id);
      console.log('User metadata:', user.user_metadata);
      console.log('User raw_user_meta_data:', user.raw_user_meta_data);
      console.log('User email:', user.email);

      // First try to get role from user metadata (immediate)
      const metadataRole = user.user_metadata?.role || user.raw_user_meta_data?.role;
      if (metadataRole && (metadataRole === 'farmer' || metadataRole === 'specialist')) {
        console.log('✅ Using role from metadata:', metadataRole);
        setUserRole(metadataRole);
        setCurrentPage('dashboard');
        return;
      }

      // Then try to fetch from profile table
      console.log('Fetching profile from database...');
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Profile from database:', profile, 'Error:', error);

      if (profile?.role) {
        console.log('✅ Using role from profile:', profile.role);
        setUserRole(profile.role);
        setCurrentPage('dashboard');
      } else {
        // Profile not found - create it immediately
        console.log('🔄 Profile not found, creating it now...');
        try {
          const metadataRole = user.user_metadata?.role || user.raw_user_meta_data?.role || 'farmer';
          const userName = user.user_metadata?.name || user.raw_user_meta_data?.name || '';
          const userEmail = user.email || '';

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              name: userName,
              email: userEmail,
              role: metadataRole
            })
            .select()
            .single();

          if (createError) {
            console.error('❌ Failed to create profile:', createError);
            console.error('❌ Create error details:', {
              message: createError.message,
              details: createError.details,
              hint: createError.hint,
              code: createError.code
            });
            // If creation fails, try to wait and retry once more
            if (retryCount < 1) {
              console.log('⏳ Retrying profile creation in 2 seconds...');
              setTimeout(() => loadUserProfile(user, retryCount + 1), 2000);
              return;
            }
            setUserRole('farmer');
          } else {
            console.log('✅ Profile created successfully:', newProfile);
            setUserRole(newProfile.role);
          }
        } catch (createErr) {
          console.error('❌ Error creating profile:', createErr);
          setUserRole('farmer');
        }
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.error('❌ Error loading user profile:', err);
      setUserRole('farmer');
      setCurrentPage('dashboard');
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('🔍 Initial session check:', session ? 'Session found' : 'No session');
      if (session) {
        console.log('   User:', session.user.email);
        console.log('   User metadata:', session.user.user_metadata);
      }
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 Loading profile for existing session...');
        await loadUserProfile(session.user);
      } else {
        console.log('🏠 No session, staying on home page');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth state changed:', _event, session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('👤 User signed in, loading profile...');
        await loadUserProfile(session.user);
      } else {
        console.log('🚪 User signed out');
        setUserRole('guest');
        setCurrentPage('home');
      }
    });

    return () => subscription.unsubscribe();
  }, [theme]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero lang={lang} onScanClick={() => {
          if (!user) {
            setCurrentPage('signup');
          } else {
            setCurrentPage('dashboard');
          }
        }} />;
      case 'dashboard':
        return userRole === 'specialist' 
          ? <SpecialistDashboard lang={lang} /> 
          : <FarmerDashboard lang={lang} userRole={userRole} userId={user?.id} />;
      case 'datasets':
        return <Datasets lang={lang} />;
      case 'about':
        return <About lang={lang} />;
      case 'contact':
        return <Contact lang={lang} />;
      case 'signup':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-6">
            {authMode === 'register' ? (
              <Register
                lang={lang}
                onRegisterSuccess={() => {
                  // Registration successful - stay on signup page to show success message
                  // User will need to sign in manually
                  console.log('Registration completed - user needs to sign in');
                }}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            ) : (
              <Login
                lang={lang}
                onLoginSuccess={() => setCurrentPage('dashboard')}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            )}
          </div>
        );
      default:
        return <Hero lang={lang} onScanClick={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'}`}>
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        theme={theme} 
        setTheme={setTheme} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        user={user}
        onLogout={async () => {
          await supabase.auth.signOut();
          setUser(null);
          setUserRole('guest');
          setCurrentPage('home');
        }}
      />
      <main className="pt-16 min-h-[calc(100vh-80px)]">
        {renderPage()}
      </main>
      <Footer lang={lang} />
    </div>
  );
};

export default App;
