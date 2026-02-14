import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
    templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);

    private router = inject(Router);

    user: User | null = null;
    profileForm: FormGroup;
    isEditing = false;
    isSubmitting = false;

    constructor() {
        this.profileForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        this.user = this.authService.currentUser();
        if (!this.user) {
            this.router.navigate(['/auth/login']);
            return;
        }
        this.initForm();
    }

    initForm(): void {
        if (this.user) {
            this.profileForm.patchValue({
                name: this.user.name,
                email: this.user.email,
                password: this.user.password
            });
            this.profileForm.disable();
        }
    }

    toggleEdit(): void {
        this.isEditing = !this.isEditing;
        if (this.isEditing) {
            this.profileForm.enable();
        } else {
            this.profileForm.disable();
            this.initForm();
        }
    }

    onSubmit(): void {
        if (this.profileForm.invalid || !this.user) return;

        this.isSubmitting = true;


        const updatedData = this.profileForm.value;

        this.authService.updateProfile(this.user.id, updatedData).subscribe({
            next: (updatedUser) => {
                this.user = updatedUser;
                this.isEditing = false;
                this.profileForm.disable();
                this.isSubmitting = false;

                toast.success('Profil mis à jour avec succès');
            },
            error: () => {
                this.isSubmitting = false;

                toast.error('Erreur lors de la mise à jour');
            }
        });
    }

    deleteAccount(): void {
        if (!this.user) return;

        if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {

            this.authService.deleteAccount(this.user.id).subscribe({
                next: () => {

                    toast.success('Compte supprimé');
                },
                error: () => {

                    toast.error('Erreur lors de la suppression');
                }
            });
        }
    }

    logout(): void {
        this.authService.logout();
    }
}
