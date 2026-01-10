import React, { useState, useEffect, useRef } from 'react';
import { Scanner } from '../Scanner';
import { ChatBot } from '../ChatBot';
import { MapComponent } from '../MapComponent';
import { UserRole, Language, Specialist, Conversation, Message } from '../../types';
import { translations } from '../../translations';
import { MessageSquare, MapPin, Search, Bell, Users, LayoutDashboard, Send } from 'lucide-react';
import { dbService } from '../../mongodb';

interface DashboardProps {
  lang: Language;
  userRole: UserRole;
  userId?: string;
  user?: any; // Add user prop
}

export const FarmerDashboard: React.FC<DashboardProps> = ({ lang, userRole, userId, user }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'chat' | 'offices' | 'specialists' | 'messages' | 'profile'>('scan');
  const [consulting, setConsulting] = useState<Specialist | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Set user profile from props
    if (user) {
      setUserProfile(user);
    }

    console.log('🚀 Loading specialists for farmer dashboard') ;

    const loadSpecialists = async () => {
      console.log('🔍 Loading specialists for user:', userId);
      try {
        const { data, error } = await dbService.getSpecialists();
        console.log('📊 Specialists query result:', { data, error });

        if (error) {
          console.error('❌ Error loading specialists:', error);
          setSpecialists([]);
          return;
        }

        if (data && data.length > 0) {
          console.log('✅ Found specialists:', data.length);
          // Convert profiles to Specialist format
          const specialistList: Specialist[] = data.map((profile, index) => {
            console.log('👤 Processing specialist:', profile);
            return {
              id: profile._id || profile.id,
              name: profile.name,
              institution: 'BARI', // Default, could be extended
              department: 'Plant Pathology', // Default, could be extended
              location: 'Gazipur', // Default, could be extended
              image: profile.avatar || `https://picsum.photos/100/100?person=${index + 1}`,
              online: true // Default, could be extended
            };
          });
          console.log('🎯 Final specialist list:', specialistList);
          setSpecialists(specialistList);
        } else {
          console.log('⚠️ No specialists found in database');
          setSpecialists([]);
        }
      } catch (err) {
        console.error('💥 Exception loading specialists:', err);
        setSpecialists([]);
      }
    };
    console.log('-----------------------------------------',userId)  ;
    const loadConversations = async () => {
      if (!userId) return;

      const { data, error } = await dbService.getConversationsForFarmer(userId);
         console.log('✅ Loaded conversations for farmer:', data);
      if (data && !error) {

        // Load messages for each conversation
        const conversationsWithMessages = await Promise.all(
          data.map(async (conv) => {
            const { data: messages } = await dbService.getMessages(conv.id);
            const messagesFormatted: Message[] = (messages || []).map(msg => ({
              id: msg.id,
              senderId: msg.sender_id,
              senderName: msg.sender_id === userId ? 'You' : conv.specialistName,
              text: msg.text,
              timestamp: new Date(msg.created_at),
              isFromFarmer: msg.sender_id === userId
            }));

            return {
              ...conv,
              messages: messagesFormatted
            };
          })
        );

        setConversations(conversationsWithMessages);
        // Calculate unread messages
        const totalUnread = conversationsWithMessages.reduce((sum, conv) => {
          return sum + (conv.unreadCount || 0);
        }, 0);
        setUnreadCount(totalUnread);
      }
    };

    loadSpecialists();
    loadConversations();
  }, [userId, user]);

  useEffect(() => {
    if (selectedConv && userId) {
      const subscription = dbService.subscribeToMessages(selectedConv.id, async (payload) => {
        // Reload messages for this conversation
        const { data: messages } = await dbService.getMessages(selectedConv.id);
        const messagesFormatted: Message[] = (messages || []).map(msg => ({
          id: msg.id,
          senderId: msg.sender_id,
          senderName: msg.sender_id === userId ? 'You' : selectedConv.specialistName,
          text: msg.text,
          timestamp: new Date(msg.created_at),
          isFromFarmer: msg.sender_id === userId
        }));

        setSelectedConv(prev => prev ? {
          ...prev,
          messages: messagesFormatted,
          lastMessage: payload.new.text,
          timestamp: new Date(payload.new.created_at)
        } : null);

        // Update conversations list
        setConversations(prev => prev.map(c =>
          c.id === selectedConv.id
            ? { ...c, lastMessage: payload.new.text, timestamp: new Date(payload.new.created_at) }
            : c
        ));
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedConv?.id, userId]);

  const t = (key: string) => translations[key]?.[lang] || key;

  const handleConsult = (specialist: Specialist) => {
    setConsulting(specialist);
    setSentSuccess(false);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !userId || !consulting) return;

    try {
      // Create conversation ID as farmerId-specialistId
      const conversationId = `${userId}-${consulting.id}`;

      // Send message to database
      await dbService.sendMessage(conversationId, userId, messageText.trim());

      console.log(`Message sent to ${consulting.name}: ${messageText}`);

      setMessageText('');
      setSentSuccess(true);
      setTimeout(() => {
        setConsulting(null);
        setSentSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error - maybe show error message
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'scan':
        return <Scanner lang={lang} userId={userId} />;
      case 'chat':
        return <ChatBot lang={lang} />;
      case 'offices':
        return <MapComponent lang={lang} />;
      case 'specialists':
        return (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Debug info */}
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                🔍 Debug: {specialists.length} specialists loaded
                {specialists.length > 0 && (
                  <span className="ml-2">
                    (Names: {specialists.map(s => s.name).join(', ')})
                  </span>
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {specialists.length > 0 ? specialists.map(s => (
                <div key={s.id} className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-all group">
                  <div className="relative mb-4">
                    <img src={s.image} className="w-20 h-20 rounded-2xl object-cover" alt={s.name} />
                    {s.online && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 border-2 border-white dark:border-zinc-800 rounded-full" />}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-zinc-900 dark:text-white">{s.name}</h3>
                  <p className="text-zinc-700 dark:text-zinc-500 text-sm font-bold mb-1">{s.institution} • {s.department}</p>
                  <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 text-xs font-black mb-4 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    {s.location}
                  </div>
                  <button
                    onClick={() => handleConsult(s)}
                    className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] shadow-lg shadow-green-700/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {lang === 'bn' ? 'পরামর্শ নিন' : 'Consult Now'}
                  </button>
                </div>
              )) : (
                <div className="col-span-3 text-center py-12">
                  <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-full mx-auto w-fit mb-6">
                    <Users className="w-12 h-12 text-zinc-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{lang === 'bn' ? 'কোনো বিশেষজ্ঞ পাওয়া যায়নি' : 'No Specialists Found'}</h3>
                  <p className="text-zinc-500 max-w-md mx-auto">{lang === 'bn' ? 'এখনও কোনো বিশেষজ্ঞ রেজিস্ট্রেশন করেননি। পরে আবার চেক করুন।' : 'No specialists have registered yet. Please check back later.'}</p>
                </div>
              )}
            </div>
        );
      case 'messages':
        return (
          <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-700 shadow-2xl overflow-hidden flex h-[650px] animate-in slide-in-from-right-8 duration-500">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-zinc-100 dark:border-zinc-800 flex flex-col">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-xl font-black mb-4">{lang === 'bn' ? 'আমার বার্তা' : 'My Messages'}</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-6 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${
                      selectedConv?.id === conv.id
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-600'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <img src={conv.farmerImage} className="w-12 h-12 rounded-2xl object-cover" alt="Specialist" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm truncate">{conv.specialistName}</h4>
                        <span className="text-[10px] text-zinc-400">5m</span>
                      </div>
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <div className="p-6 text-center text-zinc-500">
                    {lang === 'bn' ? 'এখনও কোনো বার্তা নেই' : 'No messages yet'}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Window */}
            {selectedConv ? (
              <div className="flex-1 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
                <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={selectedConv.farmerImage} className="w-10 h-10 rounded-xl" alt={selectedConv.specialistName} />
                    <div>
                      <h3 className="font-bold text-sm">{selectedConv.specialistName}</h3>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedConv.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isFromFarmer ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${
                        msg.isFromFarmer
                          ? 'bg-green-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-zinc-800 rounded-tl-none border border-zinc-100 dark:border-zinc-700'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center gap-1 text-[10px] mt-2 ${msg.isFromFarmer ? 'justify-end' : 'justify-start'} opacity-70`}>
                          <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-full mx-auto w-fit mb-6">
                  <MessageSquare className="w-12 h-12 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-bold">{lang === 'bn' ? 'বার্তা নির্বাচন করুন' : 'Select a Conversation'}</h3>
                <p className="text-zinc-500 max-w-xs">{lang === 'bn' ? 'বাম পাশের তালিকা থেকে কোনো বিশেষজ্ঞের সাথে কথা বলা শুরু করুন।' : 'Choose a specialist from the list on the left to start chatting.'}</p>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">{lang === 'bn' ? 'প্রোফাইল' : 'Profile'}</h2>
            {userProfile && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={userProfile.avatar || `https://picsum.photos/100/100?person=${userId}`} className="w-20 h-20 rounded-full border-4 border-green-500" alt="Profile" />
                    <button
                      onClick={() => {
                        const avatars = [
                          'https://picsum.photos/100/100?person=1',
                          'https://picsum.photos/100/100?person=2',
                          'https://picsum.photos/100/100?person=3',
                          'https://picsum.photos/100/100?person=4',
                          'https://picsum.photos/100/100?person=5'
                        ];
                        const currentIndex = avatars.indexOf(userProfile.avatar) || 0;
                        const nextAvatar = avatars[(currentIndex + 1) % avatars.length];
                        setUserProfile({...userProfile, avatar: nextAvatar});
                      }}
                      className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{userProfile.name}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">{userProfile.email}</p>
                    <p className="text-sm text-green-600 font-bold uppercase">{userProfile.role}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">{lang === 'bn' ? 'নাম' : 'Name'}</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                      className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">{lang === 'bn' ? 'ইমেইল' : 'Email'}</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                  onClick={async () => {
                    // Update profile
                    const { error } = await dbService.updateProfile(userId!, {
                      name: userProfile.name,
                      avatar: userProfile.avatar
                    });
                    if (!error) {
                      // Update localStorage
                      const updatedUser = { ...user, name: userProfile.name, avatar: userProfile.avatar };
                      localStorage.setItem('user', JSON.stringify(updatedUser));
                      alert(lang === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated successfully!');
                    }
                  }}
                >
                  {lang === 'bn' ? 'আপডেট করুন' : 'Update Profile'}
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Consultation Modal - Temporarily commented out */}
      {/* {consulting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-green-700 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={consulting.image} className="w-10 h-10 rounded-full border-2 border-white/50" alt={consulting.name} />
                <div>
                  <h3 className="font-bold">{consulting.name}</h3>
                  <p className="text-xs opacity-80">{consulting.department}</p>
                </div>
              </div>
              <button onClick={() => setConsulting(null)} className="text-2xl font-light hover:rotate-90 transition-transform">&times;</button>
            </div>
            <div className="p-6">
              {sentSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-700">
                    <LayoutDashboard className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-green-800">{lang === 'bn' ? 'বার্তা পাঠানো হয়েছে!' : 'Message Sent!'}</h4>
                  <p className="text-zinc-700 dark:text-zinc-500 font-bold">{lang === 'bn' ? 'বিশেষজ্ঞ শীঘ্রই আপনার সাথে যোগাযোগ করবেন।' : 'The specialist will contact you shortly.'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-sm font-black text-zinc-700 dark:text-zinc-500 uppercase tracking-widest">{lang === 'bn' ? 'আপনার সমস্যা লিখুন' : 'Describe your problem'}</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={5}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold rounded-2xl outline-none focus:ring-2 ring-green-600"
                    placeholder={lang === 'bn' ? 'যেমন: আমার ধানের পাতায় হলুদ দাগ দেখা যাচ্ছে...' : 'e.g. My rice leaves have yellow spots...'}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="w-full py-4 bg-green-700 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {lang === 'bn' ? 'পাঠান' : 'Send Message'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-3 text-zinc-900 dark:text-white">
            <LayoutDashboard className="text-green-700 dark:text-green-400" />
            {lang === 'bn' ? 'কৃষক ড্যাশবোর্ড' : 'Farmer Dashboard'}
          </h1>
          <p className="text-zinc-700 dark:text-zinc-500 mt-2 font-bold">{lang === 'bn' ? 'স্বাগতম! আপনার ফসল আজ কেমন আছে?' : 'Welcome back! How are your crops today?'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setNotifications(notifications.length > 0 ? [] : [{ id: 1, message: 'New message from specialist', time: '2 min ago' }])}
              className="relative p-2 text-zinc-700 dark:text-zinc-400 hover:text-green-700 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-[10px] text-white flex items-center justify-center rounded-full font-bold">
                  {unreadCount}
                </div>
              )}
            </button>
            {/* Notifications dropdown - Temporarily commented out */}
            {/* {notifications.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notif: any) => (
                    <div key={notif.id} className="p-4 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                      <p className="text-sm text-zinc-900 dark:text-white">{notif.message}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
          <div className="h-10 w-[1px] bg-zinc-300 dark:bg-zinc-800" />
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700">
            <img src={userProfile?.avatar || `https://picsum.photos/32/32?person=${userId}`} className="rounded-full border border-zinc-200" alt="avatar" />
            <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{userProfile?.name || 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-fit">
        {[
          { id: 'scan', label: lang === 'bn' ? 'ফসল স্ক্যান' : 'Crop Scan', icon: Search },
          { id: 'chat', label: lang === 'bn' ? 'এআই চ্যাটবট' : 'AI ChatBot', icon: MessageSquare },
          { id: 'offices', label: lang === 'bn' ? 'নিকটবর্তী অফিস' : 'Nearby Offices', icon: MapPin },
          { id: 'specialists', label: lang === 'bn' ? 'বিশেষজ্ঞগণ' : 'Specialists', icon: Users },
          { id: 'messages', label: lang === 'bn' ? 'বার্তা' : 'Messages', icon: MessageSquare },
          { id: 'profile', label: lang === 'bn' ? 'প্রোফাইল' : 'Profile', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-700 text-green-700 dark:text-green-400 shadow-sm'
                : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
        {/* Debug Button */}
        <button
          onClick={async () => {
            console.log('🔍 Debug: Checking specialists...');
            console.log('Current specialists state:', specialists);
            console.log('Specialists length:', specialists.length);

            const { data, error } = await dbService.getSpecialists();
            console.log('📊 Specialists from database:', data);
            console.log('Error:', error);

            if (data && data.length > 0) {
              alert(`${data.length} specialists found in database`);
            } else {
              alert('No specialists found in database');
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-black transition-all bg-red-500 text-white hover:bg-red-600 text-sm"
        >
          Debug Specialists
        </button>
      </div>

      <div className="min-h-[500px]">
        <div>Test</div>
      </div>
    </div>
  );
};

export default FarmerDashboard;