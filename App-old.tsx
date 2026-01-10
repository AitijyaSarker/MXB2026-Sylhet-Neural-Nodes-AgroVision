
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
import { dbService } from './mongodb';

// Function to setup test data (call this from browser console)
(window as any).setupTestData = () => {
  const STORAGE_KEYS = {
    users: 'agrovision_users',
    messages: 'agrovision_messages',
    scans: 'agrovision_scans'
  };

  // Clear existing data
  localStorage.removeItem(STORAGE_KEYS.users);
  localStorage.removeItem(STORAGE_KEYS.messages);
  localStorage.removeItem(STORAGE_KEYS.scans);

  // Add test users
  const testUsers = [
    {
      _id: 'farmer1',
      email: 'farmer1@example.com',
      name: 'John Farmer',
      role: 'farmer',
      avatar: 'https://picsum.photos/100/100?q=john',
      createdAt: new Date()
    },
    {
      _id: 'farmer2',
      email: 'farmer2@example.com',
      name: 'Jane Farmer',
      role: 'farmer',
      avatar: 'https://picsum.photos/100/100?q=jane',
      createdAt: new Date()
    },
    {
      _id: 'specialist1',
      email: 'specialist1@example.com',
      name: 'Dr. Smith',
      role: 'specialist',
      avatar: 'https://picsum.photos/100/100?q=smith',
      createdAt: new Date()
    },
    {
      _id: 'specialist2',
      email: 'specialist2@example.com',
      name: 'Dr. Johnson',
      role: 'specialist',
      avatar: 'https://picsum.photos/100/100?q=johnson',
      createdAt: new Date()
    }
  ];

  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(testUsers));

  // Add some test messages
  const testMessages = [
    {
      _id: 'msg1',
      conversationId: 'farmer1-specialist1',
      senderId: 'farmer1',
      text: 'Hello Dr. Smith, I have a problem with my tomato plants.',
      createdAt: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      _id: 'msg2',
      conversationId: 'farmer1-specialist1',
      senderId: 'specialist1',
      text: 'Hi John! Can you describe the symptoms you\'re seeing?',
      createdAt: new Date(Date.now() - 3300000) // 55 minutes ago
    },
    {
      _id: 'msg3',
      conversationId: 'farmer2-specialist2',
      senderId: 'farmer2',
      text: 'My corn crops are showing yellow spots.',
      createdAt: new Date(Date.now() - 1800000) // 30 minutes ago
    },
    {
      _id: 'msg4',
      conversationId: 'farmer2-specialist2',
      senderId: 'specialist2',
      text: 'That sounds like corn blight. Let me help you with treatment options.',
      createdAt: new Date(Date.now() - 1500000) // 25 minutes ago
    }
  ];

  localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(testMessages));

  console.log('✅ Test data initialized successfully!');
  console.log('Users:', testUsers.length);
  console.log('Messages:', testMessages.length);
  alert('Test data setup complete! Refresh the page to see the changes.');
};

const App: React.FC = () => {

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

      // Then try to fetch from MongoDB profile table
      console.log('Fetching profile from MongoDB...');
      const { data: profile, error } = await dbService.getProfile(user.id);

      console.log('Profile from MongoDB:', profile, 'Error:', error);

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

          const { data: newProfile, error: createError } = await dbService.createProfile(user.id, userName, userEmail, metadataRole);

          if (createError) {
            console.error('❌ Failed to create profile:', createError);
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

    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('🔍 Found stored user session:', userData.email);
        setUser(userData);
        setUserRole(userData.role);
        setCurrentPage('dashboard');
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    } else {
      console.log('🏠 No stored session, staying on home page');
    }
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
          ? <SpecialistDashboard lang={lang} userId={user?.id} /> 
          : <FarmerDashboard lang={lang} userRole={userRole} userId={user?.id} user={user} />;
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
          // For now, just clear local state since we're not using Supabase auth
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
