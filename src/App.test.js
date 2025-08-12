import { render, screen } from '@testing-library/react';
import App from './App';

test('shows auth screen by default', async () => {
  render(<App />);
  const heading = await screen.findByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});
