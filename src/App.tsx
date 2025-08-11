import { useState } from 'react'
import './App.css'

type User = {
  id: number
  username: string
  // add other fields if needed
}

async function getCredentials(): Promise<User[]> {
  const res = await fetch('https://localhost:5001/api/credentials', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: User[] = await res.json()
  return data
}

function App() {
  const [users, setUsers] = useState<User[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCredentials()
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={load} disabled={loading}>
        {loading ? 'Loading…' : 'Load credentials'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users && (
        <>
          <p>IDs: {users.map(u => u.id).join(', ')}</p>
          <ul>
            {users.map(u => (
              <li key={u.id}>{u.username}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App
