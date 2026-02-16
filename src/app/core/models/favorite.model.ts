export interface Favorite {
  id?: string | number;
  userId: string | number;
  offerId: string | number;
  title: string;
  company: string;
  location: string;
  dateSaved?: string;
  jobUrl?: string;
}

export interface FavoritesState {
  favorites: Favorite[];
  error: any;
  isLoading: boolean;
}
