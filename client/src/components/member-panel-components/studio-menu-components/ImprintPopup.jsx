/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import PopupWrapper from "./PopupWrapper";

const ImprintPopup = ({ onClose, studio }) => {
  return (
    <PopupWrapper title="Imprint" onClose={onClose}>
      <p>
        <strong>{studio?.studioName}</strong>
      </p>
      <p>
        {studio?.street}<br />
        {studio?.zipCode} {studio?.city} {studio?.country}
      </p>
      <p>
        Phone: {studio?.phone}
        <br />
        Email: {studio?.email}
      </p>
      <p>
        Managing Director: {studio?.studioOwner}
        <br />
        Commercial Register: Not Provided
      </p>
    </PopupWrapper>
  );
};

export default ImprintPopup;
