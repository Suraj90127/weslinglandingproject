import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true, // Default open on desktop
  isMobile: false,
  theme: 'light',
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: null
  },
  loading: {
    global: false,
    requests: {}
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
      // Auto close sidebar on mobile
      if (action.payload) {
        state.sidebarOpen = false;
      } else {
        // Auto open sidebar on desktop
        state.sidebarOpen = true;
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        ...action.payload
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null
      };
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setRequestLoading: (state, action) => {
      const { requestId, isLoading } = action.payload;
      state.loading.requests[requestId] = isLoading;
    }
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setIsMobile,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setGlobalLoading,
  setRequestLoading
} = uiSlice.actions;

export default uiSlice.reducer;