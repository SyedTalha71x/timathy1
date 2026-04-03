/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useTranslation } from "react-i18next";
import PopupWrapper from "./PopupWrapper";

const PrivacyPopup = ({ onClose, studio }) => {
  const { t } = useTranslation();

  const hasCustomContent = studio?.privacyPolicy && studio.privacyPolicy !== "<p><br></p>"

  return (
    <PopupWrapper title={t("studioMenu.info.privacy")} onClose={onClose}>
      {hasCustomContent ? (
        <div dangerouslySetInnerHTML={{ __html: studio.privacyPolicy }} />
      ) : (
        <>
          <p>{t("studioMenu.popup.privacyPlaceholder", "No privacy policy has been provided yet.")}</p>
        </>
      )}
    </PopupWrapper>
  );
};

export default PrivacyPopup;
