export interface Repository<T, ID = string> {
  findAll(): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

export interface SearchRepository<T, ID = string> extends Repository<T, ID> {
  search(criteria: Partial<T>): Promise<T[]>;
  findBy(criteria: Partial<T>): Promise<T[]>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedRepository<T, ID = string> extends Repository<T, ID> {
  findPaginated(page: number, limit: number, filters?: Partial<T>): Promise<PaginatedResult<T>>;
}
