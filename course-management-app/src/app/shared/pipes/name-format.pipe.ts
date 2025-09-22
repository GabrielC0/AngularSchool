import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'nameFormat',
  standalone: true
})
export class NameFormatPipe implements PipeTransform {

  
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

  
  private formatInitials(name: string): string {

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

  
  private formatTitle(name: string): string {
    return name
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  
  private formatCapitalize(text: string): string {
    if (text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  
  private formatAbbreviate(name: string): string {
    const words = name.split(' ').filter(word => word.length > 0);
    
    if (words.length === 0) {
      return '';
    }
    

    if (words.length === 1 && words[0].length > 4) {
      return words[0].charAt(0).toUpperCase() + '.';
    }
    

    if (words.length > 1) {
      return words
        .map(word => word.charAt(0).toUpperCase())
        .join('.') + '.';
    }
    

    return words[0];
  }
}
