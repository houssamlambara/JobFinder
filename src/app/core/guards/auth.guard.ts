import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard pour protéger les routes qui nécessitent une authentification
 * Redirige vers /auth/login si l'utilisateur n'est pas connecté
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Vérifier si l'utilisateur est connecté
  if (authService.currentUser()) {
    return true;
  }

  // Rediriger vers login avec l'URL de retour
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

