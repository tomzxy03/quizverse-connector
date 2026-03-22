// API Endpoints for Spring Boot backend – aligned with api.json Swagger spec
// All paths are relative to the base URL (e.g. http://localhost:8080/api)

import { QuizFilter } from "@/domains";

const buildQuery = (params: Record<string, any>) =>
  new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  ).toString();

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CURRENT_USER: '/auth/me',
  },

  // Dashboard
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    PROFILE: (id: number) => `/users/${id}/profile`,
    DELETE_MANY: '/users/delete_many',
  },

  // Subjects
  SUBJECTS: {
    BASE: '/subjects',
    BY_ID: (id: number) => `/subjects/${id}`,
    QUIZ_COUNT: '/subjects/quiz_count',
  },

  // Question Banks
  QUESTION_BANKS: {
    BASE: '/question-banks',
    MY_BANK: '/question-banks/my-bank',
  },

  // Folders
  FOLDERS: {
    BASE: '/folders',
    BY_ID: (folderId: number) => `/folders/${folderId}`,
    ROOT: '/folders/root',
    TREE: '/folders/tree',
    MOVE: (folderId: number) => `/folders/${folderId}/move`,
  },

  // Question Folders
  QUESTION_FOLDERS: {
    BASE: '/questions-folder',
    BY_ID: (questionId: number) => `/questions-folder/${questionId}`,
    MOVE: (questionId: number) => `/questions-folder/${questionId}/move`,
    ROOT: '/questions-folder/root',
    BY_FOLDER: (folderId: number) => `/questions-folder/folder/${folderId}`,
  },

  // Quizzes
  QUIZZES: {
    BASE: '/quizzes',
    BY_ID: (id: number) => `/quizzes/${id}`,
    CREATE: '/quizzes',
    ADD_LIST: (quizId: number) => `/quizzes/${quizId}/add_list`,
    UPDATE: (id: number) => `/quizzes/${id}`,
    UPDATE_LIST: (quizId: number) => `/quizzes/${quizId}/update_list`,
    DELETE: (id: number) => `/quizzes/${id}`,
    GET_BY_FILTER: (filter: QuizFilter) => `/quizzes/filter?${buildQuery(filter)}`,
    START: (quizId: number) => `/quizzes/${quizId}/start`,
    ACTIVE_INSTANCE: (quizId: number) => `/quizzes/${quizId}/active-instance`,
  },

  // Questions (nested under quizzes)
  QUESTIONS: {
    BY_QUIZ: (quizId: number) => `/quizzes/${quizId}/questions`,
    BY_ID: (quizId: number, questionId: number) => `/quizzes/${quizId}/questions/${questionId}`,
    ADD_LIST: (quizId: number) => `/quizzes/${quizId}/questions/add_list`,
    IMPORT: '/questions/import',
  },

  // Answers
  ANSWERS: {
    BASE: '/answers',
    BY_ID: (id: number) => `/answers/${id}`,
  },

  // Quiz Instances
  QUIZ_INSTANCES: {
    START: '/quiz-instances/start',
    BY_ID: (instanceId: number) => `/quiz-instances/${instanceId}`,
    SUBMIT: (instanceId: number) => `/quiz-instances/${instanceId}/submit`,
    RESULT: (instanceId: number) => `/quiz-instances/${instanceId}/result`,
    CHECK_ELIGIBILITY: '/quiz-instances/check-eligibility',
    SAVE_ANSWER: (instanceId: number) => `/quiz-instances/${instanceId}/answer`,
    GET_STATE: (instanceId: number) => `/quiz-instances/${instanceId}/state`,
  },

  // Quiz User Responses
  QUIZ_USER_RESPONSES: {
    BASE: '/quiz-user-responses',
    BY_ID: (id: number) => `/quiz-user-responses/${id}`,
    UPDATE_ANSWER: (responseId: number) => `/quiz-user-responses/${responseId}/answer`,
    SUBMIT: '/quiz-user-responses/submit',
    SKIP: '/quiz-user-responses/skip',
    BY_USER: (userId: number) => `/quiz-user-responses/user/${userId}`,
    BY_USER_PAGE: (userId: number) => `/quiz-user-responses/user/${userId}/page`,
    BY_QUIZ_INSTANCE: (quizInstanceId: number) => `/quiz-user-responses/quiz-instance/${quizInstanceId}`,
    BY_QUIZ_INSTANCE_USER: (quizInstanceId: number, userId: number) =>
      `/quiz-user-responses/quiz-instance/${quizInstanceId}/user/${userId}`,
    CORRECT: '/quiz-user-responses/correct',
    CORRECT_PAGE: '/quiz-user-responses/correct/page',
    ANSWERED: '/quiz-user-responses/answered',
    SKIPPED: '/quiz-user-responses/skipped',
    RECENT: '/quiz-user-responses/recent',
    DATE_RANGE: '/quiz-user-responses/date-range',
    TIME_RANGE: '/quiz-user-responses/time-range',
  },

  // Exam Attempts
  ATTEMPTS: {
    BASE: '/attempts',
    BY_ID: (id: number) => `/attempts/${id}`,
    BY_USER: (userId: number) => `/attempts/user/${userId}`,
    BY_QUIZ_AND_USER: (quizId: number, userId: number) => `/attempts/quiz/${quizId}/user/${userId}`,
    USER_STATISTICS: (userId: number) => `/attempts/user/${userId}/statistics`,
  },

  // Groups (Lobby)
  GROUPS: {
    BASE: '/groups',
    BY_ID: (groupId: number) => `/groups/${groupId}`,
    OWNED: '/groups/owned',
    JOINED: '/groups/joined',
    GET_CODE_INVITE: (groupId: number) => `/groups/${groupId}/get-code-invite`,
    RELOAD_CODE_INVITE: (groupId: number) => `/groups/${groupId}/reload-code-invite`,
    FIND_LOBBY_BY_CODE: (codeInvite: string) =>
      `/groups/find-lobby-by-code/${encodeURIComponent(codeInvite)}`,
    JOIN: '/groups/join',
    // Members endpoints - supports pagination via query params (page, size)
    MEMBERS: (groupId: number) => `/groups/${groupId}/members`,
    REMOVE_MEMBER: (groupId: number, userId: number) => `/groups/${groupId}/members/${userId}`,
    // Quizzes endpoints - supports pagination via query params (page, size)
    QUIZZES: (groupId: number) => `/groups/${groupId}/quizzes`,
    ADD_QUIZ: (groupId: number) => `/groups/${groupId}/quizzes`,
    UPDATE_QUIZ: (groupId: number, quizId: number) => `/groups/${groupId}/quizzes/${quizId}`,
    REMOVE_QUIZ: (groupId: number, quizId: number) => `/groups/${groupId}/quizzes/${quizId}`,
    IMPORT_QUESTIONS: (groupId: number) => `/groups/${groupId}/questions/import`,
    // Announcements endpoints - supports pagination via query params (page, size)
    ANNOUNCEMENTS: (groupId: number) => `/groups/${groupId}/announcements`,
    ADD_ANNOUNCEMENT: (groupId: number) => `/groups/${groupId}/add-announcement`,
    UPDATE_ANNOUNCEMENT: (groupId: number, announcementId: number) =>
      `/groups/${groupId}/announcements/${announcementId}`,
    DELETE_ANNOUNCEMENT: (groupId: number, announcementId: number) =>
      `/groups/${groupId}/announcements/${announcementId}`,
    LEAVE: (groupId: number) => `/groups/${groupId}/leave`,
  },

  // Admin
  ADMIN: {
    BASE: '/tomzxyadmin',
    USERS: '/tomzxyadmin/users',
    USER: (userId: number) => `/tomzxyadmin/users/${userId}`,
    GROUPS: '/tomzxyadmin/groups',
    GROUP: (groupId: number) => `/tomzxyadmin/groups/${groupId}`,
    QUIZZES: '/tomzxyadmin/quizzes',
    QUIZ: (quizId: number) => `/tomzxyadmin/quizzes/${quizId}`,
    RESULTS: '/tomzxyadmin/results',
    RESULT: (resultId: number) => `/tomzxyadmin/results/${resultId}`,
    SUBJECTS: '/tomzxyadmin/subjects',
    SUBJECT: (subjectId: number) => `/tomzxyadmin/subjects/${subjectId}`,
    ROLES: '/tomzxyadmin/roles',
    ROLE: (roleId: number) => `/tomzxyadmin/roles/${roleId}`,
    NOTIFICATIONS: '/tomzxyadmin/notifications',
    NOTIFICATION: (notificationId: number) => `/tomzxyadmin/notifications/${notificationId}`,
    QUESTION_BANKS: '/tomzxyadmin/question-banks',
  },

  // Roles
  ROLES: {
    BASE: '/roles',
    BY_ID: (roleId: number) => `/roles/${roleId}`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: number) => `/notifications/${id}`,
  },
} as const;
