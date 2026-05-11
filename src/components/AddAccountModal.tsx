import { useState } from 'react'
import { db } from '../db/database'

type Props = {
  onClose: () => void
  onCreated: () => void
}

export function AddAccountModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('0')
  const [color, setColor] = useState('#111827')

  async function createAccount() {
    if (!name.trim()) return

    await db.accounts.add({
      name: name.trim(),
      balance: Number(balance) || 0,
      color,
    })

    onCreated()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: 24,
          borderRadius: 24,
          width: '100%',
          maxWidth: 420,
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 'bold' }}>
          Новий рахунок
        </h2>

        <input
          placeholder="Назва рахунку"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%',
            marginTop: 20,
            padding: 14,
            borderRadius: 12,
            border: '1px solid #ddd',
            fontSize: 18,
            boxSizing: 'border-box',
          }}
        />

        <input
          placeholder="Початковий баланс"
          value={balance}
          onChange={e => setBalance(e.target.value)}
          style={{
            width: '100%',
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            border: '1px solid #ddd',
            fontSize: 18,
            boxSizing: 'border-box',
          }}
        />

        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          style={{
            width: '100%',
            marginTop: 16,
            height: 50,
            borderRadius: 12,
            border: '1px solid #ddd',
          }}
        />

        <button
          onClick={createAccount}
          style={{
            width: '100%',
            marginTop: 24,
            padding: 16,
            borderRadius: 16,
            border: 'none',
            background: '#111827',
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Створити рахунок
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: 12,
            padding: 14,
            borderRadius: 16,
            border: 'none',
            background: '#E5E7EB',
            color: '#111827',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Скасувати
        </button>
      </div>
    </div>
  )
}