import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface Task {
  _id: string;
  id: string;
  title: string;
  type: 'bug' | 'feature' | 'task';
  status: 'completed' | 'in-progress' | 'pending';
  startDate: string;
  endDate: string;
  progress?: number;
  description?: string;
  comments?: Comment[];
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

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action: PayloadAction<Task[]>) => {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
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
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
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