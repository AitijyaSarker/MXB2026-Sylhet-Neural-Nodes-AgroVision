
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Navigation, Info } from 'lucide-react';
import { Language } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  lang: Language;
}

interface Office {
  id: number;
  name: string;
  nameBn: string;
  lat: number;
  lng: number;
  address: string;
  addressBn: string;
}

const agriculturalOffices: Office[] = [
  {
    id: 1,
    name: 'Dhaka Agriculture Office',
    nameBn: 'ঢাকা কৃষি অফিস',
    lat: 23.8103,
    lng: 90.4125,
    address: 'Dhaka, Bangladesh',
    addressBn: 'ঢাকা, বাংলাদেশ'
  },
  {
    id: 2,
    name: 'Chittagong Agriculture Office',
    nameBn: 'চট্টগ্রাম কৃষি অফিস',
    lat: 22.3569,
    lng: 91.7832,
    address: 'Chittagong, Bangladesh',
    addressBn: 'চট্টগ্রাম, বাংলাদেশ'
  },
  {
    id: 3,
    name: 'Khulna Agriculture Office',
    nameBn: 'খুলনা কৃষি অফিস',
    lat: 22.8456,
    lng: 89.5403,
    address: 'Khulna, Bangladesh',
    addressBn: 'খুলনা, বাংলাদেশ'
  },
  {
    id: 4,
    name: 'Rajshahi Agriculture Office',
    nameBn: 'রাজশাহী কৃষি অফিস',
    lat: 24.3636,
    lng: 88.6241,
    address: 'Rajshahi, Bangladesh',
    addressBn: 'রাজশাহী, বাংলাদেশ'
  },
  {
    id: 5,
    name: 'Sylhet Agriculture Office',
    nameBn: 'সিলেট কৃষি অফিস',
    lat: 24.8949,
    lng: 91.8687,
    address: 'Sylhet, Bangladesh',
    addressBn: 'সিলেট, বাংলাদেশ'
  }
];

const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const MapComponent: React.FC<MapComponentProps> = ({ lang }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [nearestOffices, setNearestOffices] = useState<Office[]>(agriculturalOffices);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Set map as loaded after a short delay to ensure DOM is ready
    const timer = setTimeout(() => setMapLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);
          setLocationError(null);

          // Calculate distances and sort offices
          const officesWithDistance = agriculturalOffices.map(office => ({
            ...office,
            distance: haversineDistance(latitude, longitude, office.lat, office.lng)
          })).sort((a, b) => a.distance - b.distance);

          setNearestOffices(officesWithDistance.slice(0, 5));
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(`Location error: ${error.message}`);
          setLoading(false);
          // Fallback to Dhaka if location not available
          setUserLocation({ lat: 23.8103, lng: 90.4125 });
          const officesWithDistance = agriculturalOffices.map(office => ({
            ...office,
            distance: haversineDistance(23.8103, 90.4125, office.lat, office.lng)
          })).sort((a, b) => a.distance - b.distance);
          setNearestOffices(officesWithDistance.slice(0, 5));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setLoading(false);
      setUserLocation({ lat: 23.8103, lng: 90.4125 });
      const officesWithDistance = agriculturalOffices.map(office => ({
        ...office,
        distance: haversineDistance(23.8103, 90.4125, office.lat, office.lng)
      })).sort((a, b) => a.distance - b.distance);
      setNearestOffices(officesWithDistance.slice(0, 5));
    }
  }, []);

  const requestLocation = () => {
    setLoading(true);
    setLocationError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLoading(false);

          const officesWithDistance = agriculturalOffices.map(office => ({
            ...office,
            distance: haversineDistance(latitude, longitude, office.lat, office.lng)
          })).sort((a, b) => a.distance - b.distance);

          setNearestOffices(officesWithDistance.slice(0, 5));
        },
        (error) => {
          setLocationError(`Failed to get location: ${error.message}`);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }
  };

  const defaultCenter = userLocation || { lat: 23.8103, lng: 90.4125 };
  const defaultZoom = userLocation ? 10 : 7;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="mb-4">{lang === 'bn' ? 'লোকেশন লোড হচ্ছে...' : 'Loading location...'}</p>
          <button
            onClick={requestLocation}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            {lang === 'bn' ? 'লোকেশন অনুমতি দিন' : 'Grant Location Access'}
          </button>
          {locationError && (
            <p className="text-red-500 text-sm mt-2">{locationError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-xl font-bold">{lang === 'bn' ? 'নিকটবর্তী কৃষি অফিস' : 'Nearest Agriculture Offices'}</h3>
          {nearestOffices.length > 0 ? nearestOffices.map((office, index) => (
            <div
              key={office.id}
              className={`p-4 bg-white dark:bg-zinc-800 rounded-2xl border transition-all cursor-pointer group shadow-sm ${
                selectedOffice?.id === office.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-zinc-100 dark:border-zinc-700 hover:border-green-500'
              }`}
              onClick={() => setSelectedOffice(office)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg group-hover:bg-green-100 ${
                  selectedOffice?.id === office.id ? 'bg-green-100' : 'bg-green-50 dark:bg-green-900/20'
                }`}>
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">
                    {lang === 'bn' ? office.nameBn : office.name}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    {office.distance ? `${office.distance.toFixed(1)} km ${lang === 'bn' ? 'দূরে' : 'away'}` : 'Calculating...'}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {lang === 'bn' ? office.addressBn : office.address}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-zinc-500 py-8">
              {lang === 'bn' ? 'অফিস লোড হচ্ছে...' : 'Loading offices...'}
            </div>
          )}
        </div>

        <div className="md:col-span-3 relative h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-3xl overflow-hidden shadow-inner">
          {/* Location Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <button
              onClick={requestLocation}
              className="p-3 bg-white dark:bg-zinc-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 transition-all"
              title={lang === 'bn' ? 'আমার লোকেশন খুঁজুন' : 'Find My Location'}
            >
              <Navigation className="w-5 h-5 text-green-600" />
            </button>
            {locationError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 text-xs text-red-600 dark:text-red-400">
                {locationError}
              </div>
            )}
          </div>

          {mapLoaded ? (
            <MapContainer
              center={defaultCenter}
              zoom={defaultZoom}
              style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
              className="rounded-3xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">
                        {lang === 'bn' ? 'আপনার অবস্থান' : 'Your Location'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
              {nearestOffices.map((office) => (
                <Marker key={office.id} position={[office.lat, office.lng]}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-bold text-green-600">
                        {lang === 'bn' ? office.nameBn : office.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {lang === 'bn' ? office.addressBn : office.address}
                      </div>
                      {office.distance && (
                        <div className="text-xs text-gray-500 mt-1">
                          {office.distance.toFixed(1)} km {lang === 'bn' ? 'দূরে' : 'away'}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-zinc-500">{lang === 'bn' ? 'ম্যাপ লোড হচ্ছে...' : 'Loading map...'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
