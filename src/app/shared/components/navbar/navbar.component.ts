import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <a routerLink="/home" class="flex items-center gap-2 text-xl font-bold text-primary">
            <span class="material-symbols-outlined text-3xl">work</span>
            <span>JobFinder</span>
          </a>

          <!-- Navigation -->
          <div class="flex items-center gap-4">
            <!-- Liens publics -->
            <a routerLink="/home"
               routerLinkActive="text-primary"
               [routerLinkActiveOptions]="{exact: false}"
               class="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
              Recherche
            </a>

            <!-- Liens authentifiés -->
            <ng-container *ngIf="authService.currentUser() as user">
              <a routerLink="/favorites"
                 routerLinkActive="text-primary"
                 class="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
                Favoris
              </a>
              <a routerLink="/applications"
                 routerLinkActive="text-primary"
                 class="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
                Candidatures
              </a>
              <a routerLink="/profile"
                 routerLinkActive="text-primary"
                 class="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
                Profil
              </a>

              <!-- User info -->
              <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                <span class="material-symbols-outlined text-gray-600 dark:text-gray-300">person</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ user.name }}</span>
              </div>

              <!-- Logout button -->
              <button
                (click)="logout()"
                class="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition font-medium">
                <span class="material-symbols-outlined text-sm">logout</span>
                <span>Déconnexion</span>
              </button>
            </ng-container>

            <!-- Liens non authentifiés -->
            <ng-container *ngIf="!authService.currentUser()">
              <a routerLink="/auth/login"
                 class="text-gray-700 dark:text-gray-300 hover:text-primary transition font-medium">
                Connexion
              </a>
              <a routerLink="/auth/register"
                 class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full transition font-medium">
                Inscription
              </a>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) { }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      this.authService.logout();
    }
  }
}

