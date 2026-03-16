/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Edit,
  Trash2,
} from "lucide-react";
import LanguageTabs, { getTranslation, getOptionName } from "../shared/LanguageTabs";

export default function ViewExerciseModal({
  isOpen,
  selectedVideo,
  onClose,
  videoRef,
  isPlaying,
  isMuted,
  currentTime,
  duration,
  togglePlay,
  toggleMute,
  handleTimeUpdate,
  handleLoadedMetadata,
  formatTime,
  getDifficultyColor,
  openEditModal,
  setVideoToDelete,
  openDeleteModal,
  setIsPlaying,
  muscleOptions,
  equipmentOptions,
}) {
  const [viewLang, setViewLang] = useState("en");

  if (!isOpen || !selectedVideo) return null;

  const exerciseName = getTranslation(selectedVideo.name, viewLang);
  const exerciseDescription = getTranslation(
    selectedVideo.description,
    viewLang
  );

  const getMuscleDisplayName = (muscleId) => {
    const muscle = muscleOptions?.find((m) => m.id === muscleId);
    return muscle ? getOptionName(muscle, viewLang) : muscleId;
  };

  const getEquipmentDisplayName = (equipId) => {
    const equip = equipmentOptions?.find((e) => e.id === equipId);
    return equip ? getOptionName(equip, viewLang) : equipId;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-end sm:items-center justify-center sm:p-4 z-50">
      <div className="bg-[#1C1C1C] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl sm:mx-auto h-[92vh] sm:h-auto sm:max-h-[80vh] overflow-y-auto custom-scrollbar border-t sm:border border-[#333333] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#1C1C1C] z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-[#333333] flex-shrink-0 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate mr-2">
              {exerciseName}
            </h2>
            <button
              onClick={() => {
                onClose();
                setIsPlaying(false);
              }}
              className="p-2 hover:bg-[#2F2F2F] rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Language Tabs */}
          <LanguageTabs
            selectedLang={viewLang}
            onSelect={setViewLang}
            translations={selectedVideo.name}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Video Player */}
          <div className="relative bg-black rounded-xl overflow-hidden mb-6">
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
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <div className="flex-1 flex items-center gap-2 text-xs sm:text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-white/20 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all"
                      style={{
                        width: `${(currentTime / duration) * 100}%`,
                      }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>

                <button className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Exercise Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                Exercise Information
              </h3>

              <div className="bg-[#161616] rounded-xl p-4 space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Description:</span>
                  <p className="text-white text-sm mt-1">
                    {exerciseDescription}
                  </p>
                  {viewLang !== "en" && !selectedVideo.description?.[viewLang]?.trim() && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      Showing English fallback
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Difficulty:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs text-white ${getDifficultyColor(
                      selectedVideo.difficulty
                    )}`}
                  >
                    {selectedVideo.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Duration:</span>
                  <span className="text-white text-sm">
                    {selectedVideo.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Uploaded:</span>
                  <span className="text-white text-sm">
                    {selectedVideo.uploadedAt}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Uploaded by:</span>
                  <span className="text-white text-sm">
                    {selectedVideo.uploadedBy}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                Target Muscles & Equipment
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Target Muscles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.targetMuscles.map((muscleId, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {getMuscleDisplayName(muscleId)}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Equipment Needed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.equipment.map((equipId, index) => (
                      <span
                        key={index}
                        className="bg-[#2F2F2F] text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                      >
                        {getEquipmentDisplayName(equipId)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    onClose();
                    openEditModal(selectedVideo);
                  }}
                  className="flex-1 px-3 py-2.5 bg-blue-600 text-sm hover:bg-blue-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit Exercise
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setVideoToDelete(selectedVideo);
                    openDeleteModal();
                  }}
                  className="px-3 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
