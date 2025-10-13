/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import PopupWrapper from "./PopupWrapper";

const TermsPopup = ({ onClose }) => {
  return (
    <PopupWrapper title="Terms & Conditions" onClose={onClose}>
      <p>These terms and conditions govern your membership at FitZone Studio...</p>
      <p>1. Membership fees are due monthly in advance.</p>
      <p>2. Cancellation requires 1 month notice.</p>
      <p>3. Studio rules must be followed at all times.</p>
    </PopupWrapper>
  );
};

export default TermsPopup;
