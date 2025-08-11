import { useState } from 'react'
import './App.css'

type User = {
  id: number
  username: string
  password: string // added since API includes it
}

async function getCredentials(): Promise<User[]> {
  const res = await fetch('https://localhost:7108/api/Credentials/GetAll', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const data = await res.json()

  if (!Array.isArray(data.value)) {
    throw new Error('API did not return an array in "value"')
  }

  return data.value
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

      {Array.isArray(users) && users.length > 0 && (
        <>
          <p>IDs: {users.map(u => u.id).join(', ')}</p>
          <ul>
            {users.map(u => (
              <li key={u.id}>
                {u.username}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default App
