import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from '../../models/favorite.model';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
    selectFavoritesState,
    (state: FavoritesState) => state.favorites
);

export const selectFavoritesError = createSelector(
    selectFavoritesState,
    (state: FavoritesState) => state.error
);

export const selectFavoritesLoading = createSelector(
    selectFavoritesState,
    (state: FavoritesState) => state.isLoading
);

export const isFavorite = (jobId: string | number) => createSelector(
    selectAllFavorites,
    (favorites) => favorites.some(f => f.offerId == jobId) // Using == for loose comparison (string vs number)
);

export const getFavoriteId = (jobId: string | number) => createSelector(
    selectAllFavorites,
    (favorites) => favorites.find(f => f.offerId == jobId)?.id
);
