import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 text-foreground select-none transition-colors duration-300">
      <div className="max-w-md space-y-6">
        <span className="text-xs font-mono tracking-[0.3em] text-muted uppercase">
          ERROR 404 // NON-EXISTENT COORDINATES
        </span>
        <h1 className="text-6xl sm:text-8xl font-light font-display tracking-widest text-foreground uppercase">
          VOID
        </h1>
        <p className="text-xs font-mono text-muted leading-relaxed">
          The requested archival silhouette or route does not exist within the current Ecovanto repertory.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO SANCTUARY</span>
        </Link>
      </div>
    </div>
  );
};
