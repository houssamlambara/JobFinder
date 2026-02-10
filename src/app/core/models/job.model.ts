export interface Job {
  id: string | number;
  title: string;
  company: {
    display_name: string;
  } | string; // API dependent, adapting to common structures
  location: {
    display_name: string;
  } | string;
  description: string;
  url: string;
  date_posted: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string; // e.g., 'full_time', 'part_time'
}
