import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '../../core/services/auth.service';
import { JobsService, JobSearchParams } from '../../core/services/jobs.service';
import { Job } from '../../core/models/job.model';
import * as FavoritesActions from '../../core/store/favorites/favorite.actions';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
    private jobsService = inject(JobsService);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    private store = inject(Store);
    private cdr = inject(ChangeDetectorRef);

    jobs = signal<Job[]>([]);
    totalJobs = signal<number>(0);
    currentPage = signal<number>(1);
    isLoading = signal<boolean>(false);

    itemsPerPage = 10;

    searchWhat = '';
    searchWhere = '';

    private searchSubject = new Subject<void>();

    constructor() {
        this.searchSubject.pipe(
            debounceTime(500)
        ).subscribe(() => {
            this.currentPage.set(1);
            this.loadJobs();
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['what']) this.searchWhat = params['what'];
            if (params['where']) this.searchWhere = params['where'];
            if (params['page']) this.currentPage.set(Number(params['page']));

            this.loadJobs();
        });

        const user = this.authService.currentUser();
        if (user) {
            this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
        }
    }

    loadJobs(): void {
        this.isLoading.set(true);

        const params: JobSearchParams = {
            what: this.searchWhat,
            where: this.searchWhere,
            page: this.currentPage(),
            results_per_page: this.itemsPerPage
        };

        this.jobsService.searchJobs(params).subscribe({
            next: (response) => {
                this.jobs.set(response.jobs);
                this.totalJobs.set(response.total);
                this.isLoading.set(false);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading jobs', err);
                this.isLoading.set(false);
                this.cdr.detectChanges();
            }
        });
    }

    onSearch(): void {
        this.updateUrlParams();
    }

    onPageChange(page: number): void {
        this.currentPage.set(page);
        this.updateUrlParams();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private updateUrlParams(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                what: this.searchWhat || null,
                where: this.searchWhere || null,
                page: this.currentPage()
            },
            queryParamsHandling: 'merge'
        });
    }

    get isAuthenticated(): boolean {
        return !!this.authService.currentUser();
    }

    get currentUserName(): string {
        return this.authService.currentUser()?.name || '';
    }

    logout(): void {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            this.authService.logout();
        }
    }

    get totalPages(): number {
        return Math.ceil(this.totalJobs() / this.itemsPerPage);
    }

    get pages_array(): number[] {
        const total = this.totalPages;
        const current = this.currentPage();
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }
        if (current - delta > 2) range.unshift(-1);
        if (current + delta < total - 1) range.push(-1);
        range.unshift(1);
        if (total > 1) range.push(total);
        return range;
    }

    getDisplay(obj: any): string {
        if (typeof obj === 'string') return obj;
        return obj?.display_name || '';
    }
}
