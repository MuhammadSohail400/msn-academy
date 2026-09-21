import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';

export default function VideoPlayer({
  videoUrl,
  title,
  durationMinutes = 10,
  onVideoCompleted,
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationMinutes * 60);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasCompletedNotified, setHasCompletedNotified] = useState(false);

  // Fallback demo video if backend URL is token-protected / mock
  const effectiveUrl =
    videoUrl && !videoUrl.includes('stream.msnacademy.pk')
      ? videoUrl
      : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }

      // If watched > 90% and hasn't notified yet, trigger completion
      if (
        !hasCompletedNotified &&
        video.duration &&
        video.currentTime / video.duration >= 0.9
      ) {
        setHasCompletedNotified(true);
        if (onVideoCompleted) {
          onVideoCompleted();
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onVideoCompleted && !hasCompletedNotified) {
        setHasCompletedNotified(true);
        onVideoCompleted();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [hasCompletedNotified, onVideoCompleted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (video) {
      video.volume = val;
      video.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="group relative w-full overflow-hidden rounded-2xl bg-black shadow-lg select-none aspect-video max-h-[520px]"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={effectiveUrl}
        className="h-full w-full object-contain cursor-pointer"
        onClick={togglePlay}
        playsInline
      />

      {/* Center Big Play/Pause Button Overlay */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-opacity"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-2xl transition-transform hover:scale-110 active:scale-95">
            <Play className="h-9 w-9 fill-brand-navy ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Timeline Scrubber Bar */}
        <div className="relative mb-3 flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-600/60 rounded-lg appearance-none cursor-pointer accent-brand-crimson focus:outline-none"
            style={{
              background: `linear-gradient(to right, #990000 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
            }}
          />
        </div>

        {/* Buttons & Time Controls */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left Controls: Play/Pause, Replay, Volume, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1 hover:text-brand-crimson transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime -= 10;
              }}
              className="p-1 hover:text-brand-crimson transition-colors"
              title="Rewind 10s"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 hover:text-brand-crimson transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 h-1 bg-white/30 rounded accent-brand-crimson cursor-pointer"
              />
            </div>

            {/* Time Display */}
            <span className="tabular-nums text-xs text-gray-200 font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: Speed, Fullscreen */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSpeedChange}
              className="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold hover:bg-white/20 transition-colors"
              title="Playback speed"
            >
              {playbackRate}x
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1 hover:text-brand-crimson transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
  title: PropTypes.string,
  durationMinutes: PropTypes.number,
  onVideoCompleted: PropTypes.func,
};
