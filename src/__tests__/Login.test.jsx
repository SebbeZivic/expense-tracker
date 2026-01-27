import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App.jsx';

describe('App routing', () => {
  it('redirects to login page when not authenticated', async () => {
    render(<App />);

    expect(
      await screen.findByRole('heading', { name: /logga in/i })
    ).toBeInTheDocument();
  });
});
