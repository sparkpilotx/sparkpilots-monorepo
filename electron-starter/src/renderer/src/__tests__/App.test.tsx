import { render, screen } from '@testing-library/react'
import App from '../App'

it('renders hello text', () => {
  render(<App />)
  expect(screen.getByText(/Hello from React!/i)).toBeInTheDocument()
})
