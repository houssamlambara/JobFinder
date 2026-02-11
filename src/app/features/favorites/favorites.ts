
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './favorites.html',
    styles: [
        `
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            line-height: 1;
        }
        .filled-icon {
            font-variation-settings: 'FILL' 1;
        }
        /* Custom scrollbar utility if not present in global styles */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        `
    ]
})
export class FavoritesComponent {
    // Logic will be added later with NgRx
}
