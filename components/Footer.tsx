import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-fortis-bg border-t border-fortis-surface py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-fortis-muted text-sm">
          &copy; 2024 FORTIS System. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-fortis-muted hover:text-fortis-primary text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-fortis-muted hover:text-fortis-primary text-sm transition-colors">Terms of Service</a>
          <a href="#" className="text-fortis-muted hover:text-fortis-primary text-sm transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
