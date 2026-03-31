import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, host } from "../api";
import { getFullImageUrl } from "../../utils/imageUtils";

/* =========================
   GET ALL BANNERS (PAGES)
========================= */
export const fetchBanners = createAsyncThunk(
  "banner/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/banners", { params });
      console.log("Raw API response:", data);

      if (data.success && data.data) {

        // Process each page/banner to ensure consistent structure
        const processedBanners = data.data.map(page => {
          // Handle both page structure and banner structure
          const bannerData = {
            _id: page._id || page.id,
            name: page.name || '',
            title: page.title || '',
            description: page.description || '',
            link: page.link || '',
            position: page.position || 0,
            isActive: page.isActive !== undefined ? page.isActive : true,
            pageType: page.pageType || 'custom',
            createdAt: page.createdAt || new Date().toISOString(),
            // Handle images - pages might have single image or images array
            images: (page.images || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img)),
            allImages: (page.allImages || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img))
          };


          return bannerData;
        });

        console.log("Processed banners:", processedBanners);

        return {
          banners: processedBanners,
          total: data.total || data.count || processedBanners.length
        };
      }

      return rejectWithValue("Invalid response format");
    } catch (err) {
      console.error("Fetch banners error:", err);
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

/* =========================
   GET BANNER BY PAGE NAME
========================= */
export const fetchBannerByPage = createAsyncThunk(
  "banner/fetchPage",
  async (name, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/banners/page/${name}`);
      console.log(`Page banners raw data:`, data);

      if (data.success && data.data) {
        // Process pages/banners same as above
        const processedBanners = data.data.map(page => {
          const bannerData = {
            _id: page._id || page.id,
            name: page.name || '',
            title: page.title || '',
            description: page.description || '',
            link: page.link || '',
            position: page.position || 0,
            isActive: page.isActive !== undefined ? page.isActive : true,
            pageType: page.pageType || 'custom',
            createdAt: page.createdAt || new Date().toISOString(),
            images: (page.images || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img)),
            allImages: (page.allImages || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img))
          };

          return bannerData;
        });

        return processedBanners;
      }

      return rejectWithValue("Invalid response format");
    } catch (err) {
      console.error("Fetch page banners error:", err);
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

/* =========================
   CREATE PAGE/BANNER
========================= */
export const createBanner = createAsyncThunk(
  "banner/create",
  async (formData, { rejectWithValue }) => {
    try {
      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const { data } = await api.post("/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Create banner response:", data);

      if (data.success && data.data) {
        // Process the created page/banner
        const page = data.data;
        const bannerData = {
          _id: page._id || page.id,
          name: page.name || '',
          title: page.title || '',
          description: page.description || '',
          link: page.link || '',
          position: page.position || 0,
          isActive: page.isActive !== undefined ? page.isActive : true,
          pageType: page.pageType || 'custom',
          createdAt: page.createdAt || new Date().toISOString(),
          images: (page.images || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img)),
          allImages: (page.allImages || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img))
        };

        return bannerData;
      } else {
        return rejectWithValue(data.message || "Creation failed");
      }
    } catch (err) {
      console.error("Create banner error:", err);
      return rejectWithValue(err.response?.data?.message || "Creation failed");
    }
  }
);

/* =========================
   UPDATE PAGE/BANNER
========================= */
export const updateBanner = createAsyncThunk(
  "banner/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const { data } = await api.put(`/banners/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update banner response:", data);

      if (data.success && data.data) {
        // Process the updated page/banner
        const page = data.data;
        const bannerData = {
          _id: page._id || page.id,
          name: page.name || '',
          title: page.title || '',
          description: page.description || '',
          link: page.link || '',
          position: page.position || 0,
          isActive: page.isActive !== undefined ? page.isActive : true,
          pageType: page.pageType || 'custom',
          createdAt: page.createdAt || new Date().toISOString(),
          images: (page.images || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img)),
          allImages: (page.allImages || (page.image ? [page.image] : [])).map(img => getFullImageUrl(img))
        };

        return bannerData;
      } else {
        return rejectWithValue(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update banner error:", err);
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

/* =========================
   DELETE PAGE/BANNER
========================= */
export const deleteBanner = createAsyncThunk(
  "banner/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/banners/${id}`);
      console.log("Delete banner response:", data);

      if (data.success) {
        return id;
      } else {
        return rejectWithValue(data.message || "Deletion failed");
      }
    } catch (err) {
      console.error("Delete banner error:", err);
      return rejectWithValue(err.response?.data?.message || "Deletion failed");
    }
  }
);

/* =========================
   SLICE
========================= */

const bannerSlice = createSlice({
  name: "banner",

  initialState: {
    banners: [],
    pageBanners: [],
    totalBanners: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    currentBanner: null,
  },

  reducers: {
    clearBannerError: (state) => {
      state.error = null;
    },
    setCurrentBanner: (state, action) => {
      state.currentBanner = action.payload;
    },
    clearCurrentBanner: (state) => {
      state.currentBanner = null;
    },
  },

  extraReducers: (builder) => {
    // Helper functions
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      /* FETCH ALL BANNERS */
      .addCase(fetchBanners.pending, pending)
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.banners) {
          state.banners = action.payload.banners;
          state.totalBanners = action.payload.total;
        } else {
          state.banners = action.payload || [];
          state.totalBanners = state.banners.length;
        }
        console.log("Banners updated in state:", state.banners);
      })
      .addCase(fetchBanners.rejected, rejected)

      /* FETCH BANNER BY PAGE */
      .addCase(fetchBannerByPage.pending, pending)
      .addCase(fetchBannerByPage.fulfilled, (state, action) => {
        state.loading = false;
        state.pageBanners = action.payload || [];
        console.log("Page banners updated in state:", state.pageBanners);
      })
      .addCase(fetchBannerByPage.rejected, rejected)

      /* CREATE BANNER */
      .addCase(createBanner.pending, pending)
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.banners = [action.payload, ...state.banners];
          console.log("New banner added:", action.payload);
        }
      })
      .addCase(createBanner.rejected, rejected)

      /* UPDATE BANNER */
      .addCase(updateBanner.pending, pending)
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.banners.findIndex(
            (b) => b._id === action.payload._id
          );
          if (index !== -1) {
            state.banners[index] = action.payload;
          }

          // Also update in pageBanners if present
          const pageIndex = state.pageBanners.findIndex(
            (b) => b._id === action.payload._id
          );
          if (pageIndex !== -1) {
            state.pageBanners[pageIndex] = action.payload;
          }

          console.log("Banner updated:", action.payload);
        }
      })
      .addCase(updateBanner.rejected, rejected)

      /* DELETE BANNER */
      .addCase(deleteBanner.pending, pending)
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(
          (b) => b._id !== action.payload
        );
        state.pageBanners = state.pageBanners.filter(
          (b) => b._id !== action.payload
        );
        console.log("Banner deleted:", action.payload);
      })
      .addCase(deleteBanner.rejected, rejected);
  },
});

export const { clearBannerError, setCurrentBanner, clearCurrentBanner } = bannerSlice.actions;

// Selectors
export const selectAllBanners = (state) => state.banners.banners;
export const selectPageBanners = (state) => state.banners.pageBanners;
export const selectBannerLoading = (state) => state.banners.loading;
export const selectBannerError = (state) => state.banners.error;
export const selectCurrentBanner = (state) => state.banners.currentBanner;

export default bannerSlice.reducer;


