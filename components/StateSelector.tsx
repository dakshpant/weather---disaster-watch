import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { AVAILABLE_LOCATIONS, MockLocation } from '../services/weatherService';

export const StateSelector: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredLocations = AVAILABLE_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (location: MockLocation) => {
    navigate(`/analysis/${location}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-fortis-muted group-focus-within:text-fortis-primary transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-fortis-surface border border-fortis-surface text-fortis-text placeholder-fortis-muted focus:outline-none focus:border-fortis-primary focus:ring-1 focus:ring-fortis-primary transition-all"
          placeholder="Search state for analysis..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="h-1.5 w-1.5 bg-fortis-primary animate-pulse"></div>
        </div>
      </div>

      {isOpen && (query || filteredLocations.length > 0) && (
        <div className="absolute z-20 w-full mt-1 bg-fortis-surface border border-fortis-surface shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => handleSelect(loc)}
                className="w-full text-left px-4 py-3 text-fortis-text hover:bg-fortis-bg hover:text-fortis-primary flex justify-between items-center group transition-colors"
              >
                <span>{loc}</span>
                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-fortis-primary" />
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-fortis-muted text-sm">No locations found</div>
          )}
        </div>
      )}
      
      {isOpen && (
        <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};
