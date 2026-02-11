import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.html',
  styles: [`
    .ios-shadow {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class RegisterComponent {
  // Logic disabled as per user request
}
