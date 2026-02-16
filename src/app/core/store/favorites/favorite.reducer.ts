import { createReducer, on } from '@ngrx/store';
import { FavoritesState } from '../../models/favorite.model';
import * as FavoritesActions from './favorite.actions';

export const initialState: FavoritesState = {
    favorites: [],
    error: null,
    isLoading: false
};

export const favoritesReducer = createReducer(
    initialState,


    on(FavoritesActions.addFavorite, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
        ...state,
        favorites: [...state.favorites, favorite],
        isLoading: false
    })),
    on(FavoritesActions.addFavoriteError, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),


    on(FavoritesActions.loadFavorites, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
        ...state,
        favorites,
        isLoading: false
    })),
    on(FavoritesActions.loadFavoritesError, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),


    on(FavoritesActions.removeFavorite, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { favoriteId }) => ({
        ...state,
        favorites: state.favorites.filter(f => f.id !== favoriteId),
        isLoading: false
    })),
    on(FavoritesActions.removeFavoriteError, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    }))
);
