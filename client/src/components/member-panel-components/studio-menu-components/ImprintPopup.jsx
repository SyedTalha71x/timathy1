/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useTranslation } from "react-i18next";
import PopupWrapper from "./PopupWrapper";

const ImprintPopup = ({ onClose, studio }) => {
  const { t } = useTranslation();

  const hasCustomContent = studio?.imprint && studio.imprint !== "<p><br></p>"

  return (
    <PopupWrapper title={t("studioMenu.info.imprint")} onClose={onClose}>
      {hasCustomContent ? (
        <div dangerouslySetInnerHTML={{ __html: studio.imprint }} />
      ) : (
        <>
          <p>
            <strong>{studio?.studioName}</strong>
          </p>
          <p>
            {studio?.street}<br />
            {studio?.zipCode} {studio?.city} {studio?.country}
          </p>
          <p>
            {t("studioMenu.popup.phone")}: {studio?.phone}
            <br />
            {t("studioMenu.personal.email")}: {studio?.email}
          </p>
          <p>
            {t("studioMenu.popup.managingDirector")}: {studio?.studioOwner}
            <br />
            {t("studioMenu.popup.commercialRegister")}: {t("studioMenu.popup.notProvided")}
          </p>
        </>
      )}
    </PopupWrapper>
  );
};

export default ImprintPopup;
