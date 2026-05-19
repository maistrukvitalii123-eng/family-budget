self.addEventListener('push', event => {
  const data = event.data?.json() ?? {}

  event.waitUntil(
    self.registration.showNotification(data.title || 'Family Budget', {
      body: data.body || 'Настав час записати витрати/доходи!',
      icon: '/family-budget/icons/icon-192.png',
      badge: '/family-budget/icons/icon-192.png',
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/family-budget/')
  )
})