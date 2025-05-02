
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  progress: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  category: string;
  tasks: ProjectTask[];
  createdAt: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
}

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.push(action.payload);
    },
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const { id, updates } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        Object.assign(project, updates);
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
    },
    addProjectTask: (state, action: PayloadAction<{ projectId: string; task: ProjectTask }>) => {
      const { projectId, task } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.tasks.push(task);
        // Update progress based on completed tasks
        const completedTasks = project.tasks.filter(t => t.completed).length;
        project.progress = project.tasks.length > 0 
          ? Math.round((completedTasks / project.tasks.length) * 100)
          : 0;
      }
    },
    toggleProjectTask: (state, action: PayloadAction<{ projectId: string; taskId: string }>) => {
      const { projectId, taskId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
          // Update progress based on completed tasks
          const completedTasks = project.tasks.filter(t => t.completed).length;
          project.progress = Math.round((completedTasks / project.tasks.length) * 100);
        }
      }
    },
  },
});

export const { 
  addProject, 
  updateProject, 
  deleteProject,
  addProjectTask,
  toggleProjectTask
} = projectSlice.actions;

export const projectReducer = projectSlice.reducer;
