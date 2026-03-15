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
        var EXPIRE_H  = 24;

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

        var source = getSource();

        fetch("https://api.ipify.org?format=json")
          .then(function(r){ return r.json(); })
          .then(function(d) {
            var ip = d.ip;
            var key = "notif_" + ip;
            var now = Date.now();
            if (localStorage.getItem(key) && (now - +localStorage.getItem(key)) < EXPIRE_H * 3600000) return;
            localStorage.setItem(key, now);

            // ✅ SAUVEGARDE DANS LES STATS (même format que Telegram)
            var visits = JSON.parse(localStorage.getItem('bc_visits') || '[]');
            var today = new Date().toDateString();
            
            // Vérifier si cette IP a déjà visité cette page aujourd'hui
            var alreadyVisited = visits.some(function(visit) {
              return visit.ip === ip && 
                     visit.page === window.location.pathname && 
                     new Date(visit.ts).toDateString() === today;
            });
            
            // Si pas encore visité aujourd'hui, ajouter la visite
            if (!alreadyVisited) {
              var visitData = {
                ts: now, 
                page: window.location.pathname, 
                ip: ip,
                source: source,
                telegram_format: true // Marquer comme compatible Telegram
              };
              
              visits.push(visitData);
              localStorage.setItem('bc_visits', JSON.stringify(visits));

              // � Envoyer à Telegram (même format que dashboard)
              var telegramMessage = "🛒 Nouvelle visite humaine\\n🌐 Page: " + window.location.pathname + "\\n📍 IP: " + ip + "\\n🔗 Source: " + source + "\\n🕐 " + new Date().toLocaleString('fr-CA');
              
              fetch("https://api.telegram.org/bot8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg/sendMessage", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  chat_id: "-5217100062", 
                  text: telegramMessage, 
                  parse_mode: "Markdown" 
                })
              }).catch(function() {
                // Silent fail
              });
            }
          })
          .catch(function() {
            // Fallback pour IP detection
            var now = Date.now();
            var ip = 'unknown';
            var visits = JSON.parse(localStorage.getItem('bc_visits') || '[]');
            var today = new Date().toDateString();
            
            // Vérifier si déjà visité aujourd'hui
            var alreadyVisited = visits.some(function(visit) {
              return visit.ip === ip && 
                     visit.page === window.location.pathname && 
                     new Date(visit.ts).toDateString() === today;
            });
            
            if (!alreadyVisited) {
              var visitData = {
                ts: now, 
                page: window.location.pathname, 
                ip: ip,
                source: source,
                telegram_format: true
              };
              
              visits.push(visitData);
              localStorage.setItem('bc_visits', JSON.stringify(visits));

              var telegramMessage = "� Nouvelle visite humaine\\n🌐 Page: " + window.location.pathname + "\\n📍 IP: " + ip + "\\n🔗 Source: " + source + "\\n🕐 " + new Date().toLocaleString('fr-CA');
              
              fetch("https://api.telegram.org/bot8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg/sendMessage", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  chat_id: "-5217100062", 
                  text: telegramMessage, 
                  parse_mode: "Markdown" 
                })
              }).catch(function() {
                // Silent fail
              });
            }
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
