/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const PaymentMethodPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[95vh] md:max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-content-primary font-bold">Payment Method</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Bank Details</div>

          <div>
            <label className="text-sm text-content-secondary block mb-2">Account holder<span className="text-accent-red ml-1">*</span></label>
            <input type="text" className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors" defaultValue="John Doe" />
          </div>
          <div>
            <label className="text-sm text-content-secondary block mb-2">IBAN<span className="text-accent-red ml-1">*</span></label>
            <input type="text" className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors" defaultValue="DE89 3704 0044 0532 0130 00" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-content-secondary block mb-2">BIC<span className="text-accent-red ml-1">*</span></label>
              <input type="text" className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors" defaultValue="COBADEFFXXX" />
            </div>
            <div>
              <label className="text-sm text-content-secondary block mb-2">Credit institute<span className="text-accent-red ml-1">*</span></label>
              <input type="text" className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors" defaultValue="Commerzbank AG" />
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <input type="checkbox" className="mt-1 flex-shrink-0 accent-primary" defaultChecked />
            <p className="text-content-secondary text-xs leading-relaxed">
              I allow FitZone Studio to collect payments from my account via direct debit using the creditors id
              DE02FZS00000123456. I also instruct my credit institute to honour these direct debits for account.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-auto flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm text-white rounded-xl bg-primary hover:bg-primary-hover transition-colors"
          >
            Request Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPopup;
