import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Resource {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourceState {
  resources: Resource[];
  loading: boolean;
  error: string | null;
}

const initialState: ResourceState = {
  resources: [],
  loading: false,
  error: null,
};

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResources: (state, action: PayloadAction<Resource[]>) => {
      state.resources = action.payload;
    },
    addResource: (state, action: PayloadAction<Resource>) => {
      state.resources.push(action.payload);
    },
    updateResource: (state, action: PayloadAction<Resource>) => {
      const index = state.resources.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.resources[index] = action.payload;
      }
    },
    deleteResource: (state, action: PayloadAction<string>) => {
      state.resources = state.resources.filter(r => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setResources,
  addResource,
  updateResource,
  deleteResource,
  setLoading,
  setError,
} = resourceSlice.actions;

export default resourceSlice.reducer; 