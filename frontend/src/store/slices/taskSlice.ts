import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { taskAPI } from '../../services/api';
import type { Task } from '../../services/api';

interface Comment {
  id: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  content: string;
  timestamp: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

export const fetchTasksStart = createAsyncThunk(
  'tasks/fetchStart',
  async () => {
    const response = await taskAPI.getTasks();
    return response.data.data;
  }
);

export const fetchTasksSuccess = createAsyncThunk(
  'tasks/fetchSuccess',
  async (tasks: Task[]) => {
    return tasks;
  }
);

export const fetchTasksFailure = createAsyncThunk(
  'tasks/fetchFailure',
  async (error: string) => {
    return error;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
    addComment: (state, action: PayloadAction<{ taskId: string; comment: Comment }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        if (!task.comments) {
          task.comments = [];
        }
        task.comments.push(action.payload.comment);
      }
    },
    updateProgress: (state, action: PayloadAction<{ taskId: string; progress: number }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.progress = action.payload.progress;
        if (task.progress === 100) {
          task.status = 'completed';
        } else if (task.progress > 0) {
          task.status = 'in-progress';
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksStart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksStart.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksStart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(fetchTasksSuccess.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchTasksFailure.fulfilled, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
  setCurrentTask,
  addComment,
  updateProgress,
} = taskSlice.actions;

export default taskSlice.reducer; 