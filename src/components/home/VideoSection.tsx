import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';

export const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-20 md:py-32 border-b border-border bg-background select-none transition-colors">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-muted uppercase mb-8">
          <span>[ 06 ]</span>
          <span>CINEMATOGRAPHY // RUNWAY REEL</span>
        </div>

        {/* Video Canvas Container */}
        <div
          data-cursor="view"
          data-cursor-text="PLAY/MUTE"
          className="relative aspect-[16/9] md:aspect-[21/9] bg-surface border border-border overflow-hidden group"
        >
          <video
            ref={videoRef}
            src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-black-dress-41398-large.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/40" />

          {/* Floating Controls */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
            <button
              onClick={togglePlay}
              data-cursor="link"
              className="p-2.5 bg-background/70 hover:bg-background text-foreground border border-border backdrop-blur-md transition-colors"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={toggleMute}
              data-cursor="link"
              className="p-2.5 bg-background/70 hover:bg-background text-foreground border border-border backdrop-blur-md transition-colors"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Video Metadata & Action Content */}
          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-muted uppercase">
                MOTION STUDY NO. 09
              </span>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-light font-display tracking-widest uppercase text-foreground">
                A VISION IN <span className="font-serif italic font-normal text-stroke">MOTION</span>
              </h3>
              <p className="text-xs font-light text-foreground-secondary max-w-md">
                Exploring kinetic drapery, reflective fabrics, and silhouette transformation under fluctuating strobe lighting.
              </p>
            </div>

            <Link
              to="/campaign"
              data-cursor="link"
              className="px-6 py-3.5 bg-foreground text-background font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center space-x-2 self-start md:self-auto group"
            >
              <span>DISCOVER FULL FILM</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
