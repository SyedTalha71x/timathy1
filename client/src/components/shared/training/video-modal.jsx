/* eslint-disable react/prop-types */
import { X, Pause, Play, VolumeX, Volume2, Maximize, Plus } from "lucide-react";

const VideoModal = ({
  isVideoModalOpen,
  selectedVideo,
  setIsVideoModalOpen,
  setSelectedVideo,
  setIsPlaying,
  togglePlay,
  isPlaying,
  toggleMute,
  isMuted,
  videoRef,
  handleTimeUpdate,
  handleLoadedMetadata,
  currentTime,
  duration,
  formatTime,
  getDifficultyColor,
  setVideoToAdd,
  setIsAddToPlanModalOpen,
}) => {
  if (!isVideoModalOpen || !selectedVideo) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[80] p-2 sm:p-4"
      onClick={() => {
        setIsVideoModalOpen(false);
        setSelectedVideo(null);
        setIsPlaying(false);
      }}
    >
      <div 
        className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white pr-4 truncate">
              {selectedVideo.title}
            </h2>
            <button
              onClick={() => {
                setIsVideoModalOpen(false);
                setSelectedVideo(null);
                setIsPlaying(false);
              }}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden mb-4 sm:mb-6">
            <video
              ref={videoRef}
              className="w-full h-48 sm:h-64 md:h-96"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={selectedVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={togglePlay}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <div className="flex-1 flex items-center gap-2 text-xs sm:text-sm text-white">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-white/20 rounded-full h-1">
                    <div
                      className="bg-orange-500 h-1 rounded-full transition-all"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
                <button className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white">
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                About This Exercise
              </h3>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                {selectedVideo.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Duration:</span>
                  <span className="text-white text-sm">{selectedVideo.duration}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Difficulty:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(
                      selectedVideo.difficulty
                    )}`}
                  >
                    {selectedVideo.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                Exercise Details
              </h3>
              <div className="space-y-4">
                {selectedVideo.targetMuscles && selectedVideo.targetMuscles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Target Muscles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.targetMuscles.map((muscle, index) => (
                        <span
                          key={index}
                          className="bg-orange-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedVideo.equipment && selectedVideo.equipment.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Equipment Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="bg-[#2F2F2F] text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Plan Button - nur anzeigen wenn die Handler vorhanden sind */}
              {setVideoToAdd && setIsAddToPlanModalOpen && (
                <button
                  onClick={() => {
                    setVideoToAdd(selectedVideo);
                    setIsAddToPlanModalOpen(true);
                  }}
                  className="w-full mt-4 sm:mt-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus size={16} />
                  Add to Training Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
