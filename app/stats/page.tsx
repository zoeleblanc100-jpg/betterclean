"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useI18n } from "@/lib/i18n-context"

export default function StatsPage() {
  const [mounted, setMounted] = useState(false)
  const { t } = useI18n()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [visits, setVisits] = useState<any[]>([])
  const [carts, setCart] = useState<any[]>([])
  const [refreshInterval, setRefreshInterval] = useState(10000)
  const [liveVisitors, setLiveVisitors] = useState(0)
  const [syncStatus, setSyncStatus] = useState("")
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)

  const correctPassword = "yofam0"

  useEffect(() => {
    setMounted(true)
    
    // Check if already authenticated
    const auth = localStorage.getItem('stats-auth')
    if (auth === correctPassword) {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (!mounted || !isAuthenticated) return
    
    // Load data from localStorage
    const loadData = () => {
      try {
        const storedVisits = JSON.parse(localStorage.getItem('bc_visits') || '[]')
        const storedCarts = JSON.parse(localStorage.getItem('bc_carts') || '[]')
        setVisits(storedVisits)
        setCart(storedCarts)
        
        // Calculate live visitors (visits in last 5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
        const recentVisits = storedVisits.filter((visit: any) => visit.ts > fiveMinutesAgo)
        const uniqueIPs = new Set(recentVisits.map((visit: any) => visit.ip))
        setLiveVisitors(uniqueIPs.size)
        
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
  }, [mounted, isAuthenticated, refreshInterval])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === correctPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('stats-auth', correctPassword)
      setError("")
    } else {
      setError("Mot de passe incorrect")
      setPassword("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('stats-auth')
    setPassword("")
  }

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

  const getUniqueVisitors = () => {
    const uniqueIPs = new Set(visits.map(visit => visit.ip))
    return uniqueIPs.size
  }

  const getTodayUniqueVisitors = () => {
    const today = new Date().toDateString()
    const todayVisits = visits.filter(visit => new Date(visit.ts).toDateString() === today)
    const uniqueIPs = new Set(todayVisits.map(visit => visit.ip))
    return uniqueIPs.size
  }

  const getUniqueCarts = () => {
    const uniqueIPs = new Set(carts.map(cart => cart.ip))
    return uniqueIPs.size
  }

  const getWeeklyStats = () => {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    const weeklyVisits = visits.filter(visit => visit.ts > oneWeekAgo)
    const weeklyCarts = carts.filter(cart => cart.ts > oneWeekAgo)
    const weeklyUniqueVisitors = new Set(weeklyVisits.map(visit => visit.ip))
    const weeklyUniqueCarts = new Set(weeklyCarts.map(cart => cart.ip))
    
    return {
      visitors: weeklyUniqueVisitors.size,
      carts: weeklyUniqueCarts.size,
      conversion: weeklyUniqueVisitors.size > 0 ? Math.round((weeklyUniqueCarts.size / weeklyUniqueVisitors.size) * 100) : 0
    }
  }

  const getMonthlyStats = () => {
    const oneMonthAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const monthlyVisits = visits.filter(visit => visit.ts > oneMonthAgo)
    const monthlyCarts = carts.filter(cart => cart.ts > oneMonthAgo)
    const monthlyUniqueVisitors = new Set(monthlyVisits.map(visit => visit.ip))
    const monthlyUniqueCarts = new Set(monthlyCarts.map(cart => cart.ip))
    
    return {
      visitors: monthlyUniqueVisitors.size,
      carts: monthlyUniqueCarts.size,
      conversion: monthlyUniqueVisitors.size > 0 ? Math.round((monthlyUniqueCarts.size / monthlyUniqueVisitors.size) * 100) : 0
    }
  }

  // Sync data from Telegram
  const syncFromTelegram = async () => {
    setSyncStatus("Synchronisation avec Telegram...")
    try {
      const response = await fetch('/api/sync-telegram-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: correctPassword })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Get existing data
        const existingVisits = JSON.parse(localStorage.getItem('bc_visits') || '[]')
        const existingCarts = JSON.parse(localStorage.getItem('bc_carts') || '[]')
        
        // Merge Telegram data with existing data
        const mergedVisits = [...existingVisits, ...data.telegramVisits || []]
        const mergedCarts = [...existingCarts, ...data.telegramCarts || []]
        
        // Save merged data to localStorage
        localStorage.setItem('bc_visits', JSON.stringify(mergedVisits))
        localStorage.setItem('bc_carts', JSON.stringify(mergedCarts))
        
        setSyncStatus(`✅ Synchronisé: ${data.telegramVisits || 0} nouvelles visites, ${data.telegramCarts || 0} nouveaux paniers`)
        setLastSyncTime(Date.now())
        
        // Force reload data
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setSyncStatus("❌ Erreur de synchronisation")
      }
    } catch (error) {
      setSyncStatus("❌ Erreur réseau")
      console.error('Sync error:', error)
    }
    
    setTimeout(() => setSyncStatus(""), 5000)
  }

  const getLiveStats = () => {
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    const recentVisits = visits.filter(visit => visit.ts > oneHourAgo)
    const uniqueIPs = new Set(recentVisits.map(visit => visit.ip))
    return {
      totalRecent: recentVisits.length,
      uniqueVisitors: uniqueIPs.size,
      avgPerMinute: Math.round(recentVisits.length / 60)
    }
  }

  const pageStats = getPageStats()
  const todayVisits = visits.length
  const totalVisits = visits.length
  const uniqueVisitors = getUniqueVisitors()
  const todayUniqueVisitors = getTodayUniqueVisitors()
  const uniqueCarts = getUniqueCarts()
  const weeklyStats = getWeeklyStats()
  const monthlyStats = getMonthlyStats()
  const liveStats = getLiveStats()

  if (!mounted) return null

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)] mb-2">
                🔐 Stats Dashboard
              </h1>
              <p className="text-gray-600">
                Accès réservé à l'administration
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Accéder aux stats
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Stats dashboard
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">
              📊 BetterClean Stats Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Déconnexion
            </button>
          </div>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-600 font-[var(--font-dm-sans)]">
            Statistiques en temps réel - Dernière mise à jour: {new Date().toLocaleTimeString('fr-CA')}
          </p>
        </div>
      </section>

      {/* Live Visitors Alert */}
      <section className="px-4 py-4 bg-green-50 border-b border-green-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold">
                {liveVisitors} visiteur(s) en direct (derniers 5 min)
              </span>
            </div>
            <div className="text-green-600 text-sm">
              • {liveStats.uniqueVisitors} unique(s) dernière heure • {liveStats.avgPerMinute}/min moyenne
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center border border-gray-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">{uniqueVisitors}</div>
              <div className="text-gray-600 font-medium">Visiteurs Uniques</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center border border-gray-200">
              <div className="text-4xl font-bold text-green-600 mb-2">{todayUniqueVisitors}</div>
              <div className="text-gray-600 font-medium">Visiteurs Uniques Aujourd'hui</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center border border-gray-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">{uniqueCarts}</div>
              <div className="text-gray-600 font-medium">Paniers Uniques</div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center border border-gray-200">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {uniqueVisitors > 0 ? Math.round((uniqueCarts / uniqueVisitors) * 100) : 0}%
              </div>
              <div className="text-gray-600 font-medium">Taux Conversion Réel</div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)] mb-6">📅 Stats de la Semaine</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{weeklyStats.visitors}</div>
                <div className="text-gray-600">Visiteurs Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{weeklyStats.carts}</div>
                <div className="text-gray-600">Paniers Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{weeklyStats.conversion}%</div>
                <div className="text-gray-600">Taux Conversion</div>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
            <h3 className="text-2xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)] mb-6">📆 Stats du Mois</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{monthlyStats.visitors}</div>
                <div className="text-gray-600">Visiteurs Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{monthlyStats.carts}</div>
                <div className="text-gray-600">Paniers Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">{monthlyStats.conversion}%</div>
                <div className="text-gray-600">Taux Conversion</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">📈 Pages Visitées</h2>
            <div className="flex gap-4 items-center">
              {syncStatus && (
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {syncStatus}
                </div>
              )}
              <button 
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={syncFromTelegram}
              >
                🔄 Sync Telegram
              </button>
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={refreshInterval} 
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
              >
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
                <option value={60000}>60s</option>
              </select>
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {lastSyncTime && (
            <div className="mb-4 text-sm text-gray-600">
              Dernière synchronisation Telegram: {new Date(lastSyncTime).toLocaleString('fr-CA')}
            </div>
          )}

          {/* Pages Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Page</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Visites</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pourcentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(pageStats).length > 0 ? (
                    Object.entries(pageStats)
                      .sort(([,a], [,b]) => {
                        const numA = Number(a) || 0
                        const numB = Number(b) || 0
                        return numB - numA
                      })
                      .map(([page, count]) => (
                        <tr key={page} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {page}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium">{Number(count) || 0}</td>
                          <td className="px-6 py-4">
                            {totalVisits > 0 ? Math.round(((Number(count) || 0) / totalVisits) * 100) : 0}%
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                        Aucune visite enregistrée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Carts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">🛒 Ajouts Panier Récents</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Produit</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {carts.length > 0 ? (
                      carts.slice(-5).reverse().map((cart, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{cart.product}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{formatTime(cart.ts)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                          Aucun ajout panier enregistré
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Visits */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">🕐 Visites Récentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Page</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {visits.length > 0 ? (
                      visits.slice(-5).reverse().map((visit, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                              {visit.page}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{formatTime(visit.ts)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                          Aucune visite enregistrée
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
