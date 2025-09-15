export const APP_CONSTANTS = {
  // API Configuration
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  },
  
  // Course Status
  COURSE_STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  },
  
  // Routes
  ROUTES: {
    HOME: '/',
    COURSES: '/courses'
  }
} as const;
