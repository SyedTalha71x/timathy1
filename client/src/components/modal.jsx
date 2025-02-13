/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';

const Modal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[100]">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
  
        <div className="relative  bg-black rounded-xl shadow-2xl z-[101] p-6 w-[90vw] h-[85vh] max-w-6xl flex flex-col">
          <button
            className="sticky top-2 left-[calc(100%-2.5rem)] z-[102] w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="flex-1 overflow-y-auto mt-2 pr-2 custom-scrollbar">{children}</div>
        </div>
      </div>
    )
  }
  
  export default Modal
  

