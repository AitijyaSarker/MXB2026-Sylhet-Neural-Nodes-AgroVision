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
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');

  useEffect(() => {
    // Load theme and language from localStorage
    const savedLang = localStorage.getItem('agrovision-lang') as Language;
    const savedTheme = localStorage.getItem('agrovision-theme') as 'light' | 'dark';
    const savedUser = localStorage.getItem('user');

    if (savedLang) setLang(savedLang);
    if (savedTheme) setTheme(savedTheme);

    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setUserRole(userData.role || 'farmer');
        setCurrentPage('dashboard');
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setUserRole(userData.role || 'farmer');
        setCurrentPage('dashboard');
      } catch (err) {
        console.error('Error parsing user after login:', err);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole('guest');
    setCurrentPage('home');
    localStorage.removeItem('user');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Hero lang={lang} onGetStarted={() => setCurrentPage('signup')} />;
      case 'login':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-6">
            <Login
              lang={lang}
              onLoginSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setAuthMode('register')}
            />
          </div>
        );
      case 'signup':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-6">
            {authMode === 'register' ? (
              <Register
                lang={lang}
                onRegisterSuccess={() => setAuthMode('login')}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            ) : (
              <Login
                lang={lang}
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            )}
          </div>
        );
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
      default:
        return <Hero lang={lang} onGetStarted={() => setCurrentPage('signup')} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Navbar
        lang={lang}
        theme={theme}
        currentPage={currentPage}
        userRole={userRole}
        onPageChange={setCurrentPage}
        onLangChange={(newLang) => {
          setLang(newLang);
          localStorage.setItem('agrovision-lang', newLang);
        }}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          localStorage.setItem('agrovision-theme', newTheme);
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }}
        onLogout={handleLogout}
      />
      <main className="pt-16 min-h-[calc(100vh-80px)]">
        {renderPage()}
      </main>
      <Footer lang={lang} />
    </div>
  );
};

export default App;