// ============================================
// Admin Panel Configuration States
// Single Source of Truth for all configuration data
// used across the admin panel (email signature, SMTP, etc.)
// ============================================

// Default Communication Settings (Email Signature, etc.)
export const DEFAULT_COMMUNICATION_SETTINGS = {
  emailSignature: {
    en: '<p>Best regards,<br><strong>{Studio_Name} Team</strong></p><p style="color:#888;font-size:12px;">\u{1F4CD} {Studio_Address}<br>\u{1F4DE} {Studio_Phone} \u00B7 \u2709\uFE0F {Studio_Email}<br>\u{1F310} {Studio_Website}</p><p style="color:#aaa;font-size:11px;"><em>This email and any attachments are confidential. If you are not the intended recipient, please notify us immediately.</em></p>',
    de: '<p>Mit freundlichen Gr\u00FC\u00DFen,<br><strong>{Studio_Name} Team</strong></p><p style="color:#888;font-size:12px;">\u{1F4CD} {Studio_Address}<br>\u{1F4DE} {Studio_Phone} \u00B7 \u2709\uFE0F {Studio_Email}<br>\u{1F310} {Studio_Website}</p><p style="color:#aaa;font-size:11px;"><em>Diese E-Mail und ihre Anh\u00E4nge sind vertraulich. Sollten Sie nicht der beabsichtigte Empf\u00E4nger sein, informieren Sie uns bitte umgehend.</em></p>',
    fr: '<p>Cordialement,<br><strong>L\u2019\u00E9quipe {Studio_Name}</strong></p><p style="color:#888;font-size:12px;">\u{1F4CD} {Studio_Address}<br>\u{1F4DE} {Studio_Phone} \u00B7 \u2709\uFE0F {Studio_Email}<br>\u{1F310} {Studio_Website}</p><p style="color:#aaa;font-size:11px;"><em>Ce message et ses pi\u00E8ces jointes sont confidentiels.</em></p>',
    it: '<p>Cordiali saluti,<br><strong>Il team {Studio_Name}</strong></p><p style="color:#888;font-size:12px;">\u{1F4CD} {Studio_Address}<br>\u{1F4DE} {Studio_Phone} \u00B7 \u2709\uFE0F {Studio_Email}<br>\u{1F310} {Studio_Website}</p><p style="color:#aaa;font-size:11px;"><em>Questa e-mail e i suoi allegati sono riservati.</em></p>',
    es: '<p>Atentamente,<br><strong>El equipo de {Studio_Name}</strong></p><p style="color:#888;font-size:12px;">\u{1F4CD} {Studio_Address}<br>\u{1F4DE} {Studio_Phone} \u00B7 \u2709\uFE0F {Studio_Email}<br>\u{1F310} {Studio_Website}</p><p style="color:#aaa;font-size:11px;"><em>Este correo electr\u00F3nico y sus archivos adjuntos son confidenciales.</em></p>',
  },
};

// SMTP Configuration Defaults
export const DEFAULT_SMTP_CONFIG = {
  smtpServer: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPass: "",
  useSSL: false,
  senderName: "",
};

// Demo Email Defaults (multi-language)
export const DEFAULT_DEMO_EMAIL = {
  subject: {
    en: "Your Demo Access",
    de: "Ihr Demo-Zugang",
    fr: "Votre acc\u00E8s d\u00E9mo",
    it: "Il tuo accesso demo",
    es: "Tu acceso de demostraci\u00F3n",
  },
  content: {
    en: '<h2 style="color:#f97316;">Welcome to {Studio_Name}! \u{1F389}</h2><p>Dear {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Thank you for your interest in our platform. We are excited to provide you with <strong>exclusive demo access</strong> so you can explore all features firsthand.</p><h3>Your Access Details</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">Email for Access</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Access}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Access Link</td><td style="padding:10px;border:1px solid #333;"><a href="{Access_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Click here to access the demo \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">Valid Until</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><h3>What you can do</h3><ul><li>\u{1F4CA} Explore <strong>analytics dashboards</strong> and reporting tools</li><li>\u{1F465} Test <strong>member management</strong> features</li><li>\u{1F4C5} Try out <strong>appointment scheduling</strong> and calendar views</li><li>\u{1F4AC} Experience the built-in <strong>messenger</strong> system</li></ul><p>If you have any questions during your trial, don\u2019t hesitate to reach out.</p><p><em>We look forward to hearing your feedback!</em></p>',
    de: '<h2 style="color:#f97316;">Willkommen bei {Studio_Name}! \u{1F389}</h2><p>Sehr geehrte/r {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Vielen Dank f\u00FCr Ihr Interesse an unserer Plattform. Wir freuen uns, Ihnen einen <strong>exklusiven Demo-Zugang</strong> bereitstellen zu k\u00F6nnen.</p><h3>Ihre Zugangsdaten</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">E-Mail f\u00FCr Zugang</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Access}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Zugangslink</td><td style="padding:10px;border:1px solid #333;"><a href="{Access_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Hier klicken f\u00FCr den Demo-Zugang \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">G\u00FCltig bis</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><h3>Das k\u00F6nnen Sie tun</h3><ul><li>\u{1F4CA} <strong>Analyse-Dashboards</strong> und Reporting-Tools erkunden</li><li>\u{1F465} <strong>Mitgliederverwaltung</strong> testen</li><li>\u{1F4C5} <strong>Terminplanung</strong> und Kalenderansichten ausprobieren</li><li>\u{1F4AC} Das integrierte <strong>Messenger</strong>-System erleben</li></ul><p>Falls Sie Fragen haben, z\u00F6gern Sie nicht, uns zu kontaktieren.</p><p><em>Wir freuen uns auf Ihr Feedback!</em></p>',
    fr: '<h2 style="color:#f97316;">Bienvenue chez {Studio_Name} ! \u{1F389}</h2><p>Cher/Ch\u00E8re {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Merci de l\u2019int\u00E9r\u00EAt que vous portez \u00E0 notre plateforme. Nous sommes ravis de vous offrir un <strong>acc\u00E8s d\u00E9mo exclusif</strong>.</p><h3>Vos identifiants</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">E-mail d\u2019acc\u00E8s</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Access}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Lien d\u2019acc\u00E8s</td><td style="padding:10px;border:1px solid #333;"><a href="{Access_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Cliquez ici \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">Valide jusqu\u2019au</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><ul><li>\u{1F4CA} Explorer les <strong>tableaux de bord</strong></li><li>\u{1F465} Tester la <strong>gestion des membres</strong></li><li>\u{1F4C5} Essayer la <strong>planification</strong></li><li>\u{1F4AC} D\u00E9couvrir la <strong>messagerie</strong></li></ul><p><em>Nous attendons vos retours !</em></p>',
    it: '<h2 style="color:#f97316;">Benvenuto/a su {Studio_Name}! \u{1F389}</h2><p>Gentile {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Grazie per il tuo interesse. Siamo lieti di fornirti un <strong>accesso demo esclusivo</strong>.</p><h3>I tuoi dati di accesso</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">Email per l\u2019accesso</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Access}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Link di accesso</td><td style="padding:10px;border:1px solid #333;"><a href="{Access_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Clicca qui \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">Valido fino al</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><ul><li>\u{1F4CA} Esplorare le <strong>dashboard</strong></li><li>\u{1F465} Testare la <strong>gestione membri</strong></li><li>\u{1F4C5} Provare la <strong>pianificazione</strong></li><li>\u{1F4AC} Sperimentare la <strong>messaggistica</strong></li></ul><p><em>Non vediamo l\u2019ora del tuo feedback!</em></p>',
    es: '<h2 style="color:#f97316;">\u00A1Bienvenido/a a {Studio_Name}! \u{1F389}</h2><p>Estimado/a {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Gracias por tu inter\u00E9s. Nos complace ofrecerte un <strong>acceso demo exclusivo</strong>.</p><h3>Tus datos de acceso</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">Email de acceso</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Access}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Enlace de acceso</td><td style="padding:10px;border:1px solid #333;"><a href="{Access_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Haz clic aqu\u00ED \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">V\u00E1lido hasta</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><ul><li>\u{1F4CA} Explorar los <strong>paneles de an\u00E1lisis</strong></li><li>\u{1F465} Probar la <strong>gesti\u00F3n de miembros</strong></li><li>\u{1F4C5} Probar la <strong>programaci\u00F3n</strong></li><li>\u{1F4AC} Experimentar la <strong>mensajer\u00EDa</strong></li></ul><p><em>\u00A1Esperamos tus comentarios!</em></p>',
  },
  expiryDays: 7,
};

