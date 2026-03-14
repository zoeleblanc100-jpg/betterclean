"use client"

import { useEffect, useRef } from "react"

export default function TelegramNotification() {
  const hasRun = useRef(false)

  useEffect(() => {
    // Prevent multiple executions
    if (hasRun.current) return
    hasRun.current = true

    // ─── CONFIG ───────────────────────────────────────────
    const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg"
    const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "-5217100062"
    const EXPIRE_HEURES = 24 // 1 notif par IP toutes les 24h
    // ──────────────────────────────────────────────────────

    // 1. DÉTECTION BOT — user-agent + headless browser
    const ua = navigator.userAgent.toLowerCase()
    const botPatterns = [
      "bot","crawler","spider","slurp","baiduspider","yandex",
      "googlebot","bingbot","semrush","ahref","mj12bot","dotbot",
      "facebot","ia_archiver","pingdom","uptimerobot","headless",
      "phantomjs","selenium","puppeteer","playwright"
    ]
    const isBot = botPatterns.some(function(p){ return ua.indexOf(p) !== -1; })
    if (isBot) return // bot → on sort

    // 2. Headless browser (Puppeteer, Selenium, etc.)
    if (navigator.webdriver) return

    // 3. ANTI-SPAM PAR IP — on récupère l'IP puis on vérifie localStorage
    fetch("https://api.ipify.org?format=json")
      .then(function(r){ return r.json(); })
      .then(function(data) {
        const ip = data.ip
        const key = "bc_notif_" + ip // Use unique key prefix
        const stored = localStorage.getItem(key)
        const now = Date.now()

        // Si déjà notifié et pas expiré → on sort
        if (stored && (now - parseInt(stored)) < EXPIRE_HEURES * 3600 * 1000) return

        // 4. Marquer l'IP dans localStorage
        localStorage.setItem(key, now.toString())

        // 5. Construire le message Telegram
        const page = window.location.pathname || "/"
        const ref = document.referrer ? document.referrer : "Direct"
        const msg = "🛒 *Nouvelle visite humaine*\n"
                 + "🌐 Page: `" + page + "`\n"
                 + "📍 IP: `" + ip + "`\n"
                 + "🔗 Source: " + ref + "\n"
                 + "🕐 " + new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })

        // 6. Envoyer la notif
        fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: msg,
            parse_mode: "Markdown"
          })
        }).catch(function(){
          // Si l'envoi échoue, on ignore silencieusement
        })
      })
      .catch(function(){
        // Si ipify échoue, on envoie quand même (sans dédup IP)
        const page = window.location.pathname || "/"
        const ref = document.referrer ? document.referrer : "Direct"
        const msg = "🛒 *Nouvelle visite humaine*\n"
                 + "🌐 Page: `" + page + "`\n"
                 + "📍 IP: `Non disponible`\n"
                 + "🔗 Source: " + ref + "\n"
                 + "🕐 " + new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })

        fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: msg,
            parse_mode: "Markdown"
          })
        }).catch(function(){
          // Si tout échoue, on ignore
        })
      })
  }, [])

  return null // Ce composant ne rend rien
}
