import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, of, catchError } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../env/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.jsonServerUrl}/users`;

    currentUser = signal<User | null>(this.getUserFromStorage());

    constructor(private http: HttpClient, private router: Router) { }

    register(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user).pipe(
            tap(newUser => {
                this.storeUser(newUser);
            })
        );
    }

    login(email: string, password: string): Observable<User | null> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
            map(users => {
                if (users.length > 0) {
                    const user = users[0];
                    this.storeUser(user);
                    return user;
                }
                return null;
            }),
            catchError(() => of(null))
        );
    }

    updateProfile(id: string | number, data: Partial<User>): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${id}`, data).pipe(
            tap(updatedUser => {
                const current = this.currentUser();
                if (current) {
                    this.storeUser({ ...current, ...updatedUser });
                }
            })
        );
    }

    deleteAccount(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                this.logout();
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    private storeUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
    }

    getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}
