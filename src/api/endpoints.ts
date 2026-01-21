// API Endpoints for Spring Boot backend
// These endpoints should match your Spring Boot @RestController mappings

import { SubjectReqDTO } from "@/domains/subject/subject.dto";

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CURRENT_USER: '/auth/me',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    PROFILE: (id: number) => `/users/${id}/profile`,
    UPDATE_PROFILE: (id: number) => `/users/${id}/profile`,
  },

  //Subjects
  SUBJECTS: {
    BASE: '/subjects',
    BY_ID: (id: number) => `/subjects/${id}`,
    CREATE: '/subjects',
    UPDATE: (id: number) => `/subjects/${id}`,
    DELETE: (id: number) => `/subjects/${id}`,
  },

  // Quizzes
  QUIZZES: {
    BASE: '/quizzes',
    BY_ID: (id: number) => `/quizzes/${id}`,
    BY_SUBJECT: (subject: string) => `/quizzes/subject/${subject}`,
    POPULAR: '/quizzes/popular',
    LATEST: '/quizzes/latest',
    SEARCH: '/quizzes/search',
    SUBJECTS: '/quizzes/subjects',
    CREATE: '/quizzes',
    UPDATE: (id: number) => `/quizzes/${id}`,
    DELETE: (id: number) => `/quizzes/${id}`,
    STATISTICS: (id: number) => `/quizzes/${id}/statistics`,
  },

  // Questions
  QUESTIONS: {
    BY_QUIZ: (quizId: string) => `/quizzes/${quizId}/questions`,
    BY_ID: (quizId: string, questionId: string) => `/quizzes/${quizId}/questions/${questionId}`,
    CREATE: (quizId: string) => `/quizzes/${quizId}/questions`,
    UPDATE: (quizId: string, questionId: string) => `/quizzes/${quizId}/questions/${questionId}`,
    DELETE: (quizId: string, questionId: string) => `/quizzes/${quizId}/questions/${questionId}`,
  },

  // Exam Attempts
  ATTEMPTS: {
    BASE: '/attempts',
    BY_ID: (id: number) => `/attempts/${id}`,
    BY_USER: (userId: string) => `/attempts/user/${userId}`,
    BY_QUIZ: (quizId: string, userId: string) => `/attempts/quiz/${quizId}/user/${userId}`,
    CREATE: '/attempts',
    DELETE: (id: number) => `/attempts/${id}`,
    STATISTICS: (userId: string) => `/attempts/user/${userId}/statistics`,
  },

  // Groups
  GROUPS: {
    BASE: '/groups',
    BY_ID: (id: number) => `/groups/${id}`,
    BY_USER: (userId: string) => `/groups/user/${userId}`,
    CREATE: '/groups',
    UPDATE: (id: number) => `/groups/${id}`,
    DELETE: (id: number) => `/groups/${id}`,

    // Members
    MEMBERS: (groupId: string) => `/groups/${groupId}/members`,
    ADD_MEMBER: (groupId: string) => `/groups/${groupId}/members`,
    REMOVE_MEMBER: (groupId: string, userId: string) => `/groups/${groupId}/members/${userId}`,
    UPDATE_ROLE: (groupId: string, userId: string) => `/groups/${groupId}/members/${userId}/role`,

    // Announcements
    ANNOUNCEMENTS: (groupId: string) => `/groups/${groupId}/announcements`,
    CREATE_ANNOUNCEMENT: (groupId: string) => `/groups/${groupId}/announcements`,
    UPDATE_ANNOUNCEMENT: (groupId: string, announcementId: string) =>
      `/groups/${groupId}/announcements/${announcementId}`,
    DELETE_ANNOUNCEMENT: (groupId: string, announcementId: string) =>
      `/groups/${groupId}/announcements/${announcementId}`,

    // Quizzes
    QUIZZES: (groupId: string) => `/groups/${groupId}/quizzes`,
    ADD_QUIZ: (groupId: string) => `/groups/${groupId}/quizzes`,
    REMOVE_QUIZ: (groupId: string, quizId: string) => `/groups/${groupId}/quizzes/${quizId}`,

    // Shared Resources
    RESOURCES: (groupId: string) => `/groups/${groupId}/resources`,
    UPLOAD_RESOURCE: (groupId: string) => `/groups/${groupId}/resources`,
    DELETE_RESOURCE: (groupId: string, resourceId: string) =>
      `/groups/${groupId}/resources/${resourceId}`,
  },

  // Statistics
  STATISTICS: {
    USER: (userId: string) => `/statistics/user/${userId}`,
    QUIZ: (quizId: string) => `/statistics/quiz/${quizId}`,
    DASHBOARD: '/statistics/dashboard',
  },

  // File Upload
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (fileId: string) => `/files/${fileId}`,
  },
} as const;
