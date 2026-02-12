import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './home.html'
})
export class HomeComponent {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    get isAuthenticated(): boolean {
        return !!this.authService.currentUser();
    }

    get currentUserName(): string {
        return this.authService.currentUser()?.name || '';
    }

    logout(): void {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            this.authService.logout();
        }
    }
}
