import { useState } from 'react'
import { db } from '../db/database'
import type { Account } from '../db/database'

type Props = {
  accounts: Account[]
  onClose: () => void
  onCreated: () => void
}

type TransactionType = 'expense' | 'income' | 'transfer'
const expenseCategories = [
  'Продукти',
  'Транспорт',
  'Комуналка',
  'Аптека',
  'Діти',
  'Кафе',
  'Одяг',
  'Інше',
]

const incomeCategories = [
  'Зарплата',
  'Премія',
  'Подарунок',
  'Повернення боргу',
  'Інше',
]

export function AddTransactionModal({
  accounts,
  onClose,
  onCreated,
}: Props) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [accountFromId, setAccountFromId] = useState<number>()
  const [accountToId, setAccountToId] = useState<number>()
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState('')

  async function createTransaction() {
    const value = Number(amount)

    if (!value || value <= 0) return

    if (type === 'expense') {
      if (!accountFromId) return

      await db.transactions.add({
        type: 'expense',
        amount: value,
        accountFromId,
        category,
        comment,
        createdAt: new Date(),
      })

      const account = await db.accounts.get(accountFromId)

      if (account) {
        await db.accounts.update(accountFromId, {
          balance: account.balance - value,
        })
      }
    }

    if (type === 'income') {
      if (!accountToId) return

      await db.transactions.add({
        type: 'income',
        amount: value,
        accountToId,
        category,
        comment,
        createdAt: new Date(),
      })

      const account = await db.accounts.get(accountToId)

      if (account) {
        await db.accounts.update(accountToId, {
          balance: account.balance + value,
        })
      }
    }

    if (type === 'transfer') {
      if (!accountFromId || !accountToId) return
      if (accountFromId === accountToId) return

      await db.transactions.add({
        type: 'transfer',
        amount: value,
        accountFromId,
        accountToId,
        comment,
        createdAt: new Date(),
      })

      const fromAccount = await db.accounts.get(accountFromId)
      const toAccount = await db.accounts.get(accountToId)

      if (fromAccount) {
        await db.accounts.update(accountFromId, {
          balance: fromAccount.balance - value,
        })
      }

      if (toAccount) {
        await db.accounts.update(accountToId, {
          balance: toAccount.balance + value,
        })
      }
    }

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
          Нова операція
        </h2>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {(['expense', 'income', 'transfer'] as TransactionType[]).map(item => (
            <button
              key={item}
              onClick={() => setType(item)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                background: type === item ? '#111827' : '#E5E7EB',
                color: type === item ? 'white' : '#111827',
                fontWeight: 'bold',
              }}
            >
              {item === 'expense' && 'Витрата'}
              {item === 'income' && 'Дохід'}
              {item === 'transfer' && 'Переказ'}
            </button>
          ))}
        </div>

        <input
          placeholder="Сума"
          value={amount}
          onChange={e => setAmount(e.target.value)}
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

        {(type === 'expense' || type === 'transfer') && (
          <select
            value={accountFromId ?? ''}
            onChange={e => setAccountFromId(Number(e.target.value))}
            style={{
              width: '100%',
              marginTop: 16,
              padding: 14,
              borderRadius: 12,
              border: '1px solid #ddd',
              fontSize: 18,
              boxSizing: 'border-box',
            }}
          >
            <option value="">З якого рахунку</option>

            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        )}

        {(type === 'income' || type === 'transfer') && (
          <select
            value={accountToId ?? ''}
            onChange={e => setAccountToId(Number(e.target.value))}
            style={{
              width: '100%',
              marginTop: 16,
              padding: 14,
              borderRadius: 12,
              border: '1px solid #ddd',
              fontSize: 18,
              boxSizing: 'border-box',
            }}
          >
            <option value="">На який рахунок</option>

            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        )}
{type !== 'transfer' && (
  <select
    value={category}
    onChange={e => setCategory(e.target.value)}
    style={{
      width: '100%',
      marginTop: 16,
      padding: 14,
      borderRadius: 12,
      border: '1px solid #ddd',
      fontSize: 18,
      boxSizing: 'border-box',
    }}
  >
    <option value="">Оберіть категорію</option>

    {(type === 'expense' ? expenseCategories : incomeCategories).map(item => (
      <option key={item} value={item}>
        {item}
      </option>
    ))}
  </select>
)}
        <input
          placeholder="Коментар"
          value={comment}
          onChange={e => setComment(e.target.value)}
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

        <button
          onClick={createTransaction}
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
          Зберегти
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