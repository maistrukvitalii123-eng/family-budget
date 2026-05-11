import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { Transaction } from '../db/database'

type Props = {
  transactions: Transaction[]
}

const COLORS = [
  '#111827',
  '#2563EB',
  '#16A34A',
  '#F59E0B',
  '#DC2626',
  '#7C3AED',
  '#0891B2',
  '#DB2777',
]

export function CategoryChart({ transactions }: Props) {
  const expenses = transactions.filter(
    transaction => transaction.type === 'expense'
  )

  const data = expenses.reduce<{ name: string; value: number }[]>(
    (result, transaction) => {
      const category = transaction.category || 'Без категорії'

      const existing = result.find(item => item.name === category)

      if (existing) {
        existing.value += transaction.amount
      } else {
        result.push({
          name: category,
          value: transaction.amount,
        })
      }

      return result
    },
    []
  )

  if (data.length === 0) {
    return null
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 24,
        padding: 20,
        marginTop: 32,
        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
      }}
    >
      <h2 style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 16 }}>
        Витрати по категоріях
      </h2>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {data.map((item, index) => (
        <div
          key={item.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 10,
            fontSize: 16,
          }}
        >
          <div>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 999,
                background: COLORS[index % COLORS.length],
                marginRight: 8,
              }}
            />
            {item.name}
          </div>

          <strong>{item.value.toLocaleString('uk-UA')} ₴</strong>
        </div>
      ))}
    </div>
  )
}