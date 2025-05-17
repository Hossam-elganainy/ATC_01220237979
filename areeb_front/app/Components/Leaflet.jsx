'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import customIcon from '../leafletIcon'; // Import custom icon
import { Home, MapPin } from 'lucide-react';

export default function MapComponent() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await fetch('https://areeb.cowdly.com/en/api/branches/');
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    }
    fetchBranches();
  }, []);

  return (
    <MapContainer
      center={[24.7, 46.7]}
      zoom={5}
      className="w-full h-[60vh] rounded-lg shadow-lg"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {branches.map((branch) => (
        <Marker
          key={branch.id}
          position={[parseFloat(branch.latitude), parseFloat(branch.longitude)]}
          icon={customIcon}
        >
          <Popup>
            <div className="flex flex-col items-start p-3">
              {/* Branch Name */}
              <div className="flex items-center gap-2">
                <Home className="text-teal-700" size={20} />
                <p className="font-bold text-teal-700">{branch.name}</p>
              </div>

              {/* Branch Address */}
              <div className="flex items-center gap-2">
                <MapPin className="text-sky-600" size={20} />
                <p className="font-medium text-sky-600">{branch.address}</p>
              </div>

              {/* Google Maps Link */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-3 py-1 hover:text-sky-600 rounded-md text-sm transition"
              >
                فتح في خرائط Google
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}