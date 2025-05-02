
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StudySession {
  id: string;
  title: string;
  subject: string;
  duration: number; // in minutes
  completed: boolean;
  date: string;
  notes?: string;
}

interface StudyState {
  sessions: StudySession[];
  totalMinutesStudied: number;
}

const initialState: StudyState = {
  sessions: [],
  totalMinutesStudied: 0,
};

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    addStudySession: (state, action: PayloadAction<StudySession>) => {
      state.sessions.push(action.payload);
      if (action.payload.completed) {
        state.totalMinutesStudied += action.payload.duration;
      }
    },
    updateStudySession: (state, action: PayloadAction<{ id: string; updates: Partial<StudySession> }>) => {
      const { id, updates } = action.payload;
      const session = state.sessions.find(s => s.id === id);
      if (session) {
        // If completing a session
        if (updates.completed && !session.completed) {
          state.totalMinutesStudied += session.duration;
        }
        // If un-completing a session
        else if (session.completed && updates.completed === false) {
          state.totalMinutesStudied -= session.duration;
        }
        
        Object.assign(session, updates);
      }
    },
    deleteStudySession: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const sessionIndex = state.sessions.findIndex(s => s.id === id);
      if (sessionIndex !== -1) {
        const session = state.sessions[sessionIndex];
        if (session.completed) {
          state.totalMinutesStudied -= session.duration;
        }
        state.sessions.splice(sessionIndex, 1);
      }
    },
  },
});

export const { addStudySession, updateStudySession, deleteStudySession } = studySlice.actions;
export const studyReducer = studySlice.reducer;
