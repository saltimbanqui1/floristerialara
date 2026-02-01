import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: CookiePreferences) => void;
  openSettings: () => void;
  closeSettings: () => void;
  showSettings: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = "floristeria-lara-cookie-consent";

export const CookieProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [hasConsented, setHasConsented] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (savedConsent) {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed.preferences);
        setHasConsented(true);
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const saveToStorage = (prefs: CookiePreferences) => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({ preferences: prefs, timestamp: Date.now() })
    );
  };

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);
    saveToStorage(allAccepted);
  };

  const rejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    setPreferences(onlyNecessary);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);
    saveToStorage(onlyNecessary);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const finalPrefs = { ...prefs, necessary: true };
    setPreferences(finalPrefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowSettings(false);
    saveToStorage(finalPrefs);
  };

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  return (
    <CookieContext.Provider
      value={{
        preferences,
        hasConsented,
        showBanner,
        acceptAll,
        rejectAll,
        savePreferences,
        openSettings,
        closeSettings,
        showSettings,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error("useCookies must be used within a CookieProvider");
  }
  return context;
};
