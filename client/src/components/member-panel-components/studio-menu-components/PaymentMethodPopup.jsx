/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";


const PaymentMethodPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 max-w-md w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Payment Method</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Account holder*</label>
            <input type="text" className="w-full bg-gray-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base" defaultValue="John Doe" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">IBAN*</label>
            <input type="text" className="w-full bg-gray-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base" defaultValue="DE89 3704 0044 0532 0130 00" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">BIC*</label>
            <input type="text" className="w-full bg-gray-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base" defaultValue="COBADEFFXXX" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Credit institute*</label>
            <input type="text" className="w-full bg-gray-700 text-white rounded-lg p-2 sm:p-3 text-sm sm:text-base" defaultValue="Commerzbank AG" />
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" className="mt-1 flex-shrink-0" defaultChecked />
            <p className="text-gray-300 text-xs sm:text-sm">
              I allow FitZone Studio to collect payments from my account via direct debit using the creditors id
              DE02FZS00000123456. I also instruct my credit institute to honour these direct debits for account.
            </p>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-700 text-white py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base">
            Request change
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPopup;
