
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-applications',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './applications.html'
})
export class ApplicationsComponent { }
