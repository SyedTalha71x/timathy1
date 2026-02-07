/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { IoIosSend, IoIosClose } from "react-icons/io";

// ============================================
// Default Access Email Templates
// ============================================
const DEFAULT_EMAIL_TEMPLATES = {
  de: {
    label: "Deutsch",
    flag: "🇩🇪",
    subject: "Dein Zugang für {studioName}",
    body: `Hallo {firstName},

willkommen bei {studioName}! Dein Zugang wurde erfolgreich eingerichtet.

Bitte klicke auf den folgenden Link, um dein Passwort festzulegen und auf die Umgebung zuzugreifen:

{accessLink}

Deine Zugangsdaten:
• E-Mail: {email}
• Studio: {studioName}

Falls du Fragen hast, kannst du dich jederzeit an uns wenden.

Viele Grüße,
Das {studioName} Team`,
  },
  en: {
    label: "English",
    flag: "🇬🇧",
    subject: "Your Access for {studioName}",
    body: `Hello {firstName},

welcome to {studioName}! Your access has been successfully set up.

Please click the following link to set your password and access the environment:

{accessLink}

Your access details:
• Email: {email}
• Studio: {studioName}

If you have any questions, feel free to reach out to us at any time.

Best regards,
The {studioName} Team`,
  },
  fr: {
    label: "Français",
    flag: "🇫🇷",
    subject: "Votre accès pour {studioName}",
    body: `Bonjour {firstName},

bienvenue chez {studioName} ! Votre accès a été configuré avec succès.

Veuillez cliquer sur le lien suivant pour définir votre mot de passe et accéder à l'environnement :

{accessLink}

Vos identifiants :
• E-mail : {email}
• Studio : {studioName}

Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe {studioName}`,
  },
  es: {
    label: "Español",
    flag: "🇪🇸",
    subject: "Tu acceso para {studioName}",
    body: `Hola {firstName},

¡bienvenido/a a {studioName}! Tu acceso ha sido configurado exitosamente.

Por favor, haz clic en el siguiente enlace para establecer tu contraseña y acceder al entorno:

{accessLink}

Tus datos de acceso:
• Correo electrónico: {email}
• Estudio: {studioName}

Si tienes alguna pregunta, no dudes en contactarnos.

Saludos cordiales,
El equipo de {studioName}`,
  },
  it: {
    label: "Italiano",
    flag: "🇮🇹",
    subject: "Il tuo accesso per {studioName}",
    body: `Ciao {firstName},

benvenuto/a su {studioName}! Il tuo accesso è stato configurato con successo.

Clicca sul seguente link per impostare la tua password e accedere all'ambiente:

{accessLink}

I tuoi dati di accesso:
• Email: {email}
• Studio: {studioName}

Se hai domande, non esitare a contattarci.

Cordiali saluti,
Il team di {studioName}`,
  },
};

// ============================================
// Helper: Replace template variables
// ============================================
const replaceVariables = (text, variables) => {
  if (!text) return "";
  let result = text;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value || "");
  });
  return result;
};

// ============================================
// SendEmailModal Component
// ============================================
const SendEmailModal = ({
  isOpen,
  onClose,
  demo,
  onSend,
  mode = "create", // "create" | "resend"
  emailTemplates: externalTemplates,
}) => {
  const [selectedLang, setSelectedLang] = useState("de");
  const [showPreview, setShowPreview] = useState(false);

  // Use external templates if provided, otherwise use defaults
  const templates = externalTemplates || DEFAULT_EMAIL_TEMPLATES;
  const languageKeys = Object.keys(templates);

  const isResend = mode === "resend";

  // Template variables from demo config
  const variables = useMemo(
    () => ({
      firstName: demo?.config?.firstName || demo?.config?.studioOwnerFirstName || demo?.config?.name || "",
      lastName: demo?.config?.lastName || demo?.config?.studioOwnerLastName || "",
      email: demo?.config?.email || "",
      studioName: demo?.config?.studioName || "",
      accessLink: demo?.config?.accessLink || "https://app.example.com/set-password?token=...",
    }),
    [demo]
  );

  // Current template with variables replaced
  const currentTemplate = templates[selectedLang];
  const previewSubject = replaceVariables(currentTemplate?.subject || "", variables);
  const previewBody = replaceVariables(currentTemplate?.body || "", variables);

  if (!isOpen) return null;

  const handleSend = () => {
    onSend(true, {
      language: selectedLang,
      subject: previewSubject,
      body: previewBody,
      template: currentTemplate,
    });
    onClose();
  };

  const handleSkip = () => {
    if (isResend) {
      onClose();
    } else {
      onSend(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] rounded-xl max-w-lg w-full border border-gray-800 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex justify-between items-start flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 ${isResend ? "bg-orange-500" : "bg-blue-500"} rounded-full flex items-center justify-center flex-shrink-0`}>
              <IoIosSend size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isResend ? "Resend Access Email?" : "Send Access Email?"}
              </h2>
              <p className="text-gray-400 text-sm mt-0.5">
                {isResend
                  ? "Send the access details to the user again"
                  : "Notify the user about their access"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <IoIosClose size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Language Tabs */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
              Email Language
            </label>
            <div className="flex flex-wrap gap-1.5 bg-[#141414] rounded-xl p-1.5 border border-[#2a2a2a]">
              {languageKeys.map((langKey) => {
                const lang = templates[langKey];
                const isActive = selectedLang === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => setSelectedLang(langKey)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-[#252525]"
                    }`}
                  >
                    <span className="text-base leading-none">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3.5 mb-4">
            <p className="text-blue-400 text-sm">
              {isResend ? (
                <>
                  The access details will be resent to{" "}
                  <strong className="text-blue-300">{demo?.config?.email}</strong>{" "}
                  for{" "}
                  <strong className="text-blue-300">{demo?.config?.studioName}</strong>.
                </>
              ) : (
                <>
                  An email will be sent to{" "}
                  <strong className="text-blue-300">{demo?.config?.email}</strong>{" "}
                  with instructions to set up their password and access{" "}
                  <strong className="text-blue-300">{demo?.config?.studioName}</strong>.
                </>
              )}
            </p>
          </div>

          {/* Email Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#141414] rounded-xl border border-[#2a2a2a] text-sm text-gray-300 hover:border-[#3a3a3a] transition-colors mb-4"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview
            </span>
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                showPreview ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Email Preview Content */}
          {showPreview && (
            <div className="bg-[#141414] rounded-xl border border-[#2a2a2a] overflow-hidden mb-4">
              {/* Subject */}
              <div className="px-4 py-3 border-b border-[#2a2a2a]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                  Subject
                </span>
                <p className="text-white text-sm mt-1 font-medium">
                  {previewSubject}
                </p>
              </div>

              {/* Recipient */}
              <div className="px-4 py-2.5 border-b border-[#2a2a2a] flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                  To
                </span>
                <span className="text-gray-300 text-sm">
                  {demo?.config?.email}
                </span>
              </div>

              {/* Body */}
              <div className="px-4 py-4">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {previewBody}
                </pre>
              </div>

              {/* Selected Language Badge */}
              <div className="px-4 py-2.5 border-t border-[#2a2a2a] flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Template: {currentTemplate?.flag} {currentTemplate?.label}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleSend}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <IoIosSend />
              {currentTemplate?.flag}{" "}
              {isResend ? "Resend Email" : "Yes, Send Email Now"} ({currentTemplate?.label})
            </button>

            <button
              onClick={handleSkip}
              className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              {isResend ? "Cancel" : "Skip for Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmailModal;
