import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { transactionService } from "../services/transactionService";
import { recurringExpenseService } from "../services/recurringExpenseService";

function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isRecurringExpense, setIsRecurringExpense] = useState(false);
  const [recurringExpenses, setRecurringExpenses] = useState([]);

  useEffect(() => {
    if (user) {
      loadTransactions();
      loadRecurringExpenses();
    }
  }, [user]);

  const loadTransactions = () => {
    if (!user) return;

    const userTransactions = transactionService.getTransactions(user.email);
    setTransactions(userTransactions);
    
    // Beräkna balans från transaktioner
    const transactionBalance = transactionService.calculateBalance(userTransactions);
    
    // Lägg till fasta kostnader i balansen
    const recurringExpenses = recurringExpenseService.getRecurringExpenses(user.email);
    const recurringTotal = recurringExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    setBalance(transactionBalance - recurringTotal);
  };

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!user || !incomeDescription || !incomeAmount) return;

    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Ange ett giltigt belopp");
      return;
    }

    transactionService.addTransaction(user.email, incomeDescription, amount);
    setIncomeDescription("");
    setIncomeAmount("");
    loadTransactions();
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!user || !expenseDescription || !expenseAmount) return;
  
    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Ange ett giltigt belopp");
      return;
    }
  
    // Om det är en fast kostnad, spara den ENDAST som fast kostnad
    if (isRecurringExpense) {
      recurringExpenseService.addRecurringExpense(
        user.email,
        expenseDescription,
        amount
      );
      loadRecurringExpenses();
      loadTransactions(); // Uppdatera balansen
    } else {
      // Om det är en rörlig kostnad, lägg till som vanlig transaktion
      transactionService.addTransaction(user.email, expenseDescription, -amount);
      loadTransactions();
    }
  
    setExpenseDescription("");
    setExpenseAmount("");
    setIsRecurringExpense(false);
  };

  const handleDeleteTransaction = (transactionId) => {
    if (!user) return;
    transactionService.deleteTransaction(user.email, transactionId);
    loadTransactions();
  };

  const loadRecurringExpenses = () => {
    if (!user) return;
    const expenses = recurringExpenseService.getRecurringExpenses(user.email);
    setRecurringExpenses(expenses);
  };
  
  const handleDeleteRecurringExpense = (expenseId) => {
    if (!user) return;
    recurringExpenseService.deleteRecurringExpense(user.email, expenseId);
    loadRecurringExpenses();
    loadTransactions(); // Uppdatera balansen när fast kostnad tas bort
  };

  const incomeTransactions =
    transactionService.getIncomeTransactions(transactions);
  const expenseTransactions =
    transactionService.getExpenseTransactions(transactions);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
    }).format(Math.abs(amount));
  };

  const currentMonthLabel = new Date().toLocaleDateString("sv-SE", {
    month: "long",
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Budget Tracker</h1>
          <div className="user-info">
            <span>
              Inloggad som: <strong>{user?.name}</strong> ({user?.email})
            </span>
            <button onClick={logout} className="logout-btn">
              Logga ut
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="balance-card">
          <div className="balance-month">
            {currentMonthLabel.charAt(0).toUpperCase() +
              currentMonthLabel.slice(1)}{" "}
            månad
          </div>
          <div className="balance-label">Din balans</div>
          <div
            className={`balance-amount ${
              balance >= 0 ? "balance-positive" : "balance-negative"
            }`}
          >
            {formatAmount(balance)}
          </div>
        </div>

        <div className="transactions-section">
          <div className="transaction-card">
            <h2>Intäkter</h2>
            <ul className="transaction-list">
              {incomeTransactions.length === 0 ? (
                <li className="empty-state">Inga intäkter ännu</li>
              ) : (
                incomeTransactions.map((transaction) => (
                  <li key={transaction.id} className="transaction-item">
                    <span className="transaction-description">
                      {transaction.description}
                    </span>
                    <div className="transaction-actions">
                      <span className="transaction-amount income">
                        +{formatAmount(transaction.amount)}
                      </span>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        aria-label={`Ta bort ${transaction.description}`}
                        title="Ta bort"
                      >
                        Ta bort
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <form onSubmit={handleAddIncome} className="add-transaction-form">
              <input
                type="text"
                placeholder="Beskrivning"
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Belopp (SEK)"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
              />
              <button type="submit" className="btn">
                Lägg till intäkt
              </button>
            </form>
          </div>

          <div className="transaction-card">
            <h2>Kostnader</h2>
            
            {/* Visa fasta kostnader först */}
            {recurringExpenses.length > 0 && (
              <div className="recurring-expenses-section">
                <h3 className="recurring-expenses-title">Fasta kostnader (samma varje månad)</h3>
                <ul className="transaction-list">
                  {recurringExpenses.map((expense) => (
                    <li key={expense.id} className="transaction-item recurring-item">
                      <span className="transaction-description">
                        {expense.description}
                        <span className="recurring-badge">Fast kostnad</span>
                      </span>
                      <div className="transaction-actions">
                        <span className="transaction-amount expense">
                          -{formatAmount(expense.amount)}
                        </span>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteRecurringExpense(expense.id)}
                          aria-label={`Ta bort ${expense.description}`}
                          title="Ta bort"
                        >
                          Ta bort
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Visa rörliga kostnader */}
            <div className="variable-expenses-section">
              {recurringExpenses.length > 0 && (
                <h3 className="variable-expenses-title">Rörliga kostnader</h3>
              )}
              <ul className="transaction-list">
                {expenseTransactions.length === 0 ? (
                  <li className="empty-state">Inga kostnader ännu</li>
                ) : (
                  expenseTransactions.map((transaction) => (
                    <li key={transaction.id} className="transaction-item">
                      <span className="transaction-description">
                        {transaction.description}
                      </span>
                      <div className="transaction-actions">
                        <span className="transaction-amount expense">
                          -{formatAmount(transaction.amount)}
                        </span>
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          aria-label={`Ta bort ${transaction.description}`}
                          title="Ta bort"
                        >
                          Ta bort
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <form onSubmit={handleAddExpense} className="add-transaction-form">
              <input
                type="text"
                placeholder="Beskrivning"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                required
              />
                           <input
                type="number"
                placeholder="Belopp (SEK)"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isRecurringExpense}
                  onChange={(e) => setIsRecurringExpense(e.target.checked)}
                />
                <span>Fast kostnad (samma varje månad)</span>
              </label>
              <button type="submit" className="btn">
                Lägg till kostnad
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
