"use client"

import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function StatsPage() {
  const [visits, setVisits] = useState<any[]>([])
  const [carts, setCart] = useState<any[]>([])
  const [refreshInterval, setRefreshInterval] = useState(10000)

  useEffect(() => {
    // Load data from localStorage
    const loadData = () => {
      try {
        const storedVisits = JSON.parse(localStorage.getItem('bc_visits') || '[]')
        const storedCarts = JSON.parse(localStorage.getItem('bc_carts') || '[]')
        setVisits(storedVisits)
        setCart(storedCarts)
      } catch (error) {
        console.error('Error loading stats:', error)
        setVisits([])
        setCart([])
      }
    }

    loadData()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, refreshInterval)
    
    return () => clearInterval(interval)
  }, [refreshInterval])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fr-CA')
  }

  const getPageStats = () => {
    const pageCounts: any = {}
    visits.forEach(visit => {
      pageCounts[visit.page] = (pageCounts[visit.page] || 0) + 1
    })
    return pageCounts
  }

  const getTodayVisits = () => {
    const today = new Date().toDateString()
    return visits.filter(visit => new Date(visit.ts).toDateString() === today).length
  }

  const pageStats = getPageStats()
  const todayVisits = getTodayVisits()
  const totalVisits = visits.length
  const totalCarts = carts.length

  return (
    <>
      <Head>
        <title>BetterClean - Stats Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; }
          .dashboard { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; background: linear-gradient(135deg, #3b82f6, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .header p { color: #94a3b8; font-size: 1.1rem; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
          .stat-card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; transition: transform 0.2s, box-shadow 0.2s; }
          .stat-card:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
          .stat-number { font-size: 2.5rem; font-weight: 700; color: #3b82f6; margin-bottom: 8px; }
          .stat-label { color: #94a3b8; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
          .section { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
          .section-title { font-size: 1.3rem; font-weight: 600; margin-bottom: 20px; color: #f8fafc; }
          .table { width: 100%; border-collapse: collapse; }
          .table th { background: #334155; padding: 12px; text-align: left; font-weight: 600; color: #f8fafc; }
          .table td { padding: 12px; border-bottom: 1px solid #334155; }
          .table tr:hover { background: #334155; }
          .page-badge { display: inline-block; padding: 4px 8px; background: #3b82f6; color: white; border-radius: 4px; font-size: 0.8rem; }
          .refresh-btn { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
          .refresh-btn:hover { background: #2563eb; }
          .controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .interval-select { background: #334155; color: #f8fafc; border: 1px solid #475569; padding: 8px 12px; border-radius: 6px; }
          .empty { text-align: center; padding: 40px; color: #94a3b8; }
        `}</style>
      </Head>

      <div className="dashboard">
        <div className="header">
          <h1>BetterClean Stats Dashboard</h1>
          <p>📊 Statistiques en temps réel - Dernière mise à jour: {new Date().toLocaleTimeString('fr-CA')}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{totalVisits}</div>
            <div className="stat-label">Visites Totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{todayVisits}</div>
            <div className="stat-label">Visites Aujourd'hui</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalCarts}</div>
            <div className="stat-label">Ajouts Panier</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalVisits > 0 ? Math.round((totalCarts / totalVisits) * 100) : 0}%</div>
            <div className="stat-label">Taux Conversion</div>
          </div>
        </div>

        <div className="section">
          <div className="controls">
            <h2 className="section-title">📈 Pages Visitées</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                className="interval-select" 
                value={refreshInterval} 
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
              >
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
                <option value={60000}>60s</option>
              </select>
              <button className="refresh-btn" onClick={() => window.location.reload()}>🔄 Refresh</button>
            </div>
          </div>
          
          {Object.keys(pageStats).length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Visites</th>
                  <th>Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(pageStats)
                  .sort(([,a], [,b]) => {
                    const numA = Number(a) || 0
                    const numB = Number(b) || 0
                    return numB - numA
                  })
                  .map(([page, count]) => (
                    <tr key={page}>
                      <td><span className="page-badge">{page}</span></td>
                      <td>{Number(count) || 0}</td>
                      <td>{totalVisits > 0 ? Math.round(((Number(count) || 0) / totalVisits) * 100) : 0}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="empty">Aucune visite enregistrée</div>
          )}
        </div>

        <div className="section">
          <h2 className="section-title">🛒 Ajouts Panier</h2>
          {carts.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Date</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {carts.slice(-10).reverse().map((cart, index) => (
                  <tr key={index}>
                    <td>{cart.product}</td>
                    <td>{formatTime(cart.ts)}</td>
                    <td>{cart.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty">Aucun ajout panier enregistré</div>
          )}
        </div>

        <div className="section">
          <h2 className="section-title">🕐 Dernières Visites</h2>
          {visits.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Date</th>
                  <th>IP</th>
                </tr>
              </thead>
              <tbody>
                {visits.slice(-10).reverse().map((visit, index) => (
                  <tr key={index}>
                    <td><span className="page-badge">{visit.page}</span></td>
                    <td>{formatTime(visit.ts)}</td>
                    <td>{visit.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty">Aucune visite enregistrée</div>
          )}
        </div>
      </div>
    </>
  )
}
