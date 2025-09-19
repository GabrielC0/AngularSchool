import { NameFormatPipe } from './name-format.pipe';

describe('NameFormatPipe', () => {
  let pipe: NameFormatPipe;

  beforeEach(() => {
    pipe = new NameFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null or undefined input', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('   ')).toBe('');
  });

  it('should format to title case by default', () => {
    expect(pipe.transform('john doe')).toBe('John Doe');
    expect(pipe.transform('JANE SMITH')).toBe('Jane Smith');
    expect(pipe.transform('bOb JoHnSoN')).toBe('Bob Johnson');
  });

  it('should format to title case explicitly', () => {
    expect(pipe.transform('john doe', 'title')).toBe('John Doe');
    expect(pipe.transform('JANE SMITH', 'title')).toBe('Jane Smith');
  });

  it('should format to initials', () => {
    expect(pipe.transform('John Doe', 'initials')).toBe('J.D.');
    expect(pipe.transform('Jane Smith Wilson', 'initials')).toBe('J.S.W.');
    expect(pipe.transform('A', 'initials')).toBe('A.');
  });

  it('should format to capitalize (first letter only)', () => {
    expect(pipe.transform('john doe', 'capitalize')).toBe('John doe');
    expect(pipe.transform('JANE SMITH', 'capitalize')).toBe('Jane smith');
  });

  it('should format to uppercase', () => {
    expect(pipe.transform('john doe', 'uppercase')).toBe('JOHN DOE');
    expect(pipe.transform('Jane Smith', 'uppercase')).toBe('JANE SMITH');
  });

  it('should format to lowercase', () => {
    expect(pipe.transform('JOHN DOE', 'lowercase')).toBe('john doe');
    expect(pipe.transform('Jane Smith', 'lowercase')).toBe('jane smith');
  });

  it('should abbreviate long names', () => {
    expect(pipe.transform('Christopher', 'abbreviate')).toBe('C.');
    expect(pipe.transform('Elizabeth', 'abbreviate')).toBe('E.');
    expect(pipe.transform('John', 'abbreviate')).toBe('John'); // Short names unchanged
  });

  it('should handle single names', () => {
    expect(pipe.transform('John', 'title')).toBe('John');
    expect(pipe.transform('John', 'initials')).toBe('J.');
    expect(pipe.transform('John', 'capitalize')).toBe('John');
  });

  it('should handle names with extra spaces', () => {
    expect(pipe.transform('  John   Doe  ', 'title')).toBe('John Doe');
    expect(pipe.transform('  Jane   Smith   Wilson  ', 'initials')).toBe('J.S.W.');
  });

  it('should handle case insensitive format parameter', () => {
    expect(pipe.transform('john doe', 'TITLE')).toBe('John Doe');
    expect(pipe.transform('john doe', 'Title')).toBe('John Doe');
    expect(pipe.transform('john doe', 'tItLe')).toBe('John Doe');
  });

  it('should default to title case for unknown format', () => {
    expect(pipe.transform('john doe', 'unknown')).toBe('John Doe');
    expect(pipe.transform('john doe', 'invalid')).toBe('John Doe');
  });

  it('should handle special characters in names', () => {
    expect(pipe.transform("O'Connor", 'title')).toBe("O'connor");
    expect(pipe.transform('Jean-Pierre', 'title')).toBe('Jean-pierre');
    expect(pipe.transform('Mary-Jane', 'initials')).toBe('M.J.');
  });

  it('should handle numbers in names', () => {
    expect(pipe.transform('John2 Doe3', 'title')).toBe('John2 Doe3');
    expect(pipe.transform('User123', 'initials')).toBe('U.');
  });
});
