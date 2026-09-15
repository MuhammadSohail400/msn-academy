import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings, CheckCircle } from 'lucide-react';

export default function VideoPlayer({ videoUrl, title, isCompleted, onToggleComplete, onNextLesson }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [progress, setProgress] = useState(35); // mock percent
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 group">
      {/* HTML5 Video Element with Fallback Poster */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        poster="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&auto=format&fit=crop&q=80"
      />

      {/* Overlay Play Button when Paused */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all duration-300 group-hover:bg-black/30"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/90 text-white shadow-xl shadow-emerald-500/30 transition-transform duration-300 hover:scale-110">
            <Play className="h-10 w-10 translate-x-0.5 fill-current" />
          </div>
        </div>
      )}

      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/90 truncate max-w-md">{title}</h3>
        <button
          onClick={onToggleComplete}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isCompleted 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          <CheckCircle className={`h-4 w-4 ${isCompleted ? 'fill-emerald-500 text-emerald-950' : ''}`} />
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </button>
      </div>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Timeline Slider */}
        <div className="relative mb-3 h-1.5 w-full bg-white/20 rounded-full cursor-pointer overflow-hidden">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-emerald-400 transition-colors">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-emerald-400 transition-colors">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <span className="text-xs text-white/70 font-mono">08:42 / 24:10</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white bg-white/10 px-2 py-1 rounded"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>{playbackSpeed}x</span>
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-24 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-20">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`w-full px-3 py-1.5 text-left text-xs ${
                        playbackSpeed === s ? 'text-emerald-400 font-bold bg-slate-800' : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={onNextLesson}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Next Lesson →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
