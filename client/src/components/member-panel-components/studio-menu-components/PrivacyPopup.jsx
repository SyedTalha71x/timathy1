/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import PopupWrapper from "./PopupWrapper";

const PrivacyPopup = ({ onClose }) => {
  return (
    <PopupWrapper title="Privacy Policy" onClose={onClose}>
      <p>We respect your privacy and are committed to protecting your personal data...</p>
      <p>Data collected: Name, address, contact information, payment details.</p>
      <p>Data usage: Membership management, communication, billing.</p>
      <p>Data retention: As long as membership is active plus legal requirements.</p>
    </PopupWrapper>
  );
};

export default PrivacyPopup;
