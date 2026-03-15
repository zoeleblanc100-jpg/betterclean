"use client"

import { useEffect } from 'react'

export default function TrackingScript() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Inject the tracking script
    const script = document.createElement('script')
    script.textContent = `
      (function() {
        // ─── CONFIG SUPABASE ───────────────────────────────────────
        var BOT_TOKEN    = "8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg";
        var CHAT_ID      = "-5217100062";
        var SUPA_URL     = "https://ic8ty5pE7fgVwD74QIzZkA_QDqNPbU9.supabase.co";
        // La clé doit être complète et commencer par eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
        var SUPA_KEY     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljOHR5NXBFN2ZnVnc3c0OVFJe1prYV9RcU5QYlU5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NjI4NzEsImV4cCI6MjA1NzIwNDg3MX0.VOTRE_CLÉ_ICI";
        var EXPIRE_H     = 24;
        // ──────────────────────────────────────────────────

        var ua = navigator.userAgent.toLowerCase();
        var bots = ["bot","crawler","spider","googlebot","bingbot","headless","phantomjs","selenium","puppeteer"];
        if (bots.some(function(p){ return ua.includes(p); })) return;
        if (navigator.webdriver) return;

        // 📊 DETERMINER LA SOURCE
        function getSource() {
          var referrer = document.referrer || '';
          var urlParams = new URLSearchParams(window.location.search);
          
          // Check URL parameters first
          if (urlParams.get('utm_source')) {
            var utmSource = urlParams.get('utm_source').toLowerCase();
            if (utmSource.includes('facebook') || utmSource.includes('fb')) return 'Facebook';
            if (utmSource.includes('instagram') || utmSource.includes('ig')) return 'Instagram';
            if (utmSource.includes('tiktok')) return 'TikTok';
            if (utmSource.includes('google')) return 'Google';
            if (utmSource.includes('twitter') || utmSource.includes('x')) return 'Twitter';
            if (utmSource.includes('linkedin')) return 'LinkedIn';
            if (utmSource.includes('youtube')) return 'YouTube';
            return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
          }
          
          // Check referrer
          if (referrer) {
            var refDomain = referrer.toLowerCase();
            if (refDomain.includes('facebook.com') || refDomain.includes('fb.com')) return 'Facebook';
            if (refDomain.includes('instagram.com') || refDomain.includes('ig.com')) return 'Instagram';
            if (refDomain.includes('tiktok.com')) return 'TikTok';
            if (refDomain.includes('google.com')) return 'Google';
            if (refDomain.includes('twitter.com') || refDomain.includes('x.com')) return 'Twitter';
            if (refDomain.includes('linkedin.com')) return 'LinkedIn';
            if (refDomain.includes('youtube.com')) return 'YouTube';
            if (refDomain.includes('pinterest.com')) return 'Pinterest';
            if (refDomain.includes('reddit.com')) return 'Reddit';
          }
          
          return 'Direct';
        }

        fetch("https://api.ipify.org?format=json")
          .then(function(r){ return r.json(); })
          .then(function(d) {
            var ip  = d.ip;
            var key = "notif_" + ip;
            var now = Date.now();
            if (localStorage.getItem(key) && (now - +localStorage.getItem(key)) < EXPIRE_H * 3600000) return;
            localStorage.setItem(key, now);

            var page = window.location.pathname;
            var source = getSource();

            // ✅ Sauvegarde Supabase
            fetch(SUPA_URL + "/rest/v1/visits", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "apikey": SUPA_KEY,
                "Authorization": "Bearer " + SUPA_KEY,
                "Prefer": "return=minimal"
              },
              body: JSON.stringify({ ts: now, page: page, ip: ip })
            });

            // ✅ Notif Telegram
            var telegramMessage = "🛒 Nouvelle visite humaine\\n🌐 Page: " + page + "\\n📍 IP: " + ip + "\\n🔗 Source: " + source + "\\n🕐 " + new Date().toLocaleString('fr-CA');
            
            fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: CHAT_ID,
                text: telegramMessage,
                parse_mode: "Markdown"
              })
            }).catch(function() {
              // Silent fail
            });
          })
          .catch(function() {
            // Fallback IP detection
            var now = Date.now();
            var ip = 'unknown';
            var page = window.location.pathname;
            var source = getSource();

            // ✅ Sauvegarde Supabase même avec IP unknown
            fetch(SUPA_URL + "/rest/v1/visits", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "apikey": SUPA_KEY,
                "Authorization": "Bearer " + SUPA_KEY,
                "Prefer": "return=minimal"
              },
              body: JSON.stringify({ ts: now, page: page, ip: ip })
            });
          });
      })();
    `
    document.head.appendChild(script)

    return () => {
      // Cleanup script if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return null // This component doesn't render anything
}
