import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Favorite } from '../../core/models/favorite.model';
import * as FavoritesActions from '../../core/store/favorites/favorite.actions';
import { selectAllFavorites, selectFavoritesLoading } from '../../core/store/favorites/favorite.selectors';
import { AuthService } from '../../core/services/auth.service';


@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './favorites.html'
})
export class FavoritesComponent implements OnInit {
    private store = inject(Store);
    private authService = inject(AuthService);
    private router = inject(Router);


    favorites$: Observable<Favorite[]> = this.store.select(selectAllFavorites);
    isLoading$: Observable<boolean> = this.store.select(selectFavoritesLoading);

    ngOnInit(): void {
        const user = this.authService.currentUser();
        if (!user) {
            this.router.navigate(['/auth/login']);
            return;
        }


        this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));



    }

    removeFavorite(id: string | number | undefined): void {
        if (!id) return;
        if (confirm('Retirer ce favori ?')) {
            this.store.dispatch(FavoritesActions.removeFavorite({ favoriteId: id }));
        }
    }
}
