const STORAGE_KEY_TRANSACTIONS = "budget_tracker_transactions";

export function getTransactions(userId) {
  const transactionsJson = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
  if (!transactionsJson) return [];
  const allTransactions = JSON.parse(transactionsJson);
  return allTransactions.filter((t) => t.userId === userId);
}

export function addTransaction(userId, description, amount) {
  const transactionsJson = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
  const allTransactions = transactionsJson ? JSON.parse(transactionsJson) : [];

  const newTransaction = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    description,
    amount,
    date: new Date().toISOString(),
    userId,
  };

  allTransactions.push(newTransaction);
  localStorage.setItem(
    STORAGE_KEY_TRANSACTIONS,
    JSON.stringify(allTransactions)
  );

  return newTransaction;
}

export function calculateBalance(transactions) {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getIncomeTransactions(transactions) {
  return transactions.filter((t) => t.amount > 0);
}

export function getExpenseTransactions(transactions) {
  return transactions.filter((t) => t.amount < 0);
}

export const transactionService = {
  getTransactions,
  addTransaction,
  calculateBalance,
  getIncomeTransactions,
  getExpenseTransactions,
};
