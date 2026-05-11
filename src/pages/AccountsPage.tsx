
import { exportBackup, importBackup } from '../services/backup'
import { AddAccountModal } from '../components/AddAccountModal'
import { CategoryChart } from '../components/CategoryChart'
import { TransactionList } from '../components/TransactionList'
import type { Transaction } from '../db/database'
import { useEffect, useState } from 'react'
import { db } from '../db/database'
import type { Account } from '../db/database'
import { AccountCard } from '../components/AccountCard'
import { AddTransactionModal } from '../components/AddTransactionModal'

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)

  useEffect(() => {
   loadData()
  }, [])
async function handleImportBackup(
  event: React.ChangeEvent<HTMLInputElement>
) {
  const file = event.target.files?.[0]

  if (!file) return

  try {
    await importBackup(file)
    await loadData()
    alert('Backup успішно імпортовано')
  } catch {
    alert('Не вдалося імпортувати backup')
  }

  event.target.value = ''
}
  async function loadData() {
  const accountsData = await db.accounts.toArray()
  const transactionsData = await db.transactions
    .orderBy('createdAt')
    .reverse()
    .limit(10)
    .toArray()

  setAccounts(accountsData)
  setTransactions(transactionsData)
}

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '24px', fontFamily: 'Arial' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#111827' }}>
          Family Budget
        </h1>

        <p style={{ marginTop: '10px', color: '#6b7280' }}>
          Загальний баланс
        </p>

        <div style={{ fontSize: '52px', fontWeight: 'bold', marginTop: '10px', marginBottom: '24px', color: '#111827' }}>
          {totalBalance.toLocaleString('uk-UA')} ₴
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            width: '100%',
            padding: 16,
            borderRadius: 16,
            border: 'none',
            background: '#111827',
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 24,
            cursor: 'pointer',
          }}
        >
          + Додати витрату
        </button>

        {accounts.map(account => (
          <AccountCard
            key={account.id ?? account.name}
            name={account.name}
            balance={account.balance}
            color={account.color}
          />
        ))}
        <button
  onClick={() => setIsAddAccountOpen(true)}
  style={{
    width: '100%',
    padding: 16,
    borderRadius: 16,
    border: 'none',
    background: '#E5E7EB',
    color: '#111827',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    cursor: 'pointer',
  }}
>
  + Додати рахунок
  <div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 24,
  }}
>
  <button
    onClick={exportBackup}
    style={{
      padding: 14,
      borderRadius: 16,
      border: 'none',
      background: '#2563EB',
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      cursor: 'pointer',
    }}
  >
    Експорт
  </button>

  <label
    style={{
      padding: 14,
      borderRadius: 16,
      background: '#059669',
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      cursor: 'pointer',
    }}
  >
    Імпорт
    <input
      type="file"
      accept="application/json"
      onChange={handleImportBackup}
      style={{ display: 'none' }}
    />
  </label>
</div>
</button>
      </div>

      {isModalOpen && (
        <AddTransactionModal
          accounts={accounts}
          onClose={() => setIsModalOpen(false)}
         onCreated={loadData}
        />
      )}
      {isAddAccountOpen && (
  <AddAccountModal
    onClose={() => setIsAddAccountOpen(false)}
    onCreated={loadData}
  />
)}
      <CategoryChart transactions={transactions} />
      <TransactionList
  transactions={transactions}
  accounts={accounts}
/>
    </div>
  )
}