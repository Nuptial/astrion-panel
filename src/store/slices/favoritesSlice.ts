import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

interface FavoritesState {
  favoriteProductIds: string[];
}

const initialState: FavoritesState = {
  favoriteProductIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const alreadyFavorite = state.favoriteProductIds.includes(productId);

      if (alreadyFavorite) {
        state.favoriteProductIds = state.favoriteProductIds.filter((id) => id !== productId);
        return;
      }

      state.favoriteProductIds.push(productId);
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export const selectFavoriteProductIds = (state: RootState) => state.favorites.favoriteProductIds;
export const selectIsProductFavorite = (state: RootState, productId: string) =>
  state.favorites.favoriteProductIds.includes(productId);

export default favoritesSlice.reducer;

