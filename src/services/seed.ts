import { db } from '../db/database'

export async function seedDatabase() {
  await db.accounts.clear()

  await db.accounts.bulkAdd([
    { name: 'ГОТІВКА', balance: 1200, color: '#059669' },
    { name: 'МОНОБАНК Віталій', balance: 15230, color: '#111827' },
    { name: 'МОНОБАНК Олена', balance: 8560, color: '#7C3AED' },
    { name: 'ПРИВАТБАНК Віталій', balance: 5420, color: '#16A34A' },
    { name: 'ПРИВАТБАНК Олена', balance: 0, color: '#22C55E' },
    { name: 'ПУМБ Олена', balance: 0, color: '#DC2626' },
    { name: 'АБАНК Віталій', balance: 0, color: '#2563EB' },
  ])
}