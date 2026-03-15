"use client"

import { useEffect } from 'react'

export default function DevToolsScript() {
  useEffect(() => {
    // Disable anti-devtools protection on stats page
    const originalConsole = window.console
    
    // Allow F12 and right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      // Re-enable right-click
      const menu = document.createElement('div')
      menu.style.cssText = `
        position: fixed;
        top: ${e.clientY}px;
        left: ${e.clientX}px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 4px 0;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: monospace;
        font-size: 12px;
      `
      
      const items = ['Inspect', 'View Source', 'Console', 'Network']
      items.forEach(item => {
        const menuItem = document.createElement('div')
        menuItem.textContent = item
        menuItem.style.cssText = `
          padding: 4px 12px;
          cursor: pointer;
          color: #333;
        `
        menuItem.onmouseover = () => menuItem.style.background = '#f0f0f0'
        menuItem.onmouseout = () => menuItem.style.background = 'transparent'
        menuItem.onclick = () => {
          if (item === 'Console') {
            window.open('about:blank', '_blank')?.document.write(`
              <script>
                console.log('DevTools enabled - paste this in original page console:');
                console.log('window.open(window.location.href, "_blank")');
              </script>
            `)
          }
          if (document.body.contains(menu)) {
            document.body.removeChild(menu)
          }
        }
        menu.appendChild(menuItem)
      })
      
      document.body.appendChild(menu)
      
      setTimeout(() => {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu)
        }
      }, 3000)
      
      return false
    }, true)

    // Allow F12
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault()
        // Open devtools in new window
        const devtoolsWindow = window.open('about:blank', '_blank', 'width=800,height=600')
        if (devtoolsWindow) {
          devtoolsWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>DevTools - Stats Page</title>
              <style>
                body { font-family: monospace; padding: 20px; }
                .console { background: #1e1e1e; color: #fff; padding: 10px; border-radius: 4px; margin: 10px 0; }
                .command { color: #4ec9b0; }
                .output { color: #d4d4d4; }
                button { background: #007acc; color: white; border: none; padding: 8px 16px; margin: 5px; border-radius: 4px; cursor: pointer; }
              </style>
            </head>
            <body>
              <h2>🔧 Stats Page DevTools</h2>
              <p>Console logs from stats page:</p>
              <div class="console" id="console">
                <div class="command">$ Loading logs...</div>
              </div>
              <button onclick="checkSupabase()">🔍 Check Supabase Connection</button>
              <button onclick="checkData()">📊 Check Data Loading</button>
              <button onclick="testAPI()">🧪 Test API Call</button>
              
              <script>
                // Listen for messages from parent
                window.addEventListener('message', (event) => {
                  if (event.data.type === 'console') {
                    const consoleDiv = document.getElementById('console')
                    const logDiv = document.createElement('div')
                    logDiv.innerHTML = '<div class="command">$ ' + event.data.message + '</div>'
                    consoleDiv.appendChild(logDiv)
                    consoleDiv.scrollTop = consoleDiv.scrollHeight
                  }
                });
                
                function checkSupabase() {
                  const consoleDiv = document.getElementById('console')
                  consoleDiv.innerHTML += '<div class="command">$ Checking Supabase...</div>'
                  consoleDiv.innerHTML += '<div class="output">URL: https://ic8ty5pE7fgVwD74QIzZkA_QDqNPbU9.supabase.co</div>'
                  consoleDiv.innerHTML += '<div class="output">Key: sb_publishable_ic8ty5pE7fgVwD74QIzZkA_QDqNPbU9</div>'
                  consoleDiv.scrollTop = consoleDiv.scrollHeight
                }
                
                function checkData() {
                  const consoleDiv = document.getElementById('console')
                  consoleDiv.innerHTML += '<div class="command">$ Checking data loading...</div>'
                  consoleDiv.innerHTML += '<div class="output">Looking for loadFromSupabase() calls...</div>'
                  consoleDiv.scrollTop = consoleDiv.scrollHeight
                }
                
                function testAPI() {
                  const consoleDiv = document.getElementById('console')
                  consoleDiv.innerHTML += '<div class="command">$ Testing API call...</div>'
                  fetch('/api/supabase-stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: 'yofam0' })
                  }).then(r => r.json()).then(data => {
                    consoleDiv.innerHTML += '<div class="output">API Response: ' + JSON.stringify(data, null, 2) + '</div>'
                  }).catch(err => {
                    consoleDiv.innerHTML += '<div class="output">API Error: ' + err.message + '</div>'
                  })
                  consoleDiv.scrollTop = consoleDiv.scrollHeight
                }
                
                // Auto-check on load
                setTimeout(checkSupabase, 500)
              </script>
            </body>
            </html>
          `)
        }
        return false
      }
    })

    // Override console to capture logs
    const originalLog = console.log
    const originalError = console.error
    
    console.log = function(...args) {
      originalLog.apply(console, args)
      // Send to devtools window if open
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: 'console',
            message: args.join(' ')
          }, '*')
        }
      } catch (e) {
        // Ignore cross-origin errors
      }
    }
    
    console.error = function(...args) {
      originalError.apply(console, args)
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            type: 'console',
            message: 'ERROR: ' + args.join(' ')
          }, '*')
        }
      } catch (e) {
        // Ignore cross-origin errors
      }
    }

    return () => {
      // Restore original console on cleanup
      window.console = originalConsole
    }
  }, [])

  return null
}
