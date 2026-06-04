'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MembersPage() {
  const [members, setMembers] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. Load the existing members from Supabase when the page opens
  useEffect(() => {
    fetchMembers()
  }, [])

  async function fetchMembers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('first_name', { ascending: true })

    if (!error && data) {
      setMembers(data)
    }
    setLoading(false)
  }

  // 2. Handle saving a new member when you submit the form
  async function handleAddMember(e) {
    e.preventDefault()
    if (!firstName || !lastName || !phone) return alert('Please fill in all fields')

    const { error } = await supabase
      .from('members')
      .insert([{ first_name: firstName, last_name: lastName, phone_number: phone }])

    if (error) {
      alert('Error adding member: ' + error.message)
    } else {
      // Clear the form fields and refresh the list
      setFirstName('')
      setLastName('')
      setPhone('')
      fetchMembers()
    }
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold' }}>← Back to Dashboard</a>
      
      <h1 style={{ marginTop: '20px', color: '#111827' }}>👥 Chama Member Directory</h1>
      <p style={{ color: '#6b7280' }}>Add new members and view your active register.</p>

      {/* FORM TO ADD NEW MEMBER */}
      <form onSubmit={handleAddMember} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Register New Member</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            type="text" placeholder="First Name" value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', flex: '1' }}
          />
          <input 
            type="text" placeholder="Last Name" value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', flex: '1' }}
          />
          <input 
            type="text" placeholder="Phone Number (e.g. 07...)" value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #d1d5db', flex: '1' }}
          />
          <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Add Member
          </button>
        </div>
      </form>

      {/* DISPLAY MEMBERS LIST */}
      <h3>Active Members ({members.length})</h3>
      {loading ? (
        <p>Loading members from the database...</p>
      ) : members.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No members added yet. Use the form above to add your first member!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', background: '#f3f4f6' }}>
              <th style={{ padding: '10px' }}>Name</th>
              <th style={{ padding: '10px' }}>Phone Number</th>
              <th style={{ padding: '10px' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px', fontWeight: '500' }}>{member.first_name} {member.last_name}</td>
                <td style={{ padding: '10px', color: '#4b5563' }}>{member.phone_number}</td>
                <td style={{ padding: '10px', color: '#9ca3af', fontSize: '14px' }}>
                  {new Date(member.joined_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}