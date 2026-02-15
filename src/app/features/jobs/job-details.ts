import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { JobsService } from '../../core/services/jobs.service';
import { Job } from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
import * as FavoritesActions from '../../core/store/favorites/favorite.actions';
import { isFavorite, getFavoriteId } from '../../core/store/favorites/favorite.selectors';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-job-details',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './job-details.html'
})
export class JobDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private jobsService = inject(JobsService);
    public authService = inject(AuthService);
    private applicationService = inject(ApplicationService);
    private store = inject(Store);


    job = signal<Job | null>(null);
    isLoading = true;
    isApplying = false;


    isFavorite$: Observable<boolean> | undefined;
    favoriteId$: Observable<string | number | undefined> | undefined;

    jobRequirements = [
        "Expérience confirmée dans le domaine similaire",
        "Maîtrise des outils et technologies demandés",
        "Esprit d'équipe et bonne communication",
        "Capacité d'adaptation et autonomie",
        "Anglais technique souhaité"
    ];

    jobBenefits = [
        "Salaire compétitif",
        "Horaires flexibles / Télétravail",
        "Mutuelle d'entreprise",
        "Tickets restaurant",
        "Ambiance de travail dynamique"
    ];

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadJob(id);
            }
        });

        const user = this.authService.currentUser();
        if (user) {
            this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
        }
    }

    loadJob(id: string): void {

        this.jobsService.getJobById(id).subscribe({
            next: (job) => {
                this.job.set(job);
                this.isLoading = false;


                if (job) {
                    this.isFavorite$ = this.store.select(isFavorite(job.id));
                    this.favoriteId$ = this.store.select(getFavoriteId(job.id));
                }
            },
            error: () => {
                toast.error("Erreur lors du chargement de l'offre");
                this.isLoading = false;

                this.router.navigate(['/home']);
            }
        });
    }

    apply(): void {
        const user = this.authService.currentUser();
        if (!user) {
            toast.info("Veuillez vous connecter pour postuler");
            this.router.navigate(['/auth/login']);
            return;
        }

        const currentJob = this.job();
        if (!currentJob) return;

        this.isApplying = true;

        this.applicationService.addApplication({
            userId: user.id,
            offerId: currentJob.id,
            apiSource: 'adzuna',
            title: currentJob.title,
            company: this.getDisplay(currentJob.company),
            location: this.getDisplay(currentJob.location),
            status: 'pending',
            dateAdded: new Date().toISOString(),
            notes: '',
            url: currentJob.url
        }).subscribe({
            next: () => {
                toast.success("Candidature envoyée avec succès !");
                this.isApplying = false;
                this.router.navigate(['/applications']);
            },
            error: () => {
                toast.error("Erreur lors de l'envoi de la candidature");
                this.isApplying = false;
            }
        });
    }

    toggleFavorite(): void {
        const user = this.authService.currentUser();
        if (!user) {
            toast.info("Veuillez vous connecter pour sauvegarder");
            this.router.navigate(['/auth/login']);
            return;
        }

        const currentJob = this.job();
        if (!currentJob) return;

        this.favoriteId$?.pipe(take(1)).subscribe(favId => {
            if (favId) {
                this.store.dispatch(FavoritesActions.removeFavorite({ favoriteId: favId }));
            } else {
                if (!user || !currentJob) return;
                this.store.dispatch(FavoritesActions.addFavorite({
                    favorite: {
                        userId: user.id,
                        offerId: currentJob.id,
                        title: currentJob.title,
                        company: this.getDisplay(currentJob.company),
                        location: this.getDisplay(currentJob.location),
                        dateSaved: new Date().toISOString(),
                        jobUrl: currentJob.url
                    }
                }));
            }
        });
    }

    getDisplay(obj: { display_name: string } | string | undefined | null): string {
        if (!obj) return '';
        if (typeof obj === 'string') return obj;
        return obj?.display_name || '';
    }
}
