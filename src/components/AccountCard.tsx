type Props = {
  name: string
  balance: number
  color: string
}

export function AccountCard({
  name,
  balance,
  color,
}: Props) {
  return (
    <div
      style={{
        background: color,
        borderRadius: '24px',
        padding: '24px',
        color: 'white',
        marginBottom: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          opacity: 0.8,
        }}
      >
        Рахунок
      </div>

      <div
        style={{
          marginTop: '10px',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        {name}
      </div>

      <div
        style={{
          marginTop: '24px',
          fontSize: '36px',
          fontWeight: 'bold',
        }}
      >
        {balance.toLocaleString('uk-UA')} ₴
      </div>
    </div>
  )
}