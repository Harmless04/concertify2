import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Concertify heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Concertify/i);  // Match the "Concertify" heading in your App.js
  expect(headingElement).toBeInTheDocument();
});

