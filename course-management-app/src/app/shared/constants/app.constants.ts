export const APP_CONSTANTS = {

  API_BASE_URL: '/api',


  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },


  COURSE_STATUS: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },


  ROUTES: {
    HOME: '/',
    COURSES: '/courses',
  },
} as const;
