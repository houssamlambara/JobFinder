export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  userId: number;
  offerId: string | number;
  apiSource: string; // To know which API to query if needed
  title: string;
  company: string;
  location: string;
  url: string;
  status: ApplicationStatus;
  notes: string;
  dateAdded: string; // ISO date string
}
