import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoriteService } from '../../services/favorite.service';
import * as FavoritesActions from './favorite.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { toast } from 'ngx-sonner';

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private favoriteService = inject(FavoriteService);

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            mergeMap(action =>
                this.favoriteService.getFavorites(action.userId).pipe(
                    map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError(error => of(FavoritesActions.loadFavoritesError({ error })))
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            mergeMap(action =>
                this.favoriteService.addFavorite(action.favorite).pipe(
                    map(favorite => {
                        toast.success('Ajouté aux favoris !');
                        return FavoritesActions.addFavoriteSuccess({ favorite });
                    }),
                    catchError(error => {
                        toast.error("Erreur lors de l'ajout aux favoris");
                        return of(FavoritesActions.addFavoriteError({ error }));
                    })
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            mergeMap(action =>
                this.favoriteService.removeFavorite(action.favoriteId).pipe(
                    map(() => {
                        toast.success('Retiré des favoris');
                        return FavoritesActions.removeFavoriteSuccess({ favoriteId: action.favoriteId });
                    }),
                    catchError(error => {
                        toast.error("Erreur lors de la suppression des favoris");
                        return of(FavoritesActions.removeFavoriteError({ error }));
                    })
                )
            )
        )
    );
}