// Registration Email Defaults (multi-language)
export const DEFAULT_REGISTRATION_EMAIL = {
  subject: {
    en: "Welcome \u2013 Complete Your Registration",
    de: "Willkommen \u2013 Registrierung abschlie\u00DFen",
    fr: "Bienvenue \u2013 Finalisez votre inscription",
    it: "Benvenuto/a \u2013 Completa la registrazione",
    es: "Bienvenido/a \u2013 Completa tu registro",
  },
  content: {
    en: '<h2 style="color:#f97316;">Welcome aboard! \u{1F680}</h2><p>Dear {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>We\u2019re thrilled to have you join <strong>{Studio_Name}</strong>! Your account has been created and is almost ready to go.</p><h3>Your Registration Details</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">Registration Email</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Registration}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Activation Link</td><td style="padding:10px;border:1px solid #333;"><a href="{Registration_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Activate your account \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">Link expires</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><h3>Getting Started</h3><ol><li><strong>Click the activation link</strong> above to verify your email</li><li><strong>Set your password</strong> and complete your profile</li><li><strong>Start exploring</strong> \u2013 your dashboard awaits!</li></ol><p>If you did not request this registration, you can safely ignore this email.</p><p><em>Welcome to the family! \u{1F4AA}</em></p>',
    de: '<h2 style="color:#f97316;">Willkommen an Bord! \u{1F680}</h2><p>Sehr geehrte/r {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Wir freuen uns, Sie bei <strong>{Studio_Name}</strong> begr\u00FC\u00DFen zu d\u00FCrfen! Ihr Konto wurde erstellt und ist fast einsatzbereit.</p><h3>Ihre Registrierungsdaten</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">Registrierungs-E-Mail</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Registration}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Aktivierungslink</td><td style="padding:10px;border:1px solid #333;"><a href="{Registration_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Konto aktivieren \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">Link g\u00FCltig bis</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><h3>Erste Schritte</h3><ol><li><strong>Klicken Sie auf den Aktivierungslink</strong> um Ihre E-Mail zu best\u00E4tigen</li><li><strong>Legen Sie Ihr Passwort fest</strong> und vervollst\u00E4ndigen Sie Ihr Profil</li><li><strong>Starten Sie los</strong> \u2013 Ihr Dashboard wartet!</li></ol><p>Falls Sie diese Registrierung nicht angefordert haben, k\u00F6nnen Sie diese E-Mail ignorieren.</p><p><em>Willkommen in der Familie! \u{1F4AA}</em></p>',
    fr: '<h2 style="color:#f97316;">Bienvenue \u00E0 bord ! \u{1F680}</h2><p>Cher/Ch\u00E8re {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Nous sommes ravis de vous accueillir chez <strong>{Studio_Name}</strong> !</p><h3>Vos donn\u00E9es d\u2019inscription</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">E-mail d\u2019inscription</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Registration}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Lien d\u2019activation</td><td style="padding:10px;border:1px solid #333;"><a href="{Registration_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Activer votre compte \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">Le lien expire le</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><ol><li><strong>Cliquez sur le lien</strong> pour v\u00E9rifier votre e-mail</li><li><strong>D\u00E9finissez votre mot de passe</strong></li><li><strong>Commencez \u00E0 explorer</strong> !</li></ol><p><em>Bienvenue dans la famille ! \u{1F4AA}</em></p>',
    it: '<h2 style="color:#f97316;">Benvenuto/a a bordo! \u{1F680}</h2><p>Gentile {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Siamo entusiasti di averti con noi su <strong>{Studio_Name}</strong>!</p><h3>I tuoi dati di registrazione</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">Email di registrazione</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Registration}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Link di attivazione</td><td style="padding:10px;border:1px solid #333;"><a href="{Registration_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Attiva il tuo account \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">Il link scade il</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><ol><li><strong>Clicca sul link di attivazione</strong></li><li><strong>Imposta la tua password</strong></li><li><strong>Inizia ad esplorare</strong>!</li></ol><p><em>Benvenuto/a nella famiglia! \u{1F4AA}</em></p>',
    es: '<h2 style="color:#f97316;">\u00A1Bienvenido/a a bordo! \u{1F680}</h2><p>Estimado/a {Studio_Owner_First_Name} {Studio_Owner_Last_Name},</p><p>Estamos encantados de tenerte en <strong>{Studio_Name}</strong>.</p><h3>Tus datos de registro</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;width:40%;">Email de registro</td><td style="padding:10px;border:1px solid #333;color:#fff;"><strong>{Email_For_Registration}</strong></td></tr><tr><td style="padding:10px;border:1px solid #333;color:#999;">Enlace de activaci\u00F3n</td><td style="padding:10px;border:1px solid #333;"><a href="{Registration_Link}" style="color:#f97316;text-decoration:none;font-weight:bold;">Activa tu cuenta \u2192</a></td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;color:#999;">El enlace expira el</td><td style="padding:10px;border:1px solid #333;color:#ef4444;"><strong>{Expiry_Date}</strong></td></tr></table><ol><li><strong>Haz clic en el enlace</strong> para verificar tu email</li><li><strong>Establece tu contrase\u00F1a</strong></li><li><strong>Empieza a explorar</strong>!</li></ol><p><em>\u00A1Bienvenido/a a la familia! \u{1F4AA}</em></p>',
  },
  expiryHours: 24,
};

