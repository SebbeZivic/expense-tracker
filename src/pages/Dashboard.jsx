import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { transactionService } from "../services/transactionService";

function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = () => {
    if (!user) return;

    const userTransactions = transactionService.getTransactions(user.email);
    setTransactions(userTransactions);
    setBalance(transactionService.calculateBalance(userTransactions));
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

    transactionService.addTransaction(user.email, expenseDescription, -amount);
    setExpenseDescription("");
    setExpenseAmount("");
    loadTransactions();
  };

  const handleDeleteTransaction = (transactionId) => {
    if (!user) return;
    transactionService.deleteTransaction(user.email, transactionId);
    loadTransactions();
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
