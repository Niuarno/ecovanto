import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-center px-4 text-[#F4F4F0] select-none">
      <div className="space-y-6 max-w-md">
        <span className="text-xs font-mono tracking-[0.3em] text-[#8A8A8A] uppercase">
          VOID / 404
        </span>
        <h1 className="text-4xl sm:text-6xl font-light font-display tracking-widest uppercase text-white">
          PAGE VACANT
        </h1>
        <p className="text-xs font-mono text-[#8A8A8A] leading-relaxed">
          The requested coordinate has been decommissioned or relocated within the archive.
        </p>

        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO ARCHIVE HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
