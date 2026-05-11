import type { Account, Transaction } from '../db/database'

type Props = {
  transactions: Transaction[]
  accounts: Account[]
}

export function TransactionList({ transactions, accounts }: Props) {
  function getAccountName(id?: number) {
    return accounts.find(account => account.id === id)?.name ?? 'Невідомий рахунок'
  }

  function getAmountText(transaction: Transaction) {
    if (transaction.type === 'expense') {
      return `-${transaction.amount.toLocaleString('uk-UA')} ₴`
    }

    if (transaction.type === 'income') {
      return `+${transaction.amount.toLocaleString('uk-UA')} ₴`
    }

    return `${transaction.amount.toLocaleString('uk-UA')} ₴`
  }

  function getAmountColor(transaction: Transaction) {
    if (transaction.type === 'expense') return '#DC2626'
    if (transaction.type === 'income') return '#16A34A'
    return '#2563EB'
  }

  function getDescription(transaction: Transaction) {
    if (transaction.type === 'expense') {
      return `Списано з: ${getAccountName(transaction.accountFromId)}`
    }

    if (transaction.type === 'income') {
      return `Зараховано на: ${getAccountName(transaction.accountToId)}`
    }

    return `${getAccountName(transaction.accountFromId)} → ${getAccountName(transaction.accountToId)}`
  }

  if (transactions.length === 0) {
    return (
      <div style={{ marginTop: 24, color: '#6b7280' }}>
        Операцій поки немає
      </div>
    )
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 16 }}>
        Останні операції
      </h2>

      {transactions.map(transaction => (
        <div
          key={transaction.id}
          style={{
            background: 'white',
            borderRadius: 18,
            padding: 18,
            marginBottom: 12,
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: getAmountColor(transaction),
            }}
          >
            {getAmountText(transaction)}
          </div>

          <div style={{ marginTop: 6, color: '#374151' }}>
            {getDescription(transaction)}
          </div>

         <div
  style={{
    marginTop: 8,
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  }}
>
  {transaction.category && (
    <div
      style={{
        background: '#E5E7EB',
        padding: '6px 10px',
        borderRadius: 999,
        fontSize: 14,
        color: '#111827',
      }}
    >
      {transaction.category}
    </div>
  )}

  {transaction.comment && (
    <div
      style={{
        color: '#6b7280',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {transaction.comment}
    </div>
  )}
</div>
        </div>
      ))}
    </div>
  )
}