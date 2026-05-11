"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import styles from "@/components/ui/theme-toggle.module.css";
import { CogIcon } from "@/components/ui/theme-toggle-icons";
import { applyTheme, resolveClientTheme } from "@/lib/theme-client";
import { defaultLocale, locales, type Dictionary, type Locale } from "@/lib/i18n";
import { themeStorageKey, type ThemePreference } from "@/lib/theme";
import { getLocaleHrefForPath } from "@/lib/locale-navigation";

type ThemeToggleProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type LanguageOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

const languageOptions: LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "zh-tw", label: "繁體中文" },
  { value: "zh-cn", label: "简体中文" },
  { value: "ja", label: "日本語" },
  { value: "kr", label: "한국어", disabled: true },
];

function isSupportedLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function getThemePreferenceLabel(
  preference: ThemePreference,
  dictionary: Dictionary,
) {
  if (preference === "system") {
    return dictionary.themeToggleToSystem;
  }

  if (preference === "dark") {
    return dictionary.themeToggleToDark;
  }

  return dictionary.themeToggleToLight;
}

export function ThemeToggle({ locale, dictionary }: ThemeToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initialPreference = resolveClientTheme();

    setThemePreference(initialPreference);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    applyTheme(themePreference);

    try {
      localStorage.setItem(themeStorageKey, themePreference);
    } catch {
      // Ignore storage failures and keep the in-memory theme change.
    }

    if (themePreference !== "system" || typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyTheme("system");
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [themePreference, isHydrated]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (target && panelRef.current?.contains(target)) {
        return;
      }

      if (target && buttonRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const current = panelRef.current?.querySelector<HTMLInputElement>("input[name='theme-preference']:checked");
    current?.focus();
  }, [isOpen]);

  function handleThemeChange(nextPreference: ThemePreference) {
    setThemePreference(nextPreference);
  }

  function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;

    if (!isSupportedLocale(nextLocale)) {
      return;
    }

    setIsOpen(false);
    router.push(getLocaleHrefForPath(pathname, nextLocale));
  }

  function handleButtonClick() {
    setIsOpen((current) => !current);
  }

  const currentThemeLabel = getThemePreferenceLabel(themePreference, dictionary);

  return (
    <div className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={`theme-toggle ${styles.button}`}
        onClick={handleButtonClick}
        aria-label={dictionary.settingsPanel.buttonLabel}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title={dictionary.settingsPanel.buttonLabel}
        data-open={isOpen ? "true" : "false"}
      >
        <span className={styles.icon}>
          <CogIcon />
        </span>
      </button>

      <div
        ref={panelRef}
        className={styles.panel}
        data-open={isOpen ? "true" : "false"}
        aria-hidden={!isOpen}
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelLabel}>{dictionary.settingsPanel.buttonLabel}</div>
          <div className={styles.panelStatus}>{currentThemeLabel}</div>
        </div>

        <fieldset className={styles.group}>
          <legend className={styles.groupLabel}>{dictionary.settingsPanel.themeLabel}</legend>
          <div className={styles.chipRow}>
            {(
              [
                { value: "system", label: dictionary.themeToggleToSystem },
                { value: "dark", label: dictionary.themeToggleToDark },
                { value: "light", label: dictionary.themeToggleToLight },
              ] as const
            ).map((option) => (
              <label
                key={option.value}
                className={`${styles.chip} ${themePreference === option.value ? styles.chipActive : ""}`}
              >
                <input
                  type="radio"
                  name="theme-preference"
                  value={option.value}
                  checked={themePreference === option.value}
                  onChange={() => handleThemeChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.group}>
          <label className={styles.groupLabel} htmlFor="language-select">
            {dictionary.settingsPanel.languageLabel}
          </label>
          <select
            id="language-select"
            className={styles.select}
            value={isSupportedLocale(locale) ? locale : defaultLocale}
            onChange={handleLanguageChange}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
