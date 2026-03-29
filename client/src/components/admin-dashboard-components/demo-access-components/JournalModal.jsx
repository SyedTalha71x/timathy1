/* eslint-disable react/prop-types */
import { IoIosClose, IoIosJournal } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { useTranslation } from "react-i18next";

// Map known English action strings to i18n keys
const ACTION_KEY_MAP = {
  "Access Created": "admin.demoAccess.journal.accessCreated",
  "Access created": "admin.demoAccess.journal.accessCreated",
  "Access Activated": "admin.demoAccess.journal.accessActivated",
  "Access activated": "admin.demoAccess.journal.accessActivated",
  "Access Deactivated": "admin.demoAccess.journal.accessDeactivated",
  "Access deactivated": "admin.demoAccess.journal.accessDeactivated",
  "Access Updated": "admin.demoAccess.journal.accessUpdated",
  "Access updated": "admin.demoAccess.journal.accessUpdated",
  "Email Sent": "admin.demoAccess.journal.emailSent",
  "Email sent": "admin.demoAccess.journal.emailSent",
};

const JournalModal = ({ isOpen, onClose, demo }) => {
  const { t, i18n } = useTranslation();
  if (!isOpen || !demo) return null;

  const getLocale = () => {
    const lang = i18n.language;
    if (lang === "de") return "de-DE";
    if (lang === "fr") return "fr-FR";
    if (lang === "es") return "es-ES";
    if (lang === "it") return "it-IT";
    return "en-US";
  };

  // Translate known action strings, pass through already-translated ones
  const translateAction = (action) => {
    const key = ACTION_KEY_MAP[action];
    if (key) return t(key);
    return action;
  };

  // Translate known detail patterns from dummy data
  const translateDetails = (details) => {
    if (!details) return "";
    const createdMatch = details.match(/^Created for (.+)$/i);
    if (createdMatch) return t("admin.demoAccess.journal.createdFor", { name: createdMatch[1] });
    const updatedMatch = details.match(/^Updated for (.+)$/i);
    if (updatedMatch) return t("admin.demoAccess.journal.updatedFor", { name: updatedMatch[1] });
    const emailMatch = details.match(/^Email sent to (.+?)(\s*\(|$)/i);
    if (emailMatch) return t("admin.demoAccess.journal.emailSentTo", { email: emailMatch[1] }) + (details.includes("(") ? " (" + details.split("(").slice(1).join("(") : "");
    const reactivatedMatch = details.match(/^Reactivated for (\d+)/i);
    if (reactivatedMatch) return t("admin.demoAccess.journal.reactivatedFor", { days: reactivatedMatch[1] });
    if (/expired.*auto/i.test(details)) return t("admin.demoAccess.journal.expiredAutoDeactivated");
    if (/status.*inactive/i.test(details)) return t("admin.demoAccess.journal.statusInactive");
    return details;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString(getLocale(), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-800">
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <IoIosJournal size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t("admin.demoAccess.journalModal.title")}</h2>
              <p className="text-gray-400 text-sm mt-1">{demo.config.studioName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoIosClose size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {demo.journal && demo.journal.length > 0 ? (
            <div className="space-y-4">
              {demo.journal.map((entry, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4 pb-4 relative">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-white">{translateAction(entry.action)}</h3>
                    <span className="text-xs text-gray-400">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">{translateDetails(entry.details)}</p>
                  <div className="flex items-center gap-2">
                    <FaHistory className="text-gray-500 text-xs" />
                    <span className="text-xs text-gray-500">{t("admin.demoAccess.journalModal.by")}: {entry.user}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IoIosJournal size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">{t("admin.demoAccess.journalModal.noActivity")}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
