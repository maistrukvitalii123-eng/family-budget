import Dexie from 'dexie'
import type { Table } from 'dexie'

export type Account = {
  id?: number
  name: string
  balance: number
  color: string
}

export type Transaction = {
  id?: number
  type: 'expense' | 'income' | 'transfer'
  amount: number
  accountFromId?: number
  accountToId?: number
  category?: string
  comment?: string
  createdAt: Date
}

class FamilyBudgetDB extends Dexie {
  accounts!: Table<Account>
  transactions!: Table<Transaction>

  constructor() {
  super('FamilyBudgetDB')

  this.version(2).stores({
    accounts: '++id,name',
    transactions: '++id,type,category,createdAt',
  })
}
}

export const db = new FamilyBudgetDB()