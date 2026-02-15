import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../env/environment';
import { Job } from '../models/job.model';

export interface TheMuseJob {
  id: number;
  name: string;
  contents: string;
  publication_date: string;
  locations: { name: string }[];
  company: { name: string };
  refs: { landing_page: string };
  categories: { name: string }[];
  levels: { name: string }[];
}

export interface TheMuseResponse {
  results: TheMuseJob[];
  page: number;
  page_count: number;
  total: number;
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
}

export interface JobSearchParams {
  what?: string;
  where?: string;
  page?: number;
  results_per_page?: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private http = inject(HttpClient);
  private apiUrl = environment.theMuseApiUrl;

  searchJobs(params?: JobSearchParams): Observable<JobSearchResponse> {
    let httpParams = new HttpParams()
      .set('page', params?.page || 1);


    if (params?.where) {
      httpParams = httpParams.set('location', params.where);
    }

    if (params?.what) {
      httpParams = httpParams.set('category', params.what);
    }

    return this.http.get<TheMuseResponse>(this.apiUrl, { params: httpParams })
      .pipe(
        map(response => ({
          jobs: response.results.map(this.mapTheMuseToJob),
          total: response.total
        })),
        catchError((err) => {
          console.error('Erreur API The Muse', err);
          return of({ jobs: [], total: 0 });
        })
      );
  }

  getJobById(id: string): Observable<Job | null> {
    return this.http.get<TheMuseJob>(`${this.apiUrl}/${id}`).pipe(
      map(this.mapTheMuseToJob),
      catchError(() => of(null))
    );
  }

  private mapTheMuseToJob(museJob: TheMuseJob): Job {
    return {
      id: String(museJob.id),
      title: museJob.name,
      company: { display_name: museJob.company.name },
      location: { display_name: museJob.locations[0]?.name || 'Unknown Location' },
      description: museJob.contents,
      url: museJob.refs.landing_page,
      date_posted: museJob.publication_date,
      salary_min: undefined,
      salary_max: undefined,
      contract_type: museJob.levels[0]?.name
    };
  }
}


