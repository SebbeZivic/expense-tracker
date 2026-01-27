import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../context/AuthContext';

// Mock transactionService
vi.mock('../services/transactionService', () => ({
  transactionService: {
    getTransactions: vi.fn(),
    addTransaction: vi.fn(),
    calculateBalance: vi.fn(),
    getIncomeTransactions: vi.fn(),
    getExpenseTransactions: vi.fn(),
  },
}));

// Mock recurringExpenseService
vi.mock('../services/recurringExpenseService', () => ({
  recurringExpenseService: {
    getRecurringExpenses: vi.fn(() => []),
    addRecurringExpense: vi.fn(),
    deleteRecurringExpense: vi.fn(),
  },
}));

// Mock authService
vi.mock('../services/authService', () => ({
  authService: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

// Importera services efter mock
import { transactionService } from '../services/transactionService';
import { authService } from '../services/authService';

describe('Dashboard - Lägga till rörlig kostnad', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    // Rensa alla mocks och localStorage innan varje test
    vi.clearAllMocks();
    localStorage.clear();

    // Mock authService.getCurrentUser att returnera mockUser
    authService.getCurrentUser.mockReturnValue(mockUser);

    // Mock transactionService.getTransactions att returnera tom array
    transactionService.getTransactions.mockReturnValue([]);
    
    // Mock calculateBalance att returnera 0 initialt
    transactionService.calculateBalance.mockReturnValue(0);
    
    // Mock getIncomeTransactions och getExpenseTransactions
    transactionService.getIncomeTransactions.mockReturnValue([]);
    transactionService.getExpenseTransactions.mockReturnValue([]);
  });

  it('Ska lägga till en rörlig kostnad och uppdatera balans', async () => {
    const user = userEvent.setup();

    // Mock transactionService att returnera den nya transaktionen efter att den lagts till
    const mockTransaction = {
      id: '123',
      description: 'Mat',
      amount: -500,
      date: new Date().toISOString(),
      userId: mockUser.email,
    };

    transactionService.addTransaction.mockReturnValue(mockTransaction);
    
    // Efter att kostnaden lagts till, mocka att getTransactions returnerar den nya transaktionen
    transactionService.getTransactions.mockReturnValue([mockTransaction]);
    transactionService.calculateBalance.mockReturnValue(-500);
    transactionService.getExpenseTransactions.mockReturnValue([mockTransaction]);

    // Render Dashboard med AuthProvider
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );

    // Vänta på att Dashboard laddas
    await waitFor(() => {
      expect(screen.getByText('Budget Tracker')).toBeInTheDocument();
    });

    // Hitta kostnadsformuläret genom att hitta checkboxen för "Fast kostnad" först
    const recurringCheckbox = screen.getByLabelText(/fast kostnad/i);
    
    // Kontrollera att checkboxen för "Fast kostnad" INTE är ikryssad
    expect(recurringCheckbox).not.toBeChecked();
    
    // Hitta formulärfälten i kostnadsformuläret (det som innehåller checkboxen)
    const expenseForm = recurringCheckbox.closest('form');
    const allDescriptionInputs = screen.getAllByPlaceholderText('Beskrivning');
    const allAmountInputs = screen.getAllByPlaceholderText('Belopp (SEK)');
    
    // Välj det andra input-fältet (kostnadsformuläret är det andra formuläret)
    const descriptionInput = allDescriptionInputs[1];
    const amountInput = allAmountInputs[1];
    const submitButton = screen.getByRole('button', { name: /lägg till kostnad/i });

    // Fyll i formuläret
    await user.type(descriptionInput, 'Mat');
    await user.type(amountInput, '500');

    // Klicka på "Lägg till kostnad"
    await user.click(submitButton);

    // Verifiera att transactionService.addTransaction anropades med rätt parametrar
    await waitFor(() => {
      expect(transactionService.addTransaction).toHaveBeenCalledWith(
        mockUser.email,
        'Mat',
        -500
      );
    });

    // Verifiera att transaktionen visas under Rörliga kostnader
    await waitFor(() => {
      expect(screen.getByText('Mat')).toBeInTheDocument();
    });

    // Verifiera att balansen minskat med 500 kr
    // (Balansen ska vara -500, vilket visas som negativt belopp)
    await waitFor(() => {
      const balanceCard = screen.getByText('Din balans').closest('.balance-card');
      const balanceElement = within(balanceCard).getByText('500,00 kr');
      expect(balanceElement).toBeInTheDocument();
      expect(balanceElement).toHaveClass('balance-amount', 'balance-negative');
    });

    // Verifiera att fälten är tomma efter submit
    await waitFor(() => {
      expect(descriptionInput.value).toBe('');
      expect(amountInput.value).toBe('');
    });
  });
});

