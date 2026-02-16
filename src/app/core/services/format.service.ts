import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {

  formatSalary(salaryMin?: number, salaryMax?: number): string {
    if (!salaryMin && !salaryMax) {
      return 'Non spécifié';
    }

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(num);
    };

    if (salaryMin && salaryMax) {
      return `${formatNumber(salaryMin)} - ${formatNumber(salaryMax)}`;
    } else if (salaryMin) {
      return `À partir de ${formatNumber(salaryMin)}`;
    } else {
      return `Jusqu'à ${formatNumber(salaryMax!)}`;
    }
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      return "Aujourd'hui";
    } else if (diffDays === 2) {
      return 'Hier';
    } else if (diffDays <= 7) {
      return `Il y a ${diffDays} jours`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  truncateText(text: string, maxLength: number = 150): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  extractCity(location: string): string {
    return location.split(',')[0].trim();
  }
}

