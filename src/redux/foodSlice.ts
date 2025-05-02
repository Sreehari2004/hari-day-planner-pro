
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Meal {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  calories?: number;
  ingredients?: string[];
  notes?: string;
  completed: boolean;
}

interface FoodState {
  meals: Meal[];
  dailyCalorieGoal: number;
}

const initialState: FoodState = {
  meals: [],
  dailyCalorieGoal: 2000,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    addMeal: (state, action: PayloadAction<Meal>) => {
      state.meals.push(action.payload);
    },
    updateMeal: (state, action: PayloadAction<{ id: string; updates: Partial<Meal> }>) => {
      const { id, updates } = action.payload;
      const meal = state.meals.find(m => m.id === id);
      if (meal) {
        Object.assign(meal, updates);
      }
    },
    deleteMeal: (state, action: PayloadAction<string>) => {
      state.meals = state.meals.filter(m => m.id !== action.payload);
    },
    setDailyCalorieGoal: (state, action: PayloadAction<number>) => {
      state.dailyCalorieGoal = action.payload;
    },
    toggleMealCompleted: (state, action: PayloadAction<string>) => {
      const meal = state.meals.find(m => m.id === action.payload);
      if (meal) {
        meal.completed = !meal.completed;
      }
    },
  },
});

export const { 
  addMeal, 
  updateMeal, 
  deleteMeal,
  setDailyCalorieGoal,
  toggleMealCompleted
} = foodSlice.actions;

export const foodReducer = foodSlice.reducer;
