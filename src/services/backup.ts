import { db } from '../db/database'

export async function exportBackup() {
  const accounts = await db.accounts.toArray()
  const transactions = await db.transactions.toArray()

  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    accounts,
    transactions,
  }

  const json = JSON.stringify(backup, null, 2)

  const blob = new Blob([json], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'family-budget-backup.json'
  link.click()

  URL.revokeObjectURL(url)
}

export async function importBackup(file: File) {
  const text = await file.text()
  const backup = JSON.parse(text)

  if (!backup.accounts || !backup.transactions) {
    throw new Error('Некоректний backup файл')
  }

  await db.transaction('rw', db.accounts, db.transactions, async () => {
    await db.accounts.clear()
    await db.transactions.clear()

    await db.accounts.bulkAdd(backup.accounts)
    await db.transactions.bulkAdd(backup.transactions)
  })
}