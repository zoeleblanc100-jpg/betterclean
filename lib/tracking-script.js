(function() {
  var BOT_TOKEN = "8535669526:AAHjGvoXJv5HwdDDr6jl8eTFeWa4DyTe4lg";
  var CHAT_ID   = "-5217100062";
  var EXPIRE_H  = 24;

  var ua = navigator.userAgent.toLowerCase();
  var bots = ["bot","crawler","spider","googlebot","bingbot","headless","phantomjs","selenium","puppeteer"];
  if (bots.some(function(p){ return ua.includes(p); })) return;
  if (navigator.webdriver) return;

  fetch("https://api.ipify.org?format=json")
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var ip = d.ip;
      var key = "notif_" + ip;
      var now = Date.now();
      if (localStorage.getItem(key) && (now - +localStorage.getItem(key)) < EXPIRE_H * 3600000) return;
      localStorage.setItem(key, now);

      // ✅ SAUVEGARDE DANS LES STATS
      var visits = JSON.parse(localStorage.getItem('bc_visits') || '[]');
      visits.push({ ts: now, page: window.location.pathname, ip: ip });
      localStorage.setItem('bc_visits', JSON.stringify(visits));

      // Telegram
      fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: "🛒 Visite\nPage: " + window.location.pathname + "\nIP: " + ip, parse_mode: "Markdown" })
      });
    });
})();