// Contact Data Defaults
export const DEFAULT_CONTACT_DATA = {
  companyName: "",
  address: "",
  phone: "",
  email: "",
  website: "",
};

// Legal Information Defaults (multi-language)
export const DEFAULT_LEGAL_INFO = {
  imprint: {
    en: '<h2>Imprint</h2><h3>Company Information</h3><p><strong>FitManager GmbH</strong><br>Musterstra\u00DFe 42<br>10115 Berlin, Germany</p><p><strong>Managing Director:</strong> Max Mustermann<br><strong>Commercial Register:</strong> HRB 123456 B, Amtsgericht Berlin-Charlottenburg<br><strong>VAT ID:</strong> DE123456789</p><h3>Contact</h3><p>\u{1F4DE} Phone: +49 (0)30 1234567-0<br>\u{1F4E0} Fax: +49 (0)30 1234567-99<br>\u2709\uFE0F Email: <a href="mailto:info@fitmanager.de">info@fitmanager.de</a><br>\u{1F310} Website: <a href="https://www.fitmanager.de">www.fitmanager.de</a></p><h3>Regulatory Authority</h3><p>Responsible regulatory authority: Gewerbeamt Berlin-Mitte</p><h3>Professional Liability Insurance</h3><p><strong>Allianz Versicherung AG</strong><br>K\u00F6niginstra\u00DFe 28, 80802 M\u00FCnchen<br>Coverage area: Germany & EU</p><h3>Dispute Resolution</h3><p>The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr">https://ec.europa.eu/consumers/odr</a>. We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p><h3>Liability for Content</h3><p>As a service provider, we are responsible for our own content on these pages according to \u00A77(1) TMG. However, according to \u00A7\u00A78 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information.</p>',
    de: '<h2>Impressum</h2><h3>Angaben gem\u00E4\u00DF \u00A7 5 TMG</h3><p><strong>FitManager GmbH</strong><br>Musterstra\u00DFe 42<br>10115 Berlin, Deutschland</p><p><strong>Gesch\u00E4ftsf\u00FChrer:</strong> Max Mustermann<br><strong>Handelsregister:</strong> HRB 123456 B, Amtsgericht Berlin-Charlottenburg<br><strong>USt-IdNr.:</strong> DE123456789</p><h3>Kontakt</h3><p>\u{1F4DE} Telefon: +49 (0)30 1234567-0<br>\u{1F4E0} Fax: +49 (0)30 1234567-99<br>\u2709\uFE0F E-Mail: <a href="mailto:info@fitmanager.de">info@fitmanager.de</a><br>\u{1F310} Webseite: <a href="https://www.fitmanager.de">www.fitmanager.de</a></p><h3>Aufsichtsbeh\u00F6rde</h3><p>Zust\u00E4ndige Aufsichtsbeh\u00F6rde: Gewerbeamt Berlin-Mitte</p><h3>Berufshaftpflichtversicherung</h3><p><strong>Allianz Versicherung AG</strong><br>K\u00F6niginstra\u00DFe 28, 80802 M\u00FCnchen<br>Geltungsraum: Deutschland & EU</p><h3>Streitschlichtung</h3><p>Die Europ\u00E4ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr">https://ec.europa.eu/consumers/odr</a>. Wir sind weder bereit noch verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p><h3>Haftung f\u00FCr Inhalte</h3><p>Als Diensteanbieter sind wir gem\u00E4\u00DF \u00A7 7 Abs.1 TMG f\u00FCr eigene Inhalte auf diesen Seiten verantwortlich. Nach \u00A7\u00A7 8 bis 10 TMG sind wir jedoch nicht verpflichtet, \u00FCbermittelte oder gespeicherte fremde Informationen zu \u00FCberwachen.</p>',
    fr: '<h2>Mentions l\u00E9gales</h2><h3>Informations sur l\u2019entreprise</h3><p><strong>FitManager GmbH</strong><br>Musterstra\u00DFe 42<br>10115 Berlin, Allemagne</p><p><strong>Directeur g\u00E9n\u00E9ral :</strong> Max Mustermann<br><strong>Registre du commerce :</strong> HRB 123456 B, Tribunal de Berlin-Charlottenburg<br><strong>N\u00B0 TVA :</strong> DE123456789</p><h3>Contact</h3><p>\u{1F4DE} T\u00E9l\u00E9phone : +49 (0)30 1234567-0<br>\u2709\uFE0F E-mail : <a href="mailto:info@fitmanager.de">info@fitmanager.de</a><br>\u{1F310} Site web : <a href="https://www.fitmanager.de">www.fitmanager.de</a></p><h3>R\u00E9solution des litiges</h3><p>La Commission europ\u00E9enne fournit une plateforme de r\u00E9solution des litiges en ligne : <a href="https://ec.europa.eu/consumers/odr">https://ec.europa.eu/consumers/odr</a>.</p>',
    it: '<h2>Note legali</h2><h3>Informazioni sull\u2019azienda</h3><p><strong>FitManager GmbH</strong><br>Musterstra\u00DFe 42<br>10115 Berlino, Germania</p><p><strong>Amministratore delegato:</strong> Max Mustermann<br><strong>Registro delle imprese:</strong> HRB 123456 B, Tribunale di Berlino-Charlottenburg<br><strong>Partita IVA:</strong> DE123456789</p><h3>Contatti</h3><p>\u{1F4DE} Telefono: +49 (0)30 1234567-0<br>\u2709\uFE0F Email: <a href="mailto:info@fitmanager.de">info@fitmanager.de</a><br>\u{1F310} Sito web: <a href="https://www.fitmanager.de">www.fitmanager.de</a></p><h3>Risoluzione delle controversie</h3><p>La Commissione Europea fornisce una piattaforma per la risoluzione delle controversie online: <a href="https://ec.europa.eu/consumers/odr">https://ec.europa.eu/consumers/odr</a>.</p>',
    es: '<h2>Aviso legal</h2><h3>Informaci\u00F3n de la empresa</h3><p><strong>FitManager GmbH</strong><br>Musterstra\u00DFe 42<br>10115 Berl\u00EDn, Alemania</p><p><strong>Director general:</strong> Max Mustermann<br><strong>Registro mercantil:</strong> HRB 123456 B, Juzgado de Berl\u00EDn-Charlottenburg<br><strong>NIF:</strong> DE123456789</p><h3>Contacto</h3><p>\u{1F4DE} Tel\u00E9fono: +49 (0)30 1234567-0<br>\u2709\uFE0F Email: <a href="mailto:info@fitmanager.de">info@fitmanager.de</a><br>\u{1F310} Sitio web: <a href="https://www.fitmanager.de">www.fitmanager.de</a></p><h3>Resoluci\u00F3n de disputas</h3><p>La Comisi\u00F3n Europea proporciona una plataforma para la resoluci\u00F3n de disputas en l\u00EDnea: <a href="https://ec.europa.eu/consumers/odr">https://ec.europa.eu/consumers/odr</a>.</p>',
  },
  privacyPolicy: {
    en: '<h2>Privacy Policy</h2><p><em>Last updated: January 15, 2025</em></p><h3>1. Overview</h3><p>We take the protection of your personal data very seriously. This privacy policy informs you about how we handle your personal data when you use our platform.</p><p><strong>Responsible entity:</strong><br>FitManager GmbH, Musterstra\u00DFe 42, 10115 Berlin<br>Email: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a><br>Data Protection Officer: Dr. Anna Schmidt</p><h3>2. Data We Collect</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Category</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Examples</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Legal Basis</th></tr><tr><td style="padding:10px;border:1px solid #333;">Identity Data</td><td style="padding:10px;border:1px solid #333;">Name, date of birth, gender</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(b) GDPR</td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;">Contact Data</td><td style="padding:10px;border:1px solid #333;">Email, phone, address</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(b) GDPR</td></tr><tr><td style="padding:10px;border:1px solid #333;">Health Data</td><td style="padding:10px;border:1px solid #333;">Medical history, fitness assessments</td><td style="padding:10px;border:1px solid #333;">Art. 9(2)(a) GDPR</td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;">Usage Data</td><td style="padding:10px;border:1px solid #333;">Login times, feature usage, IP address</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(f) GDPR</td></tr><tr><td style="padding:10px;border:1px solid #333;">Payment Data</td><td style="padding:10px;border:1px solid #333;">Bank details, billing information</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(b) GDPR</td></tr></table><h3>3. Your Rights</h3><p>Under the GDPR, you have the following rights:</p><ol><li><strong>Right of access</strong> (Art. 15 GDPR)</li><li><strong>Right to rectification</strong> (Art. 16 GDPR)</li><li><strong>Right to erasure</strong> (Art. 17 GDPR)</li><li><strong>Right to restriction</strong> (Art. 18 GDPR)</li><li><strong>Right to data portability</strong> (Art. 20 GDPR)</li><li><strong>Right to object</strong> (Art. 21 GDPR)</li></ol><p>Contact: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p>',
    de: '<h2>Datenschutzerkl\u00E4rung</h2><p><em>Stand: 15. Januar 2025</em></p><h3>1. \u00DCberblick</h3><p>Wir nehmen den Schutz Ihrer personenbezogenen Daten sehr ernst. Diese Datenschutzerkl\u00E4rung informiert Sie dar\u00FCber, wie wir mit Ihren Daten umgehen.</p><p><strong>Verantwortliche Stelle:</strong><br>FitManager GmbH, Musterstra\u00DFe 42, 10115 Berlin<br>E-Mail: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a><br>Datenschutzbeauftragter: Dr. Anna Schmidt</p><h3>2. Welche Daten wir erheben</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Kategorie</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Beispiele</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Rechtsgrundlage</th></tr><tr><td style="padding:10px;border:1px solid #333;">Identit\u00E4tsdaten</td><td style="padding:10px;border:1px solid #333;">Name, Geburtsdatum, Geschlecht</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(b) DSGVO</td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;">Kontaktdaten</td><td style="padding:10px;border:1px solid #333;">E-Mail, Telefon, Adresse</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(b) DSGVO</td></tr><tr><td style="padding:10px;border:1px solid #333;">Gesundheitsdaten</td><td style="padding:10px;border:1px solid #333;">Krankengeschichte, Fitness-Bewertungen</td><td style="padding:10px;border:1px solid #333;">Art. 9(2)(a) DSGVO</td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;">Nutzungsdaten</td><td style="padding:10px;border:1px solid #333;">Anmeldezeiten, Feature-Nutzung, IP-Adresse</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(f) DSGVO</td></tr><tr><td style="padding:10px;border:1px solid #333;">Zahlungsdaten</td><td style="padding:10px;border:1px solid #333;">Bankverbindung, Rechnungsinformationen</td><td style="padding:10px;border:1px solid #333;">Art. 6(1)(b) DSGVO</td></tr></table><h3>3. Ihre Rechte</h3><ol><li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li><li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li><li><strong>Recht auf L\u00F6schung</strong> (Art. 17 DSGVO)</li><li><strong>Recht auf Einschr\u00E4nkung</strong> (Art. 18 DSGVO)</li><li><strong>Recht auf Daten\u00FCbertragbarkeit</strong> (Art. 20 DSGVO)</li><li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li></ol><p>Kontakt: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p>',
    fr: '<h2>Politique de confidentialit\u00E9</h2><p><em>Derni\u00E8re mise \u00E0 jour : 15 janvier 2025</em></p><h3>1. Aper\u00E7u</h3><p>Nous prenons la protection de vos donn\u00E9es personnelles tr\u00E8s au s\u00E9rieux.</p><p><strong>Responsable :</strong><br>FitManager GmbH, Musterstra\u00DFe 42, 10115 Berlin<br>E-mail : <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p><h3>2. Donn\u00E9es collect\u00E9es</h3><ul><li><strong>Donn\u00E9es d\u2019identit\u00E9 :</strong> Nom, date de naissance</li><li><strong>Donn\u00E9es de contact :</strong> E-mail, t\u00E9l\u00E9phone, adresse</li><li><strong>Donn\u00E9es de sant\u00E9 :</strong> Historique m\u00E9dical</li><li><strong>Donn\u00E9es d\u2019utilisation :</strong> Temps de connexion</li><li><strong>Donn\u00E9es de paiement :</strong> Coordonn\u00E9es bancaires</li></ul><h3>3. Vos droits</h3><p>Conform\u00E9ment au RGPD : acc\u00E8s, rectification, suppression, limitation, portabilit\u00E9 et opposition.</p><p>Contact : <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p>',
    it: '<h2>Informativa sulla privacy</h2><p><em>Ultimo aggiornamento: 15 gennaio 2025</em></p><h3>1. Panoramica</h3><p>Prendiamo molto seriamente la protezione dei tuoi dati personali.</p><p><strong>Titolare:</strong><br>FitManager GmbH, Musterstra\u00DFe 42, 10115 Berlino<br>Email: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p><h3>2. Dati raccolti</h3><ul><li><strong>Dati identificativi:</strong> Nome, data di nascita</li><li><strong>Dati di contatto:</strong> Email, telefono, indirizzo</li><li><strong>Dati sanitari:</strong> Storia medica</li><li><strong>Dati di utilizzo:</strong> Tempi di accesso</li><li><strong>Dati di pagamento:</strong> Coordinate bancarie</li></ul><h3>3. I tuoi diritti</h3><p>Ai sensi del GDPR: accesso, rettifica, cancellazione, limitazione, portabilit\u00E0 e opposizione.</p><p>Contatto: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p>',
    es: '<h2>Pol\u00EDtica de privacidad</h2><p><em>\u00DAltima actualizaci\u00F3n: 15 de enero de 2025</em></p><h3>1. Resumen</h3><p>Nos tomamos muy en serio la protecci\u00F3n de sus datos personales.</p><p><strong>Responsable:</strong><br>FitManager GmbH, Musterstra\u00DFe 42, 10115 Berl\u00EDn<br>Email: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p><h3>2. Datos recopilados</h3><ul><li><strong>Datos de identidad:</strong> Nombre, fecha de nacimiento</li><li><strong>Datos de contacto:</strong> Email, tel\u00E9fono, direcci\u00F3n</li><li><strong>Datos de salud:</strong> Historial m\u00E9dico</li><li><strong>Datos de uso:</strong> Tiempos de inicio de sesi\u00F3n</li><li><strong>Datos de pago:</strong> Datos bancarios</li></ul><h3>3. Sus derechos</h3><p>Seg\u00FAn el RGPD: acceso, rectificaci\u00F3n, supresi\u00F3n, limitaci\u00F3n, portabilidad y oposici\u00F3n.</p><p>Contacto: <a href="mailto:privacy@fitmanager.de">privacy@fitmanager.de</a></p>',
  },
  termsAndConditions: {
    en: '<h2>Terms and Conditions</h2><p><em>Effective date: January 1, 2025</em></p><h3>\u00A7 1 \u2013 Scope and Provider</h3><p>These General Terms and Conditions apply to all services provided by <strong>FitManager GmbH</strong> through the FitManager platform. By using the Platform, you agree to these terms.</p><h3>\u00A7 2 \u2013 Registration and Account</h3><ol><li>Use of the Platform requires registration with <strong>accurate and complete information</strong>.</li><li>You are responsible for maintaining the confidentiality of your login credentials.</li><li>The Provider reserves the right to <strong>suspend or terminate accounts</strong> that violate these terms.</li></ol><h3>\u00A7 3 \u2013 Services</h3><ul><li>\u2705 <strong>Member management</strong> \u2013 CRM, profiles, check-in</li><li>\u2705 <strong>Contract management</strong> \u2013 creation, billing, pausing</li><li>\u2705 <strong>Communication tools</strong> \u2013 messenger, notifications, email</li><li>\u2705 <strong>Training & health</strong> \u2013 workout plans, medical history</li><li>\u2705 <strong>Analytics & reporting</strong> \u2013 dashboards, KPIs, exports</li></ul><p>The Provider aims for <strong>99.5% uptime</strong> but does not guarantee uninterrupted availability.</p><h3>\u00A7 4 \u2013 Pricing</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Plan</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Monthly</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Annually</th></tr><tr><td style="padding:10px;border:1px solid #333;"><strong>Starter</strong></td><td style="padding:10px;border:1px solid #333;">\u20AC49/mo</td><td style="padding:10px;border:1px solid #333;">\u20AC470/yr</td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;"><strong>Professional</strong></td><td style="padding:10px;border:1px solid #333;">\u20AC99/mo</td><td style="padding:10px;border:1px solid #333;">\u20AC950/yr</td></tr><tr><td style="padding:10px;border:1px solid #333;"><strong>Enterprise</strong></td><td style="padding:10px;border:1px solid #333;">Custom</td><td style="padding:10px;border:1px solid #333;">Custom</td></tr></table><h3>\u00A7 5 \u2013 Cancellation</h3><ol><li>Minimum contract term: <strong>12 months</strong>.</li><li>Auto-renewal for successive <strong>12-month periods</strong>.</li><li>Cancellation notice: at least <strong>3 months</strong> before end of term.</li></ol><h3>\u00A7 6 \u2013 Governing Law</h3><p>These terms are governed by the laws of the <strong>Federal Republic of Germany</strong>. Place of jurisdiction: <strong>Berlin</strong>.</p>',
    de: '<h2>Allgemeine Gesch\u00E4ftsbedingungen</h2><p><em>G\u00FCltig ab: 1. Januar 2025</em></p><h3>\u00A7 1 \u2013 Geltungsbereich und Anbieter</h3><p>Diese AGB gelten f\u00FCr alle Leistungen der <strong>FitManager GmbH</strong> \u00FCber die FitManager-Plattform.</p><h3>\u00A7 2 \u2013 Registrierung und Konto</h3><ol><li>Die Nutzung erfordert eine Registrierung mit <strong>korrekten und vollst\u00E4ndigen Angaben</strong>.</li><li>Sie sind f\u00FCr die Vertraulichkeit Ihrer Zugangsdaten verantwortlich.</li><li>Der Anbieter beh\u00E4lt sich das Recht vor, Konten bei Versto\u00DF zu <strong>sperren oder zu l\u00F6schen</strong>.</li></ol><h3>\u00A7 3 \u2013 Leistungen</h3><ul><li>\u2705 <strong>Mitgliederverwaltung</strong> \u2013 CRM, Profile, Check-in</li><li>\u2705 <strong>Vertragsverwaltung</strong> \u2013 Erstellung, Abrechnung, Pausierung</li><li>\u2705 <strong>Kommunikationstools</strong> \u2013 Messenger, Benachrichtigungen, E-Mail</li><li>\u2705 <strong>Training & Gesundheit</strong> \u2013 Trainingspl\u00E4ne, Krankenakte</li><li>\u2705 <strong>Analytics & Reporting</strong> \u2013 Dashboards, KPIs, Exporte</li></ul><p>Angestrebte Verf\u00FCgbarkeit: <strong>99,5 %</strong>.</p><h3>\u00A7 4 \u2013 Preise</h3><table style="border-collapse:collapse;width:100%;margin:16px 0;"><tr style="background:#1f1f1f;"><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Tarif</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">Monatlich</th><th style="padding:10px;border:1px solid #333;color:#f97316;text-align:left;">J\u00E4hrlich</th></tr><tr><td style="padding:10px;border:1px solid #333;"><strong>Starter</strong></td><td style="padding:10px;border:1px solid #333;">49 \u20AC/Monat</td><td style="padding:10px;border:1px solid #333;">470 \u20AC/Jahr</td></tr><tr style="background:#1f1f1f;"><td style="padding:10px;border:1px solid #333;"><strong>Professional</strong></td><td style="padding:10px;border:1px solid #333;">99 \u20AC/Monat</td><td style="padding:10px;border:1px solid #333;">950 \u20AC/Jahr</td></tr><tr><td style="padding:10px;border:1px solid #333;"><strong>Enterprise</strong></td><td style="padding:10px;border:1px solid #333;">Individuell</td><td style="padding:10px;border:1px solid #333;">Individuell</td></tr></table><h3>\u00A7 5 \u2013 K\u00FCndigung</h3><ol><li>Mindestvertragslaufzeit: <strong>12 Monate</strong>.</li><li>Automatische Verl\u00E4ngerung um <strong>12 Monate</strong>.</li><li>K\u00FCndigungsfrist: mindestens <strong>3 Monate</strong> vor Ablauf.</li></ol><h3>\u00A7 6 \u2013 Anwendbares Recht</h3><p>Es gilt das Recht der <strong>Bundesrepublik Deutschland</strong>. Gerichtsstand: <strong>Berlin</strong>.</p>',
    fr: '<h2>Conditions G\u00E9n\u00E9rales</h2><p><em>Date d\u2019entr\u00E9e en vigueur : 1er janvier 2025</em></p><h3>\u00A7 1 \u2013 Champ d\u2019application</h3><p>Les pr\u00E9sentes CGV s\u2019appliquent \u00E0 tous les services fournis par <strong>FitManager GmbH</strong>.</p><h3>\u00A7 2 \u2013 Inscription</h3><ol><li>L\u2019utilisation n\u00E9cessite une inscription avec des <strong>informations exactes</strong>.</li><li>Vous \u00EAtes responsable de la confidentialit\u00E9 de vos identifiants.</li></ol><h3>\u00A7 3 \u2013 Services</h3><ul><li>\u2705 <strong>Gestion des membres</strong></li><li>\u2705 <strong>Gestion des contrats</strong></li><li>\u2705 <strong>Outils de communication</strong></li><li>\u2705 <strong>Entra\u00EEnement et sant\u00E9</strong></li><li>\u2705 <strong>Analyses et rapports</strong></li></ul><h3>\u00A7 4 \u2013 Droit applicable</h3><p>Le droit de la <strong>R\u00E9publique F\u00E9d\u00E9rale d\u2019Allemagne</strong> s\u2019applique. Tribunal comp\u00E9tent : <strong>Berlin</strong>.</p>',
    it: '<h2>Termini e Condizioni</h2><p><em>Data di decorrenza: 1 gennaio 2025</em></p><h3>\u00A7 1 \u2013 Ambito</h3><p>I presenti Termini si applicano a tutti i servizi di <strong>FitManager GmbH</strong>.</p><h3>\u00A7 2 \u2013 Registrazione</h3><ol><li>L\u2019utilizzo richiede la registrazione con <strong>informazioni accurate</strong>.</li><li>L\u2019utente \u00E8 responsabile della riservatezza delle credenziali.</li></ol><h3>\u00A7 3 \u2013 Servizi</h3><ul><li>\u2705 <strong>Gestione dei membri</strong></li><li>\u2705 <strong>Gestione dei contratti</strong></li><li>\u2705 <strong>Strumenti di comunicazione</strong></li><li>\u2705 <strong>Allenamento e salute</strong></li><li>\u2705 <strong>Analisi e reportistica</strong></li></ul><h3>\u00A7 4 \u2013 Legge applicabile</h3><p>Si applica il diritto della <strong>Repubblica Federale di Germania</strong>. Foro competente: <strong>Berlino</strong>.</p>',
    es: '<h2>T\u00E9rminos y Condiciones</h2><p><em>Fecha de vigencia: 1 de enero de 2025</em></p><h3>\u00A7 1 \u2013 \u00C1mbito</h3><p>Los presentes T\u00E9rminos se aplican a todos los servicios de <strong>FitManager GmbH</strong>.</p><h3>\u00A7 2 \u2013 Registro</h3><ol><li>El uso requiere registro con <strong>informaci\u00F3n precisa</strong>.</li><li>El usuario es responsable de la confidencialidad de sus credenciales.</li></ol><h3>\u00A7 3 \u2013 Servicios</h3><ul><li>\u2705 <strong>Gesti\u00F3n de miembros</strong></li><li>\u2705 <strong>Gesti\u00F3n de contratos</strong></li><li>\u2705 <strong>Herramientas de comunicaci\u00F3n</strong></li><li>\u2705 <strong>Entrenamiento y salud</strong></li><li>\u2705 <strong>An\u00E1lisis e informes</strong></li></ul><h3>\u00A7 4 \u2013 Legislaci\u00F3n aplicable</h3><p>Se aplica la legislaci\u00F3n de la <strong>Rep\u00FAblica Federal de Alemania</strong>. Jurisdicci\u00F3n: <strong>Berl\u00EDn</strong>.</p>',
  },
};

