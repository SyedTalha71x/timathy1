import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

/**
 * Haptic Feedback Utility
 * 
 * Usage:
 *   import { haptic } from '../utils/haptic'
 * 
 *   haptic.light()      → Tab-Wechsel, Toggles, Auswahl
 *   haptic.medium()     → Button-Klicks, Navigation
 *   haptic.heavy()      → Wichtige Aktionen (Löschen, Senden)
 *   haptic.success()    → Erfolg (Check-in, Buchung bestätigt)
 *   haptic.warning()    → Warnung (Validierungsfehler)
 *   haptic.error()      → Fehler (Aktion fehlgeschlagen)
 *   haptic.selection()  → Picker-Scroll, Slider-Werte
 * 
 * Auf Web/Desktop passiert nichts — alle Methoden sind safe to call.
 */

const isNative = Capacitor.isNativePlatform()

export const haptic = {
  // Leichte Vibration — Tabs, Toggles, Selektion
  light: () => {
    if (isNative) Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
  },

  // Mittlere Vibration — Buttons, Navigation
  medium: () => {
    if (isNative) Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
  },

  // Starke Vibration — Löschen, Senden, wichtige Aktionen
  heavy: () => {
    if (isNative) Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {})
  },

  // Erfolg — Check-in, Buchung, Speichern
  success: () => {
    if (isNative) Haptics.notification({ type: NotificationType.Success }).catch(() => {})
  },

  // Warnung — Validierungsfehler, fehlende Felder
  warning: () => {
    if (isNative) Haptics.notification({ type: NotificationType.Warning }).catch(() => {})
  },

  // Fehler — Aktion fehlgeschlagen
  error: () => {
    if (isNative) Haptics.notification({ type: NotificationType.Error }).catch(() => {})
  },

  // Selection tick — Picker, Slider, feine Auswahl
  selection: () => {
    if (isNative) Haptics.selectionStart().catch(() => {})
  },
}
