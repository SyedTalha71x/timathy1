import React, { useState } from "react";
import { Gift } from "lucide-react";

/**
 * BirthdayBadge - A reusable birthday indicator component
 * 
 * @param {boolean} show - Whether to show the badge
 * @param {string} dateOfBirth - Date of birth for age calculation (optional)
 * @param {string} size - Size variant: "xs" | "sm" | "md" | "lg" (default: "md")
 * @param {boolean} withTooltip - Whether to show interactive tooltip on hover (default: false)
 * @param {string} className - Additional CSS classes for positioning (default: "absolute -top-1.5 -right-1.5")
 * @param {string} variant - Display variant: "badge" (absolute positioned) | "inline" (inline with text) (default: "badge")
 */
const BirthdayBadge = ({ 
  show = false, 
  dateOfBirth = null, 
  size = "md",
  withTooltip = false,
  className = "",
  variant = "badge"
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!show) return null;

  // Calculate age from date of birth
  const calculateAge = () => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge();

  // Size configurations for badge variant
  const badgeSizeConfig = {
    xs: {
      wrapper: "p-0.5 border-[1.5px]",
      icon: 6,
      position: "absolute -top-0.5 -right-0.5"
    },
    sm: {
      wrapper: "p-0.5 border-2",
      icon: 8,
      position: "absolute -top-1 -right-1"
    },
    md: {
      wrapper: "p-1 border-[2.5px]",
      icon: 14,
      position: "absolute -top-1.5 -right-1.5"
    },
    lg: {
      wrapper: "p-1.5 border-[3px]",
      icon: 18,
      position: "absolute -top-2 -right-2"
    }
  };

  // Size configurations for inline variant
  const inlineSizeConfig = {
    xs: { wrapper: "p-0.5", icon: 8 },
    sm: { wrapper: "p-0.5", icon: 10 },
    md: { wrapper: "p-1", icon: 12 },
    lg: { wrapper: "p-1", icon: 16 }
  };

  const tooltipTitle = `Birthday today!${age !== null ? ` Turns ${age} years old` : ''}`;

  // Inline variant - simple icon next to text
  if (variant === "inline") {
    const config = inlineSizeConfig[size] || inlineSizeConfig.md;
    
    return (
      <div 
        className={`inline-flex items-center justify-center bg-orange-500 rounded-full ${config.wrapper} flex-shrink-0 ${className}`}
        title={tooltipTitle}
      >
        <Gift size={config.icon} className="text-white" />
      </div>
    );
  }

  // Badge variant - absolute positioned on avatar
  const config = badgeSizeConfig[size] || badgeSizeConfig.md;
  const position = className || config.position;

  // Simple badge with title attribute (no interactive tooltip)
  if (!withTooltip) {
    return (
      <div 
        className={`${position} bg-orange-500 hover:bg-orange-400 rounded-full ${config.wrapper} border-white shadow-lg transition-all duration-200 hover:scale-110 cursor-pointer`}
        title={tooltipTitle}
      >
        <Gift size={config.icon} className="text-white" />
      </div>
    );
  }

  // Badge with interactive tooltip
  return (
    <>
      <div 
        className={`${position} bg-orange-500 hover:bg-orange-400 rounded-full ${config.wrapper} border-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-110`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
      >
        <Gift size={config.icon} className="text-white" />
      </div>
      
      {/* Interactive Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1C1C1C] border border-gray-700 rounded-lg px-3 py-2 shadow-xl z-30 whitespace-nowrap">
          <p className="text-xs text-white font-medium">Birthday today!</p>
          {age !== null && (
            <p className="text-[10px] text-gray-400 mt-0.5">Turns {age} years old</p>
          )}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-[#1C1C1C]"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default BirthdayBadge;
