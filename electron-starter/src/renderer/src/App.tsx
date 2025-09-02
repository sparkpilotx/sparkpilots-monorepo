import type { JSX } from 'react'
import { useLocationHash } from '@hooks/use-location-hash'
import { SettingsScreen } from '@components/settings-screen'

function App(): JSX.Element {
  const hash = useLocationHash()

  if (hash === '#/settings') {
    return <SettingsScreen />
  }
  return (
    <div className="h-screen bg-neutral-100 p-6 font-sans text-neutral-800 antialiased">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
        Hello from React!
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        This is a minimal Electron starter with React, TypeScript, and Tailwind
        CSS v4.
      </p>
      <div className="mt-6">
        <SettingsScreen />
      </div>
    </div>
  )
}

export default App
