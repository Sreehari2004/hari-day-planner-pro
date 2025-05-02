
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { studyReducer } from './studySlice';
import { projectReducer } from './projectSlice';
import { expenseReducer } from './expenseSlice';
import { foodReducer } from './foodSlice';
import { taskReducer } from './taskSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('plannerState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('plannerState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

const rootReducer = combineReducers({
  study: studyReducer,
  projects: projectReducer,
  expenses: expenseReducer,
  food: foodReducer,
  tasks: taskReducer,
});

const preloadedState = loadState();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

// Subscribe to store changes to save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
