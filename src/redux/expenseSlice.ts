
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseState {
  expenses: Expense[];
  categories: string[];
  budget: number;
}

const initialState: ExpenseState = {
  expenses: [],
  categories: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Education', 'Shopping', 'Health', 'Other'],
  budget: 0,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action: PayloadAction<{ id: string; updates: Partial<Expense> }>) => {
      const { id, updates } = action.payload;
      const expense = state.expenses.find(e => e.id === id);
      if (expense) {
        Object.assign(expense, updates);
      }
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    setBudget: (state, action: PayloadAction<number>) => {
      state.budget = action.payload;
    },
  },
});

export const { 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  addCategory,
  setBudget
} = expenseSlice.actions;

export const expenseReducer = expenseSlice.reducer;
