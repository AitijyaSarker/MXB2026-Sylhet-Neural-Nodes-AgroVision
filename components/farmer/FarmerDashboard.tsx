import React, { useState } from 'react';
import { Scanner } from './Scanner';
import { ChatBot } from './ChatBot';
import { MapComponent } from './MapComponent';
import { UserRole, Language, Specialist } from '../../types';
import { translations } from '../../translations';
import { MessageSquare, MapPin, Search, Bell, Users, LayoutDashboard, Send } from 'lucide-react';
import { dbService } from '../../supabase';

interface DashboardProps {
  lang: Language;
  userRole: UserRole;
  userId?: string;
}

const specialists: Specialist[] = [
  { id: '1', name: 'Dr. Rafiqul Islam', institution: 'BARI', department: 'Plant Pathology', location: 'Gazipur', image: 'https://picsum.photos/100/100?person=1', online: true },
  { id: '2', name: 'Sabrina Akter', institution: 'BAU', department: 'Entomology', location: 'Mymensingh', image: 'https://picsum.photos/100/100?person=2', online: true },
  { id: '3', name: 'Mustafa Kamal', institution: 'Agri Dept', department: 'Field Officer', location: 'Bogra', image: 'https://picsum.photos/100/100?person=3', online: false },
];

export const FarmerDashboard: React.FC<DashboardProps> = ({ lang, userRole, userId }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'chat' | 'offices' | 'specialists'>('scan');
  const [consulting, setConsulting] = useState<Specialist | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const t = (key: string) => translations[key]?.[lang] || key;

  const handleConsult = (specialist: Specialist) => {
    setConsulting(specialist);
    setSentSuccess(false);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !userId) return;
    
    console.log(`Message to ${consulting?.name}: ${messageText}`);
    
    setMessageText('');
    setSentSuccess(true);
    setTimeout(() => {
      setConsulting(null);
      setSentSuccess(false);
    }, 2000);
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
          <div className="grid md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            {specialists.map(s => (
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
            ))}
          </div>
        );
      default:
        return <Scanner lang={lang} userId={userId} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Consultation Modal */}
      {consulting && (
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
      )}

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
             <Bell className="w-6 h-6 text-zinc-700 dark:text-zinc-400 cursor-pointer hover:text-green-700 transition-colors" />
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-[10px] text-white flex items-center justify-center rounded-full font-bold">2</div>
          </div>
          <div className="h-10 w-[1px] bg-zinc-300 dark:bg-zinc-800" />
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700">
             <img src="https://picsum.photos/32/32" className="rounded-full border border-zinc-200" alt="avatar" />
             <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">Ahmed Ali</span>
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
      </div>

      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};