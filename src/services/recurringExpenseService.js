const STORAGE_KEY_RECURRING = "budget_tracker_recurring_expenses";

export function getRecurringExpenses(userId) {
  const expensesJson = localStorage.getItem(STORAGE_KEY_RECURRING);
  if (!expensesJson) return [];
  const allExpenses = JSON.parse(expensesJson);
  return allExpenses.filter((e) => e.userId === userId);
}

export function addRecurringExpense(userId, description, amount) {
  const expensesJson = localStorage.getItem(STORAGE_KEY_RECURRING);
  const allExpenses = expensesJson ? JSON.parse(expensesJson) : [];

  const newExpense = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    description,
    amount,
    userId,
  };

  allExpenses.push(newExpense);
  localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(allExpenses));
  return newExpense;
}

export function deleteRecurringExpense(userId, expenseId) {
  const expensesJson = localStorage.getItem(STORAGE_KEY_RECURRING);
  if (!expensesJson) return false;

  const allExpenses = JSON.parse(expensesJson);
  const filtered = allExpenses.filter(
    (e) => !(e.userId === userId && e.id === expenseId)
  );

  localStorage.setItem(STORAGE_KEY_RECURRING, JSON.stringify(filtered));
  return true;
}

export const recurringExpenseService = {
  getRecurringExpenses,
  addRecurringExpense,
  deleteRecurringExpense,
};