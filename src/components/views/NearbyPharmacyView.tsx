import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Search,
  Phone,
  Navigation,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Map,
  List,
  Pill,
  Star,
} from 'lucide-react';

export const NearbyPharmacyView: React.FC = () => {
  const { pharmacies } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [medFilter, setMedFilter] = useState('Atorvastatin');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filteredPharmacies = pharmacies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStockBadge = (status: 'available' | 'low_stock' | 'call_to_confirm' | 'unavailable') => {
    switch (status) {
      case 'available':
        return (
          <span className="stock-tag-accent uppercase">
            IN STOCK
          </span>
        );
      case 'low_stock':
        return (
          <span className="font-mono text-[11px] px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase">
            LOW STOCK
          </span>
        );
      case 'call_to_confirm':
        return (
          <span className="font-mono text-[11px] px-2 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold uppercase">
            CONFIRM STOCK
          </span>
        );
      case 'unavailable':
        return (
          <span className="font-mono text-[11px] px-2 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold uppercase">
            OUT OF STOCK
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Section matching provided HTML design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end border-b-2 border-[#e2e4e9] pb-6 pt-2">
        <div className="md:col-span-2 space-y-1">
          <div className="label-meta flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ffa3] animate-pulse"></span>
            Geolocation Active
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Pharmacy Finder
          </h2>
        </div>

        <div className="flex flex-col md:items-end gap-3">
          <p className="label-meta text-slate-400 max-w-xs md:text-right leading-relaxed">
            Find open pharmacies nearby, check real-time prescription medicine availability, and get direct directions.
          </p>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-[#141619] p-1 rounded border border-[#1e2229]">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-[#00ffa3] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'map' ? 'bg-[#00ffa3] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Grid matching provided HTML */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[#1e2229] border border-[#1e2229] p-[1px]">
        <div className="md:col-span-2 relative bg-[#0b0c0d]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pharmacies by name or street address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-[#0b0c0d] text-white font-mono text-xs outline-none focus:bg-[#141619] transition-colors"
          />
        </div>

        <div className="bg-[#0b0c0d]">
          <select
            value={medFilter}
            onChange={(e) => setMedFilter(e.target.value)}
            className="w-full p-4 bg-[#0b0c0d] text-[#00ffa3] font-mono text-xs font-bold outline-none cursor-pointer"
          >
            <option value="Atorvastatin">Check Atorvastatin 20mg Stock</option>
            <option value="Lisinopril">Check Lisinopril 10mg Stock</option>
            <option value="Paracetamol">Check Paracetamol 500mg Stock</option>
            <option value="Amoxicillin">Check Amoxicillin 500mg Stock</option>
          </select>
        </div>
      </div>

      {/* Main Content: List Mode vs Map Mode */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPharmacies.map((pharmacy) => {
            const stockInfo = pharmacy.stockAvailability.find((s) => s.medicationName === medFilter) || {
              status: 'available',
            };

            return (
              <div
                key={pharmacy.id}
                className="bg-[#141619] p-6 border border-[#1e2229] relative group flex flex-col justify-between gap-5 hover:border-[#00ffa3]/50 transition-all"
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ffa3] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="label-meta text-[10px] text-slate-400">
                      {pharmacy.distanceKm} KM • {pharmacy.is24x7 ? 'Open 24/7' : 'Open Now'}
                    </span>
                    <span className="label-meta text-[#00ffa3] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> {pharmacy.rating}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                      {pharmacy.name}
                    </h3>
                    <div className="label-meta text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {pharmacy.address}
                    </div>
                  </div>

                  {/* Stock Status Bar */}
                  <div className="py-3 border-y border-[#1e2229] my-2 flex items-center justify-between">
                    <span className="label-meta">Current Availability</span>
                    {getStockBadge(stockInfo.status as any)}
                  </div>
                </div>

                {/* Action Row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:${pharmacy.phone}`}
                    className="py-3 text-center font-mono text-xs font-bold text-slate-200 border border-[#1e2229] bg-[#0b0c0d] hover:bg-[#1e2229] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#00ffa3]" />
                    <span>Call Store</span>
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 text-center font-mono text-xs font-bold text-black bg-[#e2e4e9] hover:bg-[#00ffa3] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Map View Simulation */
        <div className="bg-[#141619] p-6 border border-[#1e2229] space-y-4">
          <div className="relative w-full h-96 bg-[#0b0c0d] border border-[#1e2229] overflow-hidden flex items-center justify-center">
            {/* Map styling grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#00ffa3_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

            {/* Simulated Map Markers */}
            {filteredPharmacies.map((pharmacy, i) => (
              <div
                key={pharmacy.id}
                className={`absolute p-3 rounded bg-[#141619] border border-[#00ffa3] shadow-2xl flex items-center gap-2.5 transform -translate-x-1/2 -translate-y-1/2 ${
                  i === 0 ? 'top-1/3 left-1/3' : i === 1 ? 'top-1/2 left-2/3' : 'top-2/3 left-1/2'
                }`}
              >
                <div className="w-8 h-8 rounded bg-[#00ffa3] text-black flex items-center justify-center font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-xs text-white font-mono block">{pharmacy.name}</strong>
                  <span className="text-[10px] text-[#00ffa3] font-mono font-bold">{pharmacy.distanceKm} KM • IN STOCK</span>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-4 bg-[#141619] px-3 py-1.5 border border-[#1e2229] text-[11px] font-mono font-bold text-[#00ffa3] shadow-md">
              📍 GPS RADIAL: 3.0 KM AREA
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
