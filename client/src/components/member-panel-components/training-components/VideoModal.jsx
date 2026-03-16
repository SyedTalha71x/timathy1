/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Plus, RotateCcw, RotateCw } from 'lucide-react';
import { haptic } from '../../../utils/haptic';

const VideoModal = ({
  isOpen,
  video,
  onClose,
  onAddToPlan
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowControls(true);
    }
  }, [isOpen]);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    } else {
      resetControlsTimer();
    }
    return () => { if (controlsTimeout.current) clearTimeout(controlsTimeout.current); };
  }, [isPlaying, resetControlsTimer]);

  const togglePlay = () => {
    if (videoRef.current) {
      haptic.light();
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
      haptic.light();
      if (isMuted) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume;
      } else {
        videoRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      haptic.light();
      videoRef.current.currentTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration
      );
      resetControlsTimer();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Seek via progress bar click/drag
  const seekFromEvent = (e) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = x / rect.width;
    const newTime = pct * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressMouseDown = (e) => {
    setIsSeeking(true);
    seekFromEvent(e);

    const handleMouseMove = (ev) => seekFromEvent(ev);
    const handleMouseUp = () => {
      setIsSeeking(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleProgressTouchStart = (e) => {
    setIsSeeking(true);
    seekFromEvent(e.touches[0]);

    const handleTouchMove = (ev) => {
      ev.preventDefault();
      seekFromEvent(ev.touches[0]);
    };
    const handleTouchEnd = () => {
      setIsSeeking(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isPlaying, isMuted, duration]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-600';
      case 'intermediate':
        return 'bg-yellow-600';
      case 'advanced':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 p-2 sm:p-4">
      <div className="bg-surface-base rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-content-primary pr-4 truncate">
              {video.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-button rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-content-muted" />
            </button>
          </div>

          {/* Video Player */}
          <div
            className="relative bg-black rounded-xl overflow-hidden mb-4 sm:mb-6 group"
            onMouseMove={resetControlsTimer}
            onClick={(e) => {
              if (e.target === videoRef.current) togglePlay();
            }}
          >
            <video
              ref={videoRef}
              className="w-full h-48 sm:h-64 md:h-96 cursor-pointer"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={video.videoUrl?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Center play overlay when paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play size={28} className="text-white ml-1" />
                </div>
              </button>
            )}

            {/* Controls overlay */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-10 pb-2 px-2 sm:px-4 sm:pb-3 transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Progress bar */}
              <div
                ref={progressRef}
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress hover:h-2.5 transition-all relative"
                onMouseDown={handleProgressMouseDown}
                onTouchStart={handleProgressTouchStart}
              >
                <div
                  className="bg-primary h-full rounded-full transition-[width] relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  onClick={() => skip(-10)}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  title="Back 10s"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  onClick={() => skip(10)}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  title="Forward 10s"
                >
                  <RotateCw size={16} />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    onClick={toggleMute}
                    className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/vol:w-16 sm:group-hover/vol:w-20 transition-all duration-200 accent-primary h-1 cursor-pointer opacity-0 group-hover/vol:opacity-100"
                  />
                </div>

                <span className="text-white text-xs sm:text-sm ml-1 tabular-nums select-none">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="flex-1" />

                <button
                  onClick={handleFullscreen}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  title="Fullscreen (f)"
                >
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-content-primary mb-3">
                About This Exercise
              </h3>
              <p className="text-content-muted mb-4 text-sm sm:text-base">
                {video.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-content-faint text-sm">Duration:</span>
                  <span className="text-content-primary text-sm">{video.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-content-faint text-sm">Difficulty:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(
                      video.difficulty
                    )}`}
                  >
                    {video.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-content-primary mb-3">
                Exercise Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-content-muted mb-2">
                    Target Muscles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {video.targetMuscles?.map((muscle, index) => (
                      <span
                        key={index}
                        className="bg-primary text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-content-muted mb-2">
                    Equipment Needed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {video.equipment?.map((item, index) => (
                      <span
                        key={index}
                        className="bg-surface-button text-content-secondary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { haptic.light(); onAddToPlan(video) }}
                className="w-full mt-4 sm:mt-6 px-4 py-3 bg-primary hover:bg-primary-hover rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus size={16} />
                Add to Training Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
