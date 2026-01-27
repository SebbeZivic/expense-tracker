import { render, screen } from '@testing-library/react';

import App from '../App.jsx';

describe('App component', () => {
  it('renders Expense Tracker title', () => {
    render(<App />);
    expect(screen.getByText(/Expense Tracker/i)).to.exist;
  });
});
