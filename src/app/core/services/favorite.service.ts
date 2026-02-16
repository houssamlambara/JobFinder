import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { Favorite } from '../models/favorite.model';

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.jsonServerUrl}/favoritesOffers`; // Aligned with requirements "favoritesOffers"

    getFavorites(userId: string | number): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addFavorite(favorite: Omit<Favorite, 'id'>): Observable<Favorite> {
        return this.http.post<Favorite>(this.apiUrl, favorite);
    }

    removeFavorite(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    isFavorite(userId: string | number, jobId: string | number): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}&offerId=${jobId}`);
    }
}
