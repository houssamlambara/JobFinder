import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth/login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
    },
    {
        path: 'auth/register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
    },
    {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites').then(m => m.FavoritesComponent)
    },
    {
        path: 'applications',
        loadComponent: () => import('./features/applications/applications').then(m => m.ApplicationsComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent)
    },
    {
        path: 'jobs/:id',
        loadComponent: () => import('./features/jobs/job-details').then(m => m.JobDetailsComponent)
    },
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    }
];