// Default Contract Pause Reasons
export const DEFAULT_CONTRACT_PAUSE_REASONS = [
  { name: "Vacation", maxDays: 30 },
  { name: "Medical", maxDays: 90 },
];

// Default Lead Sources
export const DEFAULT_LEAD_SOURCES = [
  { id: 1, name: "Website", color: "#3B82F6" },
  { id: 2, name: "Social Media", color: "#10B981" },
  { id: 3, name: "Referral", color: "#F59E0B" },
];

// Lead Source Helper Functions
export const getLeadSourceNames = (sources = DEFAULT_LEAD_SOURCES) =>
  sources.map((s) => s.name);

export const getLeadSourceByName = (name, sources = DEFAULT_LEAD_SOURCES) =>
  sources.find((s) => s.name === name) || null;

export const getLeadSourceColor = (name, sources = DEFAULT_LEAD_SOURCES) => {
  const source = sources.find((s) => s.name === name);
  return source ? source.color : "#6B7280";
};

// Navigation Items Configuration for the Configuration Page
export const CONFIGURATION_NAV_ITEMS = [
  {
    id: "account",
    label: "Account",
    iconName: "User",
    sections: [
      { id: "account-details", label: "Personal Details" },
      { id: "account-access", label: "Access Data" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    iconName: "Building2",
    sections: [
      { id: "contact-info", label: "Contact Information" },
      { id: "legal-info", label: "Legal Information" },
    ],
  },
  {
    id: "contracts",
    label: "Contracts",
    iconName: "RiContractLine",
    sections: [
      { id: "contract-types", label: "Contract Types" },
      { id: "pause-reasons", label: "Pause Reasons" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    iconName: "UserPlus",
    sections: [{ id: "lead-sources", label: "Lead Sources" }],
  },
  {
    id: "communication",
    label: "Communication",
    iconName: "Mail",
    sections: [
      { id: "demo-email", label: "Demo Access Email" },
      { id: "registration-email", label: "Registration Email" },
      { id: "email-signature", label: "Email Signature" },
      { id: "smtp-setup", label: "SMTP Setup" },
    ],
  },
  {
    id: "changelog",
    label: "Changelog",
    iconName: "History",
    sections: [{ id: "version-history", label: "Version History" }],
  },
  {
    id: "demo-access",
    label: "Demo Access",
    iconName: "Shield",
    sections: [{ id: "demo-templates", label: "Templates" }],
  },
];

// ============================================
// Demo Access - Menu Items & Default Templates
// ============================================
export const DEMO_MENU_ITEMS = [
  { key: "my-area", label: "My Area" },
  { key: "appointments", label: "Appointments" },
  { key: "messenger", label: "Messenger" },
  { key: "bulletin-board", label: "Bulletin Board" },
  { key: "activity-monitor", label: "Activity Monitor" },
  { key: "to-do", label: "To-Do" },
  { key: "notes", label: "Notes" },
  { key: "media-library", label: "Media Library" },
  { key: "members", label: "Members" },
  { key: "check-in", label: "Check-In" },
  { key: "contracts", label: "Contracts" },
  { key: "leads", label: "Leads" },
  { key: "staff", label: "Staff" },
  { key: "selling", label: "Selling" },
  { key: "marketplace", label: "Marketplace" },
  { key: "finances", label: "Finances" },
  { key: "training", label: "Training" },
  { key: "medical-history", label: "Medical History" },
  { key: "analytics", label: "Analytics" },
  { key: "configuration", label: "Configuration" },
  { key: "help-center", label: "Help Center" },
  { key: "tickets", label: "Tickets" },
];

export const DEFAULT_DEMO_TEMPLATES = [
  {
    id: "basic",
    name: "Basic Demo",
    description: "Limited access with core features",
    color: "#10b981",
    permissions: Object.fromEntries(
      DEMO_MENU_ITEMS.map((m) => [
        m.key,
        ["my-area", "appointments", "members", "analytics"].includes(m.key),
      ])
    ),
  },
  {
    id: "standard",
    name: "Standard Demo",
    description: "Full access with some restrictions",
    color: "#3b82f6",
    permissions: Object.fromEntries(
      DEMO_MENU_ITEMS.map((m) => [
        m.key,
        !["configuration", "finances", "marketplace"].includes(m.key),
      ])
    ),
  },
  {
    id: "premium",
    name: "Premium Demo",
    description: "Complete platform access",
    color: "#f59e0b",
    permissions: Object.fromEntries(DEMO_MENU_ITEMS.map((m) => [m.key, true])),
  },
];

// ============================================
// Default Changelog Entries (multi-language)
// ============================================
export const DEFAULT_CHANGELOG = [
  {
    id: 1,
    version: "2.4.0",
    date: "2025-06-01",
    color: "#f97316",
    content: {
      en: '<h3>\u{1F680} Major Release \u2013 Analytics Overhaul</h3><p>We\u2019ve completely redesigned the analytics module with new interactive dashboards and real-time data processing.</p><h4>New Features</h4><ul><li><strong>Real-time dashboard</strong> \u2013 Live member check-ins, revenue tracking, and capacity utilization</li><li><strong>Custom report builder</strong> \u2013 Create personalized reports with drag-and-drop widgets</li><li><strong>Export to PDF/Excel</strong> \u2013 One-click export for all reports and charts</li><li><strong>Comparison mode</strong> \u2013 Compare metrics across different time periods</li></ul><h4>Improvements</h4><ul><li>\u26A1 Page load times reduced by <strong>40%</strong></li><li>\u{1F512} Enhanced two-factor authentication with TOTP support</li><li>\u{1F4F1} Improved mobile responsiveness for tablets</li></ul><h4>Bug Fixes</h4><ul><li>Fixed contract renewal notification not being sent for annual contracts</li><li>Resolved calendar display issue when timezone differs from server</li><li>Fixed member search returning duplicate results</li></ul>',
      de: '<h3>\u{1F680} Gro\u00DFes Release \u2013 Analytics-\u00DCberarbeitung</h3><p>Wir haben das Analytics-Modul komplett neu gestaltet \u2013 mit neuen interaktiven Dashboards und Echtzeit-Datenverarbeitung.</p><h4>Neue Funktionen</h4><ul><li><strong>Echtzeit-Dashboard</strong> \u2013 Live Check-ins, Umsatz-Tracking und Auslastungsanzeige</li><li><strong>Report-Builder</strong> \u2013 Personalisierte Berichte per Drag-and-Drop</li><li><strong>Export als PDF/Excel</strong> \u2013 Ein-Klick-Export</li><li><strong>Vergleichsmodus</strong> \u2013 Kennzahlen verschiedener Zeitr\u00E4ume vergleichen</li></ul><h4>Verbesserungen</h4><ul><li>\u26A1 Ladezeiten um <strong>40 %</strong> reduziert</li><li>\u{1F512} Erweiterte Zwei-Faktor-Authentifizierung</li><li>\u{1F4F1} Verbesserte mobile Darstellung</li></ul><h4>Fehlerbehebungen</h4><ul><li>Vertragsverlängerungs-Benachrichtigung für Jahresverträge behoben</li><li>Kalender-Anzeigefehler bei abweichender Zeitzone behoben</li><li>Doppelte Suchergebnisse bei Mitgliedern behoben</li></ul>',
      fr: '<h3>\u{1F680} Mise \u00E0 jour majeure \u2013 Refonte Analytics</h3><ul><li><strong>Dashboard en temps r\u00E9el</strong> \u2013 Check-ins, revenus et utilisation</li><li><strong>G\u00E9n\u00E9rateur de rapports</strong> \u2013 Widgets glisser-d\u00E9poser</li><li><strong>Export PDF/Excel</strong></li><li>\u26A1 Temps de chargement r\u00E9duits de <strong>40%</strong></li></ul>',
      it: '<h3>\u{1F680} Rilascio Importante \u2013 Revisione Analytics</h3><ul><li><strong>Dashboard in tempo reale</strong> \u2013 Check-in, ricavi e capacit\u00E0</li><li><strong>Generatore di report</strong> \u2013 Widget drag-and-drop</li><li><strong>Esportazione PDF/Excel</strong></li><li>\u26A1 Tempi di caricamento ridotti del <strong>40%</strong></li></ul>',
      es: '<h3>\u{1F680} Lanzamiento Mayor \u2013 Redise\u00F1o Analytics</h3><ul><li><strong>Panel en tiempo real</strong> \u2013 Check-ins, ingresos y capacidad</li><li><strong>Generador de informes</strong> \u2013 Widgets arrastrar y soltar</li><li><strong>Exportaci\u00F3n PDF/Excel</strong></li><li>\u26A1 Tiempos de carga reducidos en un <strong>40%</strong></li></ul>',
    },
  },
  {
    id: 2,
    version: "2.3.2",
    date: "2025-04-15",
    color: "#3b82f6",
    content: {
      en: '<h3>\u{1F527} Patch \u2013 Communication & Stability</h3><ul><li>\u2705 <strong>Email templates</strong> now support multi-language editing with live preview</li><li>\u2705 <strong>SMTP connection</strong> test provides detailed error diagnostics</li><li>\u2705 Fixed messenger notifications not appearing on iOS devices</li><li>\u2705 Improved contract PDF generation with Unicode support</li><li>\u2705 Resolved race condition in concurrent check-in processing</li></ul>',
      de: '<h3>\u{1F527} Patch \u2013 Kommunikation & Stabilit\u00E4t</h3><ul><li>\u2705 <strong>E-Mail-Vorlagen</strong> unterst\u00FCtzen mehrsprachige Bearbeitung mit Live-Vorschau</li><li>\u2705 <strong>SMTP-Verbindungstest</strong> liefert detaillierte Fehlerdiagnosen</li><li>\u2705 Messenger-Benachrichtigungen auf iOS behoben</li><li>\u2705 Vertrags-PDF mit Unicode-Unterst\u00FCtzung verbessert</li><li>\u2705 Race Condition bei Check-in behoben</li></ul>',
      fr: '<h3>\u{1F527} Correctif \u2013 Communication & Stabilit\u00E9</h3><ul><li>\u2705 <strong>Mod\u00E8les d\u2019email</strong> multilingues avec aper\u00E7u</li><li>\u2705 Test <strong>SMTP</strong> avec diagnostics d\u00E9taill\u00E9s</li><li>\u2705 Notifications messenger iOS corrig\u00E9es</li></ul>',
      it: '<h3>\u{1F527} Patch \u2013 Comunicazione & Stabilit\u00E0</h3><ul><li>\u2705 <strong>Modelli email</strong> multilingua con anteprima</li><li>\u2705 Test <strong>SMTP</strong> con diagnostiche dettagliate</li><li>\u2705 Notifiche messenger iOS corrette</li></ul>',
      es: '<h3>\u{1F527} Parche \u2013 Comunicaci\u00F3n & Estabilidad</h3><ul><li>\u2705 <strong>Plantillas de email</strong> multiling\u00FCe con vista previa</li><li>\u2705 Prueba <strong>SMTP</strong> con diagn\u00F3sticos detallados</li><li>\u2705 Notificaciones de mensajer\u00EDa en iOS corregidas</li></ul>',
    },
  },
  {
    id: 3,
    version: "2.3.0",
    date: "2025-03-01",
    color: "#10b981",
    content: {
      en: '<h3>\u2728 Feature Release \u2013 Member Experience</h3><h4>New Features</h4><ul><li><strong>Member app</strong> \u2013 Self-service portal for bookings, training plans, and progress</li><li><strong>QR code check-in</strong> \u2013 Scan-based check-in at the entrance</li><li><strong>Automated birthday emails</strong> \u2013 Personalized greetings sent automatically</li><li><strong>Waiting list</strong> \u2013 Join waiting lists for fully booked classes</li></ul><h4>Improvements</h4><ul><li>\u{1F3A8} Redesigned member profile with activity timeline</li><li>\u{1F4E7} Email delivery reliability improved to <strong>99.2%</strong></li><li>\u{1F50D} Advanced search with contract status and check-in filters</li></ul>',
      de: '<h3>\u2728 Feature-Release \u2013 Mitglieder-Erlebnis</h3><h4>Neue Funktionen</h4><ul><li><strong>Mitglieder-App</strong> \u2013 Self-Service-Portal f\u00FCr Buchungen und Trainingspl\u00E4ne</li><li><strong>QR-Code Check-in</strong> \u2013 Scan-basierter Check-in am Eingang</li><li><strong>Automatische Geburtstags-E-Mails</strong></li><li><strong>Warteliste</strong> \u2013 F\u00FCr ausgebuchte Kurse</li></ul><h4>Verbesserungen</h4><ul><li>\u{1F3A8} Neugestaltete Mitglieder-Profilseite</li><li>\u{1F4E7} E-Mail-Zustellbarkeit auf <strong>99,2 %</strong> verbessert</li><li>\u{1F50D} Erweiterte Suche mit Filtern</li></ul>',
      fr: '<h3>\u2728 Nouvelles fonctionnalit\u00E9s \u2013 Exp\u00E9rience membre</h3><ul><li><strong>Application membre</strong> \u2013 Portail en libre-service</li><li><strong>Check-in QR code</strong></li><li><strong>Emails d\u2019anniversaire automatiques</strong></li><li><strong>Liste d\u2019attente</strong></li></ul>',
      it: '<h3>\u2728 Nuove funzionalit\u00E0 \u2013 Esperienza membro</h3><ul><li><strong>App per membri</strong> \u2013 Portale self-service</li><li><strong>Check-in con QR code</strong></li><li><strong>Email di compleanno automatiche</strong></li><li><strong>Lista d\u2019attesa</strong></li></ul>',
      es: '<h3>\u2728 Nuevas funcionalidades \u2013 Experiencia del miembro</h3><ul><li><strong>App para miembros</strong> \u2013 Portal de autoservicio</li><li><strong>Check-in por c\u00F3digo QR</strong></li><li><strong>Emails de cumplea\u00F1os autom\u00E1ticos</strong></li><li><strong>Lista de espera</strong></li></ul>',
    },
  },
  {
    id: 4,
    version: "2.2.0",
    date: "2025-01-10",
    color: "#8b5cf6",
    content: {
      en: '<h3>\u{1F4BC} Feature Release \u2013 Contract Management 2.0</h3><ul><li><strong>Flexible pause system</strong> \u2013 Configurable pause reasons with duration limits</li><li><strong>Auto-renewal engine</strong> \u2013 Smart renewal with customizable notice periods</li><li><strong>Bulk operations</strong> \u2013 Apply changes to multiple contracts at once</li><li><strong>Contract timeline</strong> \u2013 Visual history of all modifications</li><li><strong>Revenue forecasting</strong> \u2013 Projected revenue based on active contracts</li></ul>',
      de: '<h3>\u{1F4BC} Feature-Release \u2013 Vertragsverwaltung 2.0</h3><ul><li><strong>Flexibles Pausensystem</strong> \u2013 Konfigurierbare Pausengr\u00FCnde mit maximaler Dauer</li><li><strong>Auto-Verl\u00E4ngerung</strong> \u2013 Intelligente Vertragsverlängerung</li><li><strong>Massenoperationen</strong> \u2013 \u00C4nderungen auf mehrere Vertr\u00E4ge gleichzeitig</li><li><strong>Vertrags-Timeline</strong> \u2013 Visuelle Historie</li><li><strong>Umsatzprognose</strong> \u2013 Basierend auf aktiven Vertr\u00E4gen</li></ul>',
      fr: '',
      it: '',
      es: '',
    },
  },
  {
    id: 5,
    version: "2.1.0",
    date: "2024-11-20",
    color: "#ef4444",
    content: {
      en: '<h3>\u{1F3CB}\uFE0F Feature Release \u2013 Training Module</h3><ul><li><strong>Workout plan builder</strong> \u2013 Custom training programs with exercises, sets, and reps</li><li><strong>Exercise library</strong> \u2013 500+ exercises with video demonstrations</li><li><strong>Progress tracking</strong> \u2013 Log workouts and track improvements</li><li><strong>Trainer assignment</strong> \u2013 Assign personal trainers with session scheduling</li></ul>',
      de: '<h3>\u{1F3CB}\uFE0F Feature-Release \u2013 Trainingsmodul</h3><ul><li><strong>Trainingsplan-Builder</strong> \u2013 Individuelle Programme mit \u00DCbungen, S\u00E4tzen und Wiederholungen</li><li><strong>\u00DCbungsbibliothek</strong> \u2013 500+ \u00DCbungen mit Videoanleitungen</li><li><strong>Fortschrittsverfolgung</strong> \u2013 Trainings protokollieren</li><li><strong>Trainer-Zuweisung</strong> \u2013 Personal Trainer zuweisen</li></ul>',
      fr: '',
      it: '',
      es: '',
    },
  },
];
