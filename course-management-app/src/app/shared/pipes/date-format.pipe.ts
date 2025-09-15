import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe to format dates in various formats
 * Usage: {{ date | dateFormat:'short' | dateFormat:'long' }}
 */
@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {

  /**
   * Transform a date value to a formatted string
   * @param value - The date value to transform
   * @param format - The format type ('short', 'long', 'time', 'datetime')
   * @returns Formatted date string
   */
  transform(value: Date | string | null | undefined, format: string = 'short'): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }

    switch (format.toLowerCase()) {
      case 'short':
        return this.formatShort(date);
      case 'long':
        return this.formatLong(date);
      case 'time':
        return this.formatTime(date);
      case 'datetime':
        return this.formatDateTime(date);
      case 'relative':
        return this.formatRelative(date);
      default:
        return this.formatShort(date);
    }
  }

  /**
   * Format date in short format (DD/MM/YYYY)
   */
  private formatShort(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Format date in long format (DD Month YYYY)
   */
  private formatLong(date: Date): string {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  }

  /**
   * Format time (HH:MM)
   */
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Format date and time (DD/MM/YYYY HH:MM)
   */
  private formatDateTime(date: Date): string {
    const dateStr = this.formatShort(date);
    const timeStr = this.formatTime(date);
    return `${dateStr} à ${timeStr}`;
  }

  /**
   * Format relative time (il y a X jours/heures)
   */
  private formatRelative(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInMinutes > 0) {
      return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
    } else {
      return 'à l\'instant';
    }
  }
}