describe('Dashboard - Lägga till inkomst', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    // Rensa alla mocks och localStorage innan varje test
    vi.clearAllMocks();
    localStorage.clear();

    // Mock authService.getCurrentUser att returnera mockUser
    authService.getCurrentUser.mockReturnValue(mockUser);

    // Mock transactionService.getTransactions att returnera tom array
    transactionService.getTransactions.mockReturnValue([]);
    
    // Mock calculateBalance att returnera 0 initialt
    transactionService.calculateBalance.mockReturnValue(0);
    
    // Mock getIncomeTransactions och getExpenseTransactions
    transactionService.getIncomeTransactions.mockReturnValue([]);
    transactionService.getExpenseTransactions.mockReturnValue([]);
  });

  it('Ska lägga till en inkomst och uppdatera balans', async () => {
    const user = userEvent.setup();

    // Mock transactionService att returnera den nya transaktionen efter att den lagts till
    const mockTransaction = {
      id: '456',
      description: 'Lön',
      amount: 20000,
      date: new Date().toISOString(),
      userId: mockUser.email,
    };

    transactionService.addTransaction.mockReturnValue(mockTransaction);
    
    // Efter att inkomsten lagts till, mocka att getTransactions returnerar den nya transaktionen
    transactionService.getTransactions.mockReturnValue([mockTransaction]);
    transactionService.calculateBalance.mockReturnValue(20000);
    transactionService.getIncomeTransactions.mockReturnValue([mockTransaction]);

    // Render Dashboard med AuthProvider
    render(
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    );

    // Vänta på att Dashboard laddas
    await waitFor(() => {
      expect(screen.getByText('Budget Tracker')).toBeInTheDocument();
    });

    // Hitta intäktsformuläret (det första formuläret)
    const allDescriptionInputs = screen.getAllByPlaceholderText('Beskrivning');
    const allAmountInputs = screen.getAllByPlaceholderText('Belopp (SEK)');
    
    // Välj det första input-fältet (intäktsformuläret är det första formuläret)
    const descriptionInput = allDescriptionInputs[0];
    const amountInput = allAmountInputs[0];
    const submitButton = screen.getByRole('button', { name: /lägg till intäkt/i });

    // Fyll i formuläret
    await user.type(descriptionInput, 'Lön');
    await user.type(amountInput, '20000');

    // Klicka på "Lägg till intäkt"
    await user.click(submitButton);

    // Verifiera att transactionService.addTransaction anropades med rätt parametrar
    await waitFor(() => {
      expect(transactionService.addTransaction).toHaveBeenCalledWith(
        mockUser.email,
        'Lön',
        20000
      );
    });

    // Verifiera att transaktionen visas i listan Intäkter
    await waitFor(() => {
      expect(screen.getByText('Lön')).toBeInTheDocument();
    });

    // Verifiera att balansen ökat med 20 000 kr
    await waitFor(() => {
      const balanceCard = screen.getByText('Din balans').closest('.balance-card');
      // Hitta balanselementet som innehåller 20000 (kan vara formaterat som "20 000,00 kr" eller "20000,00 kr")
      const balanceElement = within(balanceCard).getByText(/20[\s]?000[,.]00\s?kr/i);
      expect(balanceElement).toBeInTheDocument();
      expect(balanceElement).toHaveClass('balance-amount', 'balance-positive');
    });

    // Verifiera att inputfälten återställs
    await waitFor(() => {
      expect(descriptionInput.value).toBe('');
      expect(amountInput.value).toBe('');
    });
  });
});
