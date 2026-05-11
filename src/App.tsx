import { useEffect, useState } from 'react'
import { AccountsPage } from './pages/AccountsPage'
import { seedDatabase } from './services/seed'

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedDatabase().then(() => setReady(true))
  }, [])

  if (!ready) {
    return <div style={{ padding: 40 }}>Завантаження...</div>
  }

  return <AccountsPage />
}

export default App