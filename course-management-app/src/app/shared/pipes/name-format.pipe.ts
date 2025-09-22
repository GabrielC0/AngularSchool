import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe to format names and text
 * Usage: {{ name | nameFormat:'initials' | nameFormat:'title' }}
 */
@Pipe({
  name: 'nameFormat',
  standalone: true
})
export class NameFormatPipe implements PipeTransform {

  /**
   * Transform a name or text value to a formatted string
   * @param value - The text value to transform
   * @param format - The format type ('initials', 'title', 'capitalize', 'abbreviate')
   * @returns Formatted text string
   */
  transform(value: string | null | undefined, format: string = 'title'): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return '';
    }

    switch (format.toLowerCase()) {
      case 'initials':
        return this.formatInitials(trimmedValue);
      case 'title':
        return this.formatTitle(trimmedValue);
      case 'capitalize':
        return this.formatCapitalize(trimmedValue);
      case 'abbreviate':
        return this.formatAbbreviate(trimmedValue);
      case 'uppercase':
        return trimmedValue.toUpperCase();
      case 'lowercase':
        return trimmedValue.toLowerCase();
      default:
        return this.formatTitle(trimmedValue);
    }
  }

  /**
   * Format name to initials (John Doe -> J.D.)
   */
  private formatInitials(name: string): string {
    // Split by spaces and hyphens, then filter empty strings
    const words = name.split(/[\s-]+/).filter(word => word.length > 0);
    
    if (words.length === 0) {
      return '';
    }
    
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase() + '.';
    }
    
    return words
      .map(word => word.charAt(0).toUpperCase())
      .join('.') + '.';
  }

  /**
   * Format name with proper title case (john doe -> John Doe)
   */
  private formatTitle(name: string): string {
    return name
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  /**
   * Format text with first letter capitalized (hello world -> Hello world)
   */
  private formatCapitalize(text: string): string {
    if (text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Abbreviate long names (Christopher -> C.)
   */
  private formatAbbreviate(name: string): string {
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length === 0) {
      return '';
    }
    
    // For single words longer than 4 characters, return first letter + dot
    if (words.length === 1 && words[0].length > 4) {
      return words[0].charAt(0).toUpperCase() + '.';
    }
    
    // For multiple words, return first letter of each word + dots
    if (words.length > 1) {
      return words
        .map(word => word.charAt(0).toUpperCase())
        .join('.') + '.';
    }
    
    // For short single words, return as is
    return words[0];
  }
}
