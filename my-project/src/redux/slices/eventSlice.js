// src/features/event/eventSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";
import { getFullImageUrl } from "../../utils/imageUtils";

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
   UPDATE EVENT
========================= */
export const updateEvent = createAsyncThunk(
  "event/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/events/${id}`, payload);
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
        // Process images in events and matches
        state.events = action.payload.map(event => ({
          ...event,
          image: getFullImageUrl(event.image),
          matches: event.matches?.map(match => ({
            ...match,
            players: match.players?.map(player => ({
              ...player,
              image: getFullImageUrl(player.image)
            }))
          }))
        }));
      })
      .addCase(fetchEvents.rejected, rejected)

      /* FETCH ONE */
      .addCase(fetchEventById.pending, pending)
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        const event = action.payload;
        state.selectedEvent = event ? {
          ...event,
          image: getFullImageUrl(event.image),
          matches: event.matches?.map(match => ({
            ...match,
            players: match.players?.map(player => ({
              ...player,
              image: getFullImageUrl(player.image)
            }))
          }))
        } : null;
      })
      .addCase(fetchEventById.rejected, rejected)

      /* CREATE */
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })

      /* UPDATE */
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) state.events[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(
          (e) => e._id !== action.payload
        );
      });
  },
});

export const {
  clearEventError,
  clearSelectedEvent,
} = eventSlice.actions;

export default eventSlice.reducer;