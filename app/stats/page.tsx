"use client"

import { useState, useEffect } from "react"
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
  const [telegramData, setTelegramData] = useState({ visits: [], carts: [] })
  const [isLoading, setIsLoading] = useState(false)

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
    
    // Load data directly from Supabase
    loadFromSupabase()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadFromSupabase, refreshInterval)
    
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

  const getSourceStats = () => {
    const sourceCounts: any = {}
    visits.forEach(visit => {
      const source = visit.source || 'Unknown'
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })
    return sourceCounts
  }

  const getTopSource = () => {
    const sourceStats = getSourceStats()
    const sources = Object.entries(sourceStats)
    if (sources.length === 0) return { source: 'Aucune', count: 0, percentage: 0 }
    
    const total = visits.length
    const [topSource, topCount] = sources.sort(([,a], [,b]) => (b as number) - (a as number))[0]
    
    return {
      source: topSource,
      count: topCount as number,
      percentage: total > 0 ? Math.round(((topCount as number) / total) * 100) : 0
    }
  }

  const getSourceBreakdown = () => {
    const sourceStats = getSourceStats()
    const total = visits.length
    
    return Object.entries(sourceStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .map(([source, count]) => ({
        source,
        count: count as number,
        percentage: total > 0 ? Math.round(((count as number) / total) * 100) : 0
      }))
  }

  // Load data directly from Supabase
  const loadFromSupabase = async () => {
    setIsLoading(true)
    try {
      console.log('Loading from Supabase...')
      
      const response = await fetch('/api/supabase-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: correctPassword })
      })
      
      console.log('Supabase API response status:', response.status)
      const data = await response.json()
      console.log('Supabase API response:', data)
      
      if (data.success) {
        const supabaseVisits = data.supabaseVisits || []
        const supabaseCarts = data.supabaseCarts || []
        
        console.log('Setting data:', { visits: supabaseVisits.length, carts: supabaseCarts.length })
        
        setTelegramData({
          visits: supabaseVisits,
          carts: supabaseCarts
        })
        setVisits(supabaseVisits)
        setCart(supabaseCarts)
        
        // Calculate live visitors (visits in last 5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
        const recentVisits = supabaseVisits.filter((visit: any) => visit.ts > fiveMinutesAgo)
        setLiveVisitors(new Set(recentVisits.map((visit: any) => visit.ip)).size)
        
        console.log('Data loaded successfully')
      } else {
        console.error('Supabase API error:', data)
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error)
    }
    setIsLoading(false)
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
  const topSource = getTopSource()
  const sourceBreakdown = getSourceBreakdown()

  if (!mounted) return null

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)] mb-2">
                🔐 Dashboard
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Accès réservé à l'administration
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Accéder au dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Stats dashboard
  return (
    <div className="min-h-screen bg-gray-50 fixed inset-0 overflow-auto">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-8 sm:py-12 md:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">
              📊 Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
            >
              Déconnexion
            </button>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 max-w-4xl mx-auto text-gray-600 font-[var(--font-dm-sans)]">
            Statistiques en temps réel - Dernière mise à jour: {new Date().toLocaleTimeString('fr-CA')}
          </p>
        </div>
      </section>

      {/* Live Visitors Alert */}
      <section className="px-4 sm:px-6 py-3 sm:py-4 bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold text-sm sm:text-base">
                {liveVisitors} visiteur(s) en direct (derniers 5 min)
              </span>
            </div>
            <div className="text-green-600 text-xs sm:text-sm">
              • {liveStats.uniqueVisitors} unique(s) dernière heure • {liveStats.avgPerMinute}/min moyenne
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 sm:px-6 py-6 sm:py-8 md:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center border border-gray-200">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">{uniqueVisitors}</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm">Visiteurs Uniques</div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center border border-gray-200">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2">{todayUniqueVisitors}</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm">Visiteurs Uniques Aujourd'hui</div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center border border-gray-200">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600 mb-1 sm:mb-2">{uniqueCarts}</div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm">Paniers Uniques</div>
            </div>
            <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center border border-gray-200">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-1 sm:mb-2">
                {uniqueVisitors > 0 ? Math.round((uniqueCarts / uniqueVisitors) * 100) : 0}%
              </div>
              <div className="text-gray-600 font-medium text-xs sm:text-sm">Taux Conversion Réel</div>
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)] mb-4 sm:mb-6">📅 Stats de la Semaine</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{weeklyStats.visitors}</div>
                <div className="text-gray-600 text-sm sm:text-base">Visiteurs Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">{weeklyStats.carts}</div>
                <div className="text-gray-600 text-sm sm:text-base">Paniers Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">{weeklyStats.conversion}%</div>
                <div className="text-gray-600 text-sm sm:text-base">Taux Conversion</div>
              </div>
            </div>
          </div>

          {/* Monthly Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)] mb-4 sm:mb-6">📆 Stats du Mois</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">{monthlyStats.visitors}</div>
                <div className="text-gray-600 text-sm sm:text-base">Visiteurs Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">{monthlyStats.carts}</div>
                <div className="text-gray-600 text-sm sm:text-base">Paniers Uniques</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">{monthlyStats.conversion}%</div>
                <div className="text-gray-600 text-sm sm:text-base">Taux Conversion</div>
              </div>
            </div>
          </div>

          {/* Source Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)] mb-4 sm:mb-6">🔗 Sources de Trafic</h3>
            
            {/* Top Source Card */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-blue-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Source Principale</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800">{topSource.source}</div>
                  <div className="text-sm sm:text-base md:text-lg text-blue-600">{topSource.count} visites ({topSource.percentage}%)</div>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl">🔗</div>
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Répartition des Sources</h4>
                <div className="space-y-2 sm:space-y-3">
                  {sourceBreakdown.length > 0 ? (
                    sourceBreakdown.slice(0, 5).map((item, index) => (
                      <div key={item.source} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-blue-800">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-800 text-xs sm:text-sm">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-gray-600 text-xs sm:text-sm">{item.count}</span>
                          <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div 
                              className="bg-blue-600 h-1.5 sm:h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-gray-700 w-8 sm:w-12 text-right">{item.percentage}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4 sm:py-8 text-sm sm:text-base">
                      Aucune source de trafic détectée
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Sources Détectées</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {sourceBreakdown.map((item) => (
                    <div key={item.source} className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 text-center">
                      <div className="text-lg sm:text-xl mb-1">
                        {item.source === 'Facebook' && '📘'}
                        {item.source === 'Instagram' && '📷'}
                        {item.source === 'TikTok' && '🎵'}
                        {item.source === 'Google' && '🔍'}
                        {item.source === 'Twitter' && '🐦'}
                        {item.source === 'LinkedIn' && '💼'}
                        {item.source === 'YouTube' && '📺'}
                        {item.source === 'Pinterest' && '📌'}
                        {item.source === 'Reddit' && '🤖'}
                        {item.source === 'Direct' && '🔗'}
                        {item.source === 'Unknown' && '❓'}
                        {['Facebook', 'Instagram', 'TikTok', 'Google', 'Twitter', 'LinkedIn', 'YouTube', 'Pinterest', 'Reddit', 'Direct', 'Unknown'].includes(item.source) === false && '🌐'}
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-800 truncate">{item.source}</div>
                      <div className="text-xs text-gray-600">{item.count} ({item.percentage}%)</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">📈 Pages Visitées</h2>
            <div className="flex gap-2 sm:gap-4 items-center">
              {isLoading && (
                <div className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
                  🔄 Chargement Supabase...
                </div>
              )}
              <select 
                className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                value={refreshInterval} 
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
              >
                <option value={5000}>5s</option>
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
                <option value={60000}>60s</option>
              </select>
              <button 
                className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                onClick={loadFromSupabase}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Pages Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 sm:mb-8 md:mb-12">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Page</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Visites</th>
                    <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900">Pourcentage</th>
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
                          <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                            <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                              {page}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-medium text-xs sm:text-sm">{Number(count) || 0}</td>
                          <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm">
                            {totalVisits > 0 ? Math.round(((Number(count) || 0) / totalVisits) * 100) : 0}%
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 text-center text-gray-500 text-xs sm:text-sm">
                        Aucune visite enregistrée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Carts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">🛒 Ajouts Panier Récents</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900">Produit</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {carts.length > 0 ? (
                      carts.slice(-5).reverse().map((cart, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-3 md:px-4 py-2 font-medium text-xs sm:text-sm truncate max-w-[150px]">{cart.product}</td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-600">{formatTime(cart.ts)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8 text-center text-gray-500 text-xs sm:text-sm">
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
              <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#1a1a1a] font-[var(--font-dm-sans)]">🕐 Visites Récentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900">Page</th>
                      <th className="px-2 sm:px-3 md:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {visits.length > 0 ? (
                      visits.slice(-5).reverse().map((visit, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-2 sm:px-3 md:px-4 py-2">
                            <span className="inline-block px-1 sm:px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                              {visit.page}
                            </span>
                          </td>
                          <td className="px-2 sm:px-3 md:px-4 py-2 text-xs sm:text-sm text-gray-600">{formatTime(visit.ts)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-2 sm:px-3 md:px-4 py-4 sm:py-6 md:py-8 text-center text-gray-500 text-xs sm:text-sm">
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
    </div>
  )
}
