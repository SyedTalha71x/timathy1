/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import PopupWrapper from "./PopupWrapper";

const ImprintPopup = ({ onClose }) => {
  return (
    <PopupWrapper title="Imprint" onClose={onClose}>
      <p>
        <strong>FitZone Studio GmbH</strong>
      </p>
      <p>
        Pariser Platz 1<br />
        10117 Berlin, Germany
      </p>
      <p>
        Phone: +49 30 1234 5678
        <br />
        Email: info@fitzonestudio.de
      </p>
      <p>
        Managing Director: Max Mustermann
        <br />
        Commercial Register: HRB 12345 B
      </p>
    </PopupWrapper>
  );
};

export default ImprintPopup;
