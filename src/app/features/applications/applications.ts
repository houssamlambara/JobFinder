import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApplicationService } from '../../core/services/application.service';
import { Application, ApplicationStatus } from '../../core/models/application.model';
import { AuthService } from '../../core/services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-applications',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './applications.html'
})
export class ApplicationsComponent implements OnInit {
    private applicationService = inject(ApplicationService);
    private authService = inject(AuthService);

    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);

    applications = signal<Application[]>([]);
    currentFilter = signal<ApplicationStatus | 'all'>('all');

    filteredApplications = computed(() => {
        const apps = this.applications();
        const filter = this.currentFilter();
        if (filter === 'all') {
            return apps;
        }
        return apps.filter(app => app.status === filter);
    });

    ngOnInit(): void {
        this.loadApplications();
    }

    loadApplications(): void {
        const user = this.authService.currentUser();
        if (!user) {
            this.router.navigate(['/auth/login']);
            return;
        }


        this.applicationService.getApplications(user.id).subscribe({
            next: (apps) => {
                this.applications.set(apps);

                this.cdr.detectChanges();
            },
            error: () => {
                toast.error("Erreur lors du chargement des candidatures");

                this.cdr.detectChanges();
            }
        });
    }

    filterApplications(status: ApplicationStatus | 'all'): void {
        this.currentFilter.set(status);
    }

    updateStatus(app: Application, newStatus: ApplicationStatus): void {
        if (!app.id) return;

        this.applicationService.updateStatus(app.id, newStatus).subscribe({
            next: () => {
                const apps = this.applications().map(a =>
                    a.id === app.id ? { ...a, status: newStatus } : a
                );
                this.applications.set(apps);
                toast.success(`Statut mis à jour : ${this.getStatusLabel(newStatus)}`);
            },
            error: () => {
                toast.error("Erreur lors de la mise à jour du statut");
            }
        });
    }

    deleteApplication(id: string | number | undefined): void {
        if (!id) return;

        if (confirm('Voulez-vous vraiment supprimer cette candidature ?')) {
            this.applicationService.deleteApplication(id).subscribe({
                next: () => {
                    const apps = this.applications().filter(a => a.id !== id);
                    this.applications.set(apps);
                    toast.success("Candidature supprimée");
                },
                error: () => {
                    toast.error("Erreur lors de la suppression");
                }
            });
        }
    }

    getStatusLabel(status: ApplicationStatus): string {
        switch (status) {
            case 'pending': return 'En attente';
            case 'interview': return 'Entretien';
            case 'offer': return 'Offre reçue';
            case 'rejected': return 'Refusé';
            default: return status;
        }
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'interview': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'offer': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }
}
