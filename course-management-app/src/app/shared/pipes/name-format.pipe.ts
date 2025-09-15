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
    const words = name.split(' ').filter(word => word.length > 0);
    
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
      .split(' ')
      .map(word => {
        if (word.length === 0) return word;
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
   * Abbreviate long text (This is a very long text -> This is a very...)
   */
  private formatAbbreviate(text: string, maxLength: number = 30): string {
    if (text.length <= maxLength) {
      return text;
    }
    
    const truncated = text.substring(0, maxLength - 3);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  }
}
