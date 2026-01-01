
import React from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { Language } from '../types';

interface MapComponentProps {
  lang: Language;
}

export const MapComponent: React.FC<MapComponentProps> = ({ lang }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-bold">{lang === 'bn' ? 'অফিসের তালিকা' : 'Office List'}</h3>
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 hover:border-green-500 transition-all cursor-pointer group shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{lang === 'bn' ? `কৃষি সম্প্রসারণ অফিস ${i}` : `Upazila Agri Office ${i}`}</h4>
                  <p className="text-xs text-zinc-500 mt-1">2.4 km {lang === 'bn' ? 'দূরে' : 'away'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="md:col-span-3 relative h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
          {/* Placeholder for real map */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `url('https://picsum.photos/1200/800?map')`,
            backgroundSize: 'cover'
          }} />
          
          <div className="z-10 text-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-sm border border-zinc-100 dark:border-zinc-800">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold mb-2">{lang === 'bn' ? 'ম্যাপ লোড হচ্ছে' : 'Initializing Map'}</h3>
            <p className="text-zinc-500 text-sm mb-6">
              {lang === 'bn' ? 'আপনার নিকটবর্তী কৃষি সাহায্য কেন্দ্রগুলো ম্যাপে দেখতে জিওলোকেশন ব্যবহার করুন।' : 'Using geolocation to find your nearest agriculture assistance centers on the map.'}
            </p>
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/20">
              {lang === 'bn' ? 'লোকেশন অনুমতি দিন' : 'Grant Location Access'}
            </button>
          </div>
          
          {/* Mock Markers */}
          <div className="absolute top-1/4 left-1/3 z-10 animate-pulse">
            <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 z-10 animate-pulse delay-700">
            <MapPin className="w-10 h-10 text-green-600 drop-shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
