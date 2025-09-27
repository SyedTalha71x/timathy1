/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { X, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';

const StudioFinancesModal = ({ 
  isOpen, 
  onClose, 
  studio, 
  studioFinances = {},
  financesPeriod,
  onPeriodChange
}) => {
  if (!isOpen || !studio) return null;

  const currentFinances = studioFinances[studio.id]?.[financesPeriod];
  
  // Calculate success rate safely
  const calculateSuccessRate = () => {
    if (!currentFinances || currentFinances.totalRevenue === 0) return 0;
    return (currentFinances.successfulPayments / currentFinances.totalRevenue) * 100;
  };

  const successRate = calculateSuccessRate();

  return (
    <div className="fixed inset-0 w-full open_sans_font h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-4xl my-8 relative">
        <div className="lg:p-6 p-3 custom-scrollbar overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white open_sans_font_700 text-lg font-semibold">
              {studio.name} - Finances
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-400 block mb-2">Observation Period</label>
            <select
              value={financesPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="bg-[#101010] rounded-xl px-4 py-2 text-white outline-none text-sm border border-gray-700"
            >
              <option value="overall">Overall</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {currentFinances ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#161616] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="text-green-500" size={24} />
                    <h3 className="text-white font-medium">Total Revenue</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-500">
                    €{currentFinances.totalRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="bg-[#161616] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="text-green-500" size={24} />
                    <h3 className="text-white font-medium">Successful Payments</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-500">
                    €{currentFinances.successfulPayments.toLocaleString()}
                  </p>
                </div>

                <div className="bg-[#161616] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="text-yellow-500" size={24} />
                    <h3 className="text-white font-medium">Pending Payments</h3>
                  </div>
                  <p className="text-2xl font-bold text-yellow-500">
                    €{currentFinances.pendingPayments.toLocaleString()}
                  </p>
                </div>

                <div className="bg-[#161616] rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="text-red-500" size={24} />
                    <h3 className="text-white font-medium">Failed Payments</h3>
                  </div>
                  <p className="text-2xl font-bold text-red-500">
                    €{currentFinances.failedPayments.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-[#161616] rounded-xl p-4">
                <h4 className="text-white font-medium mb-3">Payment Success Rate</h4>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${successRate}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {successRate.toFixed(1)}% success rate
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No financial data available for this studio.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioFinancesModal;