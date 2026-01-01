
import React, { useState } from 'react';
import { SpecialistMessenger } from './SpecialistMessenger';
import { Language } from '../../types';
import { LayoutDashboard, MessageSquare, Calendar, Users, Bell, Search, Settings } from 'lucide-react';

interface SpecialistDashboardProps {
  lang: Language;
}

export const SpecialistDashboard: React.FC<SpecialistDashboardProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'messenger' | 'stats' | 'appointments'>('messenger');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Specialist Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <LayoutDashboard className="text-green-700 dark:text-green-400" />
            {lang === 'bn' ? 'বিশেষজ্ঞ ড্যাশবোর্ড' : 'Specialist Dashboard'}
          </h1>
          <p className="text-zinc-500 mt-2">{lang === 'bn' ? 'স্বাগতম, আপনার পরামর্শের জন্য কৃষকরা অপেক্ষা করছেন।' : 'Welcome back, farmers are waiting for your advice.'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
             <Bell className="w-6 h-6 text-zinc-400 cursor-pointer hover:text-green-600 transition-colors" />
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white flex items-center justify-center rounded-full font-bold">5</div>
          </div>
          <div className="h-10 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700">
             <img src="https://picsum.photos/100/100?person=1" className="w-8 h-8 rounded-full" alt="avatar" />
             <div className="text-left">
                <p className="text-xs font-bold leading-none">Dr. Rafiqul</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">Plant Pathologist</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'messenger', label: lang === 'bn' ? 'মেসেঞ্জার' : 'Messenger', icon: MessageSquare },
            { id: 'stats', label: lang === 'bn' ? 'পরিসংখ্যান' : 'Analytics', icon: LayoutDashboard },
            { id: 'appointments', label: lang === 'bn' ? 'অ্যাপয়েন্টমেন্ট' : 'Appointments', icon: Calendar },
            { id: 'farmers', label: lang === 'bn' ? 'আমার কৃষক' : 'My Farmers', icon: Users },
            { id: 'settings', label: lang === 'bn' ? 'সেটিংস' : 'Settings', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 min-h-[600px]">
          {activeTab === 'messenger' ? (
            <SpecialistMessenger lang={lang} />
          ) : (
            <div className="bg-white dark:bg-zinc-800 p-12 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-700 flex flex-col items-center justify-center text-center">
               <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-full mb-6">
                 <LayoutDashboard className="w-12 h-12 text-zinc-300" />
               </div>
               <h3 className="text-2xl font-bold mb-2">{lang === 'bn' ? 'শীঘ্রই আসছে' : 'Coming Soon'}</h3>
               <p className="text-zinc-500 max-w-sm">{lang === 'bn' ? 'আমরা এই ফিচারটি আপনার জন্য তৈরি করছি।' : 'We are currently building this feature for you.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
