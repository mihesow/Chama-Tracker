'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ membersCount: 0, totalPool: 0, activeLoans: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  async function fetchDashboardStats() {
    setLoading(true)
    
    // 1. Get total number of members
    const { count: membersCount } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })

    // 2. In a later step, we will calculate the actual sums from contributions/loans.
    // For now, let's pull placeholder values or zeroes safely.
    setStats({
      membersCount: membersCount || 0,
      totalPool: 0, // We will link this to contributions next!
      activeLoans: 0
    })
    setLoading(false)
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#111827', margin: '0 0 5px 0' }}>🇰🇪 open-chama Dashboard</h1>
        <p style={{ color: '#6b7280', margin: 0 }}>Your central, open-source digital record book.</p>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 5px 0', fontWeight: 'bold' }}>TOTAL REGISTERED MEMBERS</p>
          <h2 style={{ margin: 0, color: '#2563eb', fontSize: '32px' }}>{loading ? '...' : stats.membersCount}</h2>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 5px 0', fontWeight: 'bold' }}>TOTAL POOL BALANCE</p>
          <h2 style={{ margin: 0, color: '#16a34a', fontSize: '32px' }}>Ksh {stats.totalPool.toLocaleString()}</h2>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', flex: '1', minWidth: '200px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 5px 0', fontWeight: 'bold' }}>ACTIVE LOANS OUTSTANDING</p>
          <h2 style={{ margin: 0, color: '#dc2626', fontSize: '32px' }}>Ksh {stats.activeLoans.toLocaleString()}</h2>
        </div>

      </div>

      {/* NAVIGATION QUICK LINKS */}
      <h3 style={{ color: '#374151', marginBottom: '15px' }}>Management Quick Links</h3>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        
        <a href="/members" style={{ textDecoration: 'none', background: '#2563eb', color: '#fff', padding: '15px 25px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block' }}>
          👥 Manage Members Register
        </a>

        <a href="/contributions" style={{ textDecoration: 'none', background: '#10b981', color: '#fff', padding: '15px 25px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block' }}>
          💰 Record Weekly Contributions
        </a>

        <a href="/loans" style={{ textDecoration: 'none', background: '#4b5563', color: '#fff', padding: '15px 25px', borderRadius: '6px', fontWeight: 'bold', display: 'inline-block' }}>
          📉 Track Loans & Interest
        </a>

      </div>

    </div>
  )
}