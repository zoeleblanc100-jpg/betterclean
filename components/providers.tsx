"use client"

import { ReactNode } from "react"
import { CartProvider } from "@/lib/cart-context"
import { I18nProvider } from "@/lib/i18n-context"
import { Toaster } from "sonner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import TelegramNotification from "@/components/telegram-notification"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <CartProvider>
        <TelegramNotification />
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
        <SpeedInsights />
      </CartProvider>
    </I18nProvider>
  )
}
