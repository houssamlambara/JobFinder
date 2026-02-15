export type ApplicationStatus = 'pending' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id?: string | number;
  userId: string | number;
  offerId: string | number;
  apiSource?: string;
  title: string;
  company: string;
  location: string;
  url?: string;
  status: ApplicationStatus;
  dateAdded: string;
  notes?: string;
}
