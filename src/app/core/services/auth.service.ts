import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, of, catchError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/users';

    // Signal to hold current user state
    currentUser = signal<User | null>(this.getUserFromStorage());

    constructor(private http: HttpClient, private router: Router) { }

    register(user: Omit<User, 'id'>): Observable<User> {
        return this.http.post<User>(this.apiUrl, user).pipe(
            tap(newUser => {
                this.storeUser(newUser);
            })
        );
    }

    // Basic "fake" login by checking if user exists with matching creds
    login(email: string, password: string): Observable<User | null> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
            map(users => {
                if (users.length > 0) {
                    const user = users[0];
                    this.storeUser(user);
                    return user;
                }
                return null; // Invalid credentials
            }),
            catchError(() => of(null))
        );
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    private storeUser(user: User) {
        // Remove password before storing
        const { password, ...safeUser } = user;
        localStorage.setItem('user', JSON.stringify(safeUser));
        this.currentUser.set(safeUser as User);
    }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
}
