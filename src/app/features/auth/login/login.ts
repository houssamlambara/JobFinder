import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  returnUrl = '/home';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Récupérer l'URL de retour si elle existe (depuis le guard)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';

    // Initialiser le formulaire réactif
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Si déjà connecté, rediriger (commenté pour permettre l'accès pendant les tests)
    // if (this.authService.currentUser()) {
    //   this.router.navigate([this.returnUrl]);
    // }
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user) {
          // Connexion réussie
          console.log('Connexion réussie:', user);
          this.router.navigate([this.returnUrl]);
        } else {
          // Identifiants invalides
          this.errorMessage = 'Email ou mot de passe incorrect';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        console.error('Erreur login:', err);
      }
    });
  }
}
