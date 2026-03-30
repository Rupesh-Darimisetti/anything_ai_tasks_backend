import { render, screen } from '@testing-library/react';
import App from './App';

test('renders auth entry page', () => {
  render(<App />);
  const loginHeading = screen.getByText(/login/i);
  expect(loginHeading).toBeInTheDocument();
});
