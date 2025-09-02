import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { act } from 'react'

beforeEach(() => {
  document.body.innerHTML = '<div id="root"></div>'
})

afterEach(() => {
  vi.resetModules()
  document.body.innerHTML = ''
})

it('renders App into #root via main.tsx', async () => {
  await act(async () => {
    await import('../main')
  })
  expect(await screen.findByText(/Hello from React!/i)).toBeInTheDocument()
})
