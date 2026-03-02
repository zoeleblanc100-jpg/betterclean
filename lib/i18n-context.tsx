"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { fr } from "@/lib/translations/fr"
import { en } from "@/lib/translations/en"

type Locale = "fr" | "en"
type Country = "CA" | "US"
type Translations = typeof fr

const CAD_TO_USD = 0.73

interface I18nContextType {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  country: Country
  setCountry: (country: Country) => void
  currency: string
  formatPrice: (cadPrice: number) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Locale, Translations> = { fr, en }

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [country, setCountryState] = useState<Country>("CA")

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem("betterclean-lang") as Locale | null
    if (saved && (saved === "fr" || saved === "en")) {
      setLocaleState(saved)
    } else {
      // Auto-detect from browser/phone language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("fr")) {
        setLocaleState("fr")
      } else {
        setLocaleState("en")
      }
    }
    const savedCountry = localStorage.getItem("betterclean-country") as Country | null
    if (savedCountry && (savedCountry === "CA" || savedCountry === "US")) {
      setCountryState(savedCountry)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("betterclean-lang", newLocale)
  }, [])

  const setCountry = useCallback((newCountry: Country) => {
    setCountryState(newCountry)
    localStorage.setItem("betterclean-country", newCountry)
  }, [])

  const toggleLocale = useCallback(() => {
    const newLocale = locale === "fr" ? "en" : "fr"
    setLocale(newLocale)
  }, [locale, setLocale])

  const currency = country === "US" ? "USD" : "CAD"

  const formatPrice = useCallback((cadPrice: number) => {
    if (country === "US") {
      const usdPrice = cadPrice * CAD_TO_USD
      return `$${usdPrice.toFixed(2)} USD`
    }
    return `$${cadPrice.toFixed(2)} CAD`
  }, [country])

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale, toggleLocale, country, setCountry, currency, formatPrice }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n must be used within I18nProvider")
  return context
}
