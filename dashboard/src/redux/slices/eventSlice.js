// src/features/event/eventSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

/* =========================
   GET ALL EVENTS
========================= */
export const fetchEvents = createAsyncThunk(
  "event/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/events", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

/* =========================
   GET SINGLE EVENT
========================= */
export const fetchEventById = createAsyncThunk(
  "event/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/events/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   CREATE EVENT (IMAGE UPLOAD)
========================= */
export const createEvent = createAsyncThunk(
  "event/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   UPDATE EVENT (WITH IMAGE UPLOAD SUPPORT)
========================= */
export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, data: payload }, { rejectWithValue }) => {
    try {
      // Check if payload is FormData (for image upload)
      const isFormData = payload instanceof FormData;

      const { data } = await api.put(`/events/${id}`, payload, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   DELETE EVENT
========================= */
export const deleteEvent = createAsyncThunk(
  "event/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   SLICE
========================= */

const eventSlice = createSlice({
  name: "event",

  initialState: {
    events: [],
    upcomingEvents: [],
    selectedEvent: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },

  extraReducers: (builder) => {

    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder

      /* FETCH ALL */
      .addCase(fetchEvents.pending, pending)
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;

        // Filter upcoming events (today or future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        state.upcomingEvents = action.payload.filter(
          (event) => new Date(event.date) >= today
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
      })
      .addCase(fetchEvents.rejected, rejected)

      /* FETCH ONE */
      .addCase(fetchEventById.pending, pending)
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, rejected)

      /* CREATE */
      .addCase(createEvent.pending, pending)
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.unshift(action.payload);

        // Update upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(action.payload.date) >= today) {
          state.upcomingEvents = [...state.upcomingEvents, action.payload]
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        }
      })
      .addCase(createEvent.rejected, rejected)

      /* UPDATE */
      .addCase(updateEvent.pending, pending)
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.selectedEvent?._id === action.payload._id) {
          state.selectedEvent = action.payload;
        }

        // Refresh upcoming events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        state.upcomingEvents = state.events
          .filter((event) => new Date(event.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      })
      .addCase(updateEvent.rejected, rejected)

      /* DELETE */
      .addCase(deleteEvent.pending, pending)
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(
          (e) => e._id !== action.payload
        );
        state.upcomingEvents = state.upcomingEvents.filter(
          (e) => e._id !== action.payload
        );
        if (state.selectedEvent?._id === action.payload) {
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, rejected);
  },
});

export const {
  clearEventError,
  clearSelectedEvent,
} = eventSlice.actions;

export default eventSlice.reducer;