'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ContributionsPage() {
  const [members, setMembers] = useState([])
  const [contributions, setContributions] = useState([])
  const [selectedMember, setSelectedMember] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInitialData()
  }, [])

  async function fetchInitialData() {
    setLoading(true)
    
    // 1. Fetch members for our dropdown menu selector
    const { data: memberData } = await supabase
      .from('members')
      .select('id, first_name, last_name')
      .order('first_name', { ascending: true })
    if (memberData) setMembers(memberData)

    // 2. Fetch recent contribution transactions
    const { data: contribData } = await supabase
      .from('contributions')
      .select(`
        id,
        amount,
        contributed_at,
        members ( first_name, last_name )
      `)
      .order('contributed_at', { ascending: false })
    if (contribData) setContributions(contribData)

    setLoading(false)
  }

  async function handleAddContribution(e) {
    e.preventDefault()
    if (!selectedMember || !amount) return alert('Please select a member and enter an amount')

    const { error } = await supabase
      .from('contributions')
      .insert([{ member_id: selectedMember, amount: parseFloat(amount) }])

    if (error) {
      alert('Error recording payment: ' + error.message)
    } else {
      setAmount('')
      fetchInitialData() // Refresh list to update numbers
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>← Back to Dashboard</a>
      
      <h1 style={{ marginTop: '20px', color: '#111827' }}>💰 Weekly Contributions Ledger</h1>
      <p style={{ color: '#6b7280' }}>Select a member to record an M-Pesa deposit entry manually.</p>

      {/* RECORD CONTRIBUTION FORM */}
      <form onSubmit={handleAddContribution} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Log Received Payment</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          
          <select 
            value={selectedMember} 
            onChange={(e) => setSelectedMember(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', flex: '1', minWidth: '200px' }}
          >
            <option value="">-- Select Paying Member --</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
            ))}
          </select>

          <input 
            type="number" placeholder="Amount (Ksh)" value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', width: '15px', flex: '1' }}
          />

          <button type="submit" style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Record Payment
          </button>
        </div>
      </form>

      {/* RECENT ENTRIES TABLE */}
      <h3>Recent Deposit Entries</h3>
      {loading ? (
        <p>Loading ledger balances...</p>
      ) : contributions.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No contributions tracked yet. Enter an amount above to begin your digital ledger.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f3f4f6' }}>
              <th style={{ padding: '10px' }}>Member</th>
              <th style={{ padding: '10px' }}>Amount Deposited</th>
              <th style={{ padding: '10px' }}>Date Recorded</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px', fontWeight: '500' }}>
                  {c.members?.first_name} {c.members?.last_name}
                </td>
                <td style={{ padding: '10px', color: '#16a34a', fontWeight: 'bold' }}>
                  Ksh {c.amount.toLocaleString()}
                </td>
                <td style={{ padding: '10px', color: '#9ca3af', fontSize: '14px' }}>
                  {new Date(c.contributed_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}