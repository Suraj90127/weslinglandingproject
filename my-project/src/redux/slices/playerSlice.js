// src/features/player/playerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";
import { getFullImageUrl } from "../../utils/imageUtils";

/* =========================
   GET ALL PLAYERS
========================= */
export const fetchPlayers = createAsyncThunk(
  "player/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/players", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   GET SINGLE PLAYER
========================= */
export const fetchPlayerById = createAsyncThunk(
  "player/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/players/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   CREATE PLAYER (IMAGE + JSON)
========================= */
export const createPlayer = createAsyncThunk(
  "player/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/players", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   UPDATE PLAYER
========================= */
export const updatePlayer = createAsyncThunk(
  "player/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/players/${id}`, payload);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   DELETE PLAYER
========================= */
export const deletePlayer = createAsyncThunk(
  "player/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/players/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* =========================
   SLICE
========================= */

const playerSlice = createSlice({
  name: "player",

  initialState: {
    players: [],
    totalPlayers: 0,
    currentPage: 1,
    totalPages: 1,
    selectedPlayer: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearPlayerError: (state) => {
      state.error = null;
    },
    clearSelectedPlayer: (state) => {
      state.selectedPlayer = null;
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
      .addCase(fetchPlayers.pending, pending)
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.players = action.payload.data.map(player => ({
            ...player,
            image: getFullImageUrl(player.image)
          }));
          state.totalPlayers = action.payload.total;
        } else {
          const playersArray = Array.isArray(action.payload) ? action.payload : [];
          state.players = playersArray.map(player => ({
            ...player,
            image: getFullImageUrl(player.image)
          }));
          state.totalPlayers = state.players.length;
        }
      })
      .addCase(fetchPlayers.rejected, rejected)

      /* FETCH ONE */
      .addCase(fetchPlayerById.pending, pending)
      .addCase(fetchPlayerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlayer = action.payload ? {
          ...action.payload,
          image: getFullImageUrl(action.payload.image)
        } : null;
      })
      .addCase(fetchPlayerById.rejected, rejected)

      /* CREATE */
      .addCase(createPlayer.fulfilled, (state, action) => {
        state.players.unshift(action.payload);
      })

      /* UPDATE */
      .addCase(updatePlayer.fulfilled, (state, action) => {
        const index = state.players.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.players[index] = action.payload;
      })

      /* DELETE */
      .addCase(deletePlayer.fulfilled, (state, action) => {
        state.players = state.players.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});

export const {
  clearPlayerError,
  clearSelectedPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;