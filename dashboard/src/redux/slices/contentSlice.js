// src/features/content/contentSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

/* =========================
   GET ALL CONTENT
========================= */
export const fetchAllContent = createAsyncThunk(
  "content/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/content", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetch content failed"
      );
    }
  }
);

/* =========================
   GET CONTENT BY TYPE (kept for direct API use if needed)
========================= */
export const fetchContentByType = createAsyncThunk(
  "content/fetchType",
  async (type, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/content/type/${type}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetch by type failed"
      );
    }
  }
);

/* =========================
   CREATE CONTENT
========================= */
export const createContent = createAsyncThunk(
  "content/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/content", payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Create failed"
      );
    }
  }
);

/* =========================
   UPDATE CONTENT
========================= */
export const updateContent = createAsyncThunk(
  "content/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/content/${id}`, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

/* =========================
   DELETE CONTENT
========================= */
export const deleteContent = createAsyncThunk(
  "content/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/content/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

/* =========================
   SLICE
========================= */

const contentSlice = createSlice({
  name: "content",

  initialState: {
    contents: [],
    currentContent: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearContentError: (state) => {
      state.error = null;
    },
    setCurrentContent: (state, action) => {
      state.currentContent = action.payload;
    },
    clearSelectedContent: (state) => {
      state.currentContent = null;
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
      .addCase(fetchAllContent.pending, pending)
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.payload;
      })
      .addCase(fetchAllContent.rejected, rejected)

      /* FETCH TYPE */
      .addCase(fetchContentByType.pending, pending)
      .addCase(fetchContentByType.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContent = action.payload;
      })
      .addCase(fetchContentByType.rejected, rejected)

      /* CREATE */
      .addCase(createContent.fulfilled, (state, action) => {
        state.contents.unshift(action.payload);
      })

      /* UPDATE */
      .addCase(updateContent.fulfilled, (state, action) => {
        const index = state.contents.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.contents[index] = action.payload;
      })

      /* DELETE */
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.contents = state.contents.filter(
          (c) => c._id !== action.payload
        );
      });
  },
});

export const {
  clearContentError,
  setCurrentContent,
  clearSelectedContent,
} = contentSlice.actions;

export default contentSlice.reducer;