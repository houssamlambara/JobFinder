import { createAction, props } from '@ngrx/store';
import { Favorite } from '../../models/favorite.model';


export const addFavorite = createAction(
    '[Favorites] Add Favorite',
    props<{ favorite: Omit<Favorite, 'id'> }>()
);

export const addFavoriteSuccess = createAction(
    '[Favorites] Add Favorite Success',
    props<{ favorite: Favorite }>()
);

export const addFavoriteError = createAction(
    '[Favorites] Add Favorite Error',
    props<{ error: any }>()
);


export const loadFavorites = createAction(
    '[Favorites] Load Favorites',
    props<{ userId: string | number }>()
);

export const loadFavoritesSuccess = createAction(
    '[Favorites] Load Favorites Success',
    props<{ favorites: Favorite[] }>()
);

export const loadFavoritesError = createAction(
    '[Favorites] Load Favorites Error',
    props<{ error: any }>()
);


export const removeFavorite = createAction(
    '[Favorites] Remove Favorite',
    props<{ favoriteId: string | number }>()
);

export const removeFavoriteSuccess = createAction(
    '[Favorites] Remove Favorite Success',
    props<{ favoriteId: string | number }>()
);

export const removeFavoriteError = createAction(
    '[Favorites] Remove Favorite Error',
    props<{ error: any }>()
);
