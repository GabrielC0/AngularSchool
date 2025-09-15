export const APP_CONSTANTS = {
  // API Configuration
  API_BASE_URL: 'http://localhost:3000/api',
  
  // Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'current_user'
  },
  
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
  
  // User Roles
  USER_ROLES: {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
  },
  
  // Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    DASHBOARD: '/dashboard',
    COURSES: '/courses',
    STUDENTS: '/students',
    TEACHERS: '/teachers',
    PROFILE: '/profile'
  }
} as const;
