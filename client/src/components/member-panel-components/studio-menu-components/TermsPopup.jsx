/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useTranslation } from "react-i18next";
import PopupWrapper from "./PopupWrapper";

const TermsPopup = ({ onClose, studio }) => {
  const { t } = useTranslation();

  const hasCustomContent = studio?.termsAndConditions && studio.termsAndConditions !== "<p><br></p>"

  return (
    <PopupWrapper title={t("studioMenu.info.terms")} onClose={onClose}>
      {hasCustomContent ? (
        <div dangerouslySetInnerHTML={{ __html: studio.termsAndConditions }} />
      ) : (
        <>
          <p>{t("studioMenu.popup.termsPlaceholder", "No terms and conditions have been provided yet.")}</p>
        </>
      )}
    </PopupWrapper>
  );
};

export default TermsPopup;
