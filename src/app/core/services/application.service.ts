import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { Application, ApplicationStatus } from '../models/application.model';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.jsonServerUrl}/applications`;

    getApplications(userId: string | number): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addApplication(application: Application): Observable<Application> {
        return this.http.post<Application>(this.apiUrl, application);
    }

    updateStatus(id: string | number, status: ApplicationStatus): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
    }

    deleteApplication(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
