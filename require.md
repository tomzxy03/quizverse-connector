
Group quiz submission page (QuizDetail)
1. Visibility
   - Only shown for group quizzes (quizVisibility = class_only)
   - Only group owner can see the submission list

2. Owner detection (current client logic)
   - group owner = logged-in user with userName === quiz.hostName

3. Data source
   - Fetch submissions via GET /attempts with query param quizId
   - Render list with userId, score, correct/total, duration, completedAt

Plan (review before deploy)
1. Add a submission section inside QuizDetail (group-only)
2. Gate section to group owner (userName === quiz.hostName)
3. Fetch submissions by quizId from /attempts
4. Render list and basic metrics (score, correct/total, duration, completedAt)

API details (submissions)
Request
- Method: GET
- Path: /attempts
- Query params:
  - quizId (number, required for filtering by quiz)
  - userId (number, optional)

Response (AttemptResDTO[])
- id: number
- quizId: number
- userId: number
- score: string
- totalQuestions: number
- correctAnswers: number
- duration: string
- completedAt: string (ISO date-time)
- points?: number
- badges?: string[]
- badgeColors?: string[]

API usage audit (src/core/api/endpoints.ts + repo scan)
Used endpoints:
AUTH.LOGIN -> /auth/login
AUTH.SIGNUP -> /auth/signup
AUTH.LOGOUT -> /auth/logout
AUTH.REFRESH -> /auth/refresh
AUTH.CURRENT_USER -> /auth/me
DASHBOARD.SUMMARY -> /dashboard/summary
USERS.DELETE_MANY -> /users/delete_many
USERS.BY_ID -> /users/${id}
USERS.PROFILE -> /users/${id}/profile
SUBJECTS.BASE -> /subjects
SUBJECTS.BY_ID -> /subjects/${id}
QUESTION_BANKS.BASE -> /question-banks
QUESTION_BANKS.MY_BANK -> /question-banks/my-bank
FOLDERS.BASE -> /folders
FOLDERS.ROOT -> /folders/root
FOLDERS.TREE -> /folders/tree
FOLDERS.BY_ID -> /folders/${folderId}
FOLDERS.MOVE -> /folders/${folderId}/move
QUESTION_FOLDERS.BASE -> /questions-folder
QUESTION_FOLDERS.ROOT -> /questions-folder/root
QUESTION_FOLDERS.BY_ID -> /questions-folder/${questionId}
QUESTION_FOLDERS.MOVE -> /questions-folder/${questionId}/move
QUESTION_FOLDERS.BY_FOLDER -> /questions-folder/folder/${folderId}
QUIZZES.BASE -> /quizzes
QUIZZES.BY_ID -> /quizzes/${id}
QUIZZES.ADD_LIST -> /quizzes/${quizId}/add_list
QUIZZES.UPDATE_LIST -> /quizzes/${quizId}/update_list
QUIZZES.GET_BY_FILTER -> /quizzes/filter?${buildQuery(filter)}
QUIZZES.START -> /quizzes/${quizId}/start
QUIZZES.ACTIVE_INSTANCE -> /quizzes/${quizId}/active-instance
QUESTIONS.IMPORT -> /questions/import
QUESTIONS.BY_QUIZ -> /quizzes/${quizId}/questions
QUESTIONS.ADD_LIST -> /quizzes/${quizId}/questions/add_list
QUIZ_INSTANCES.START -> /quiz-instances/start
QUIZ_INSTANCES.CHECK_ELIGIBILITY -> /quiz-instances/check-eligibility
QUIZ_INSTANCES.BY_ID -> /quiz-instances/${instanceId}
QUIZ_INSTANCES.SUBMIT -> /quiz-instances/${instanceId}/submit
QUIZ_INSTANCES.RESULT -> /quiz-instances/${instanceId}/result
QUIZ_INSTANCES.SAVE_ANSWER -> /quiz-instances/${instanceId}/answer
QUIZ_INSTANCES.GET_STATE -> /quiz-instances/${instanceId}/state
ATTEMPTS.BASE -> /attempts
ATTEMPTS.BY_ID -> /attempts/${id}
ATTEMPTS.BY_USER -> /attempts/user/${userId}
ATTEMPTS.BY_QUIZ_AND_USER -> /attempts/quiz/${quizId}/user/${userId}
ATTEMPTS.USER_STATISTICS -> /attempts/user/${userId}/statistics
GROUPS.BASE -> /groups
GROUPS.OWNED -> /groups/owned
GROUPS.JOINED -> /groups/joined
GROUPS.JOIN -> /groups/join
GROUPS.BY_ID -> /groups/${groupId}
GROUPS.GET_CODE_INVITE -> /groups/${groupId}/get-code-invite
GROUPS.RELOAD_CODE_INVITE -> /groups/${groupId}/reload-code-invite
GROUPS.FIND_LOBBY_BY_CODE -> /groups/find-lobby-by-code/${encodeURIComponent(codeInvite)}
GROUPS.MEMBERS -> /groups/${groupId}/members
GROUPS.REMOVE_MEMBER -> /groups/${groupId}/members/${userId}
GROUPS.QUIZZES -> /groups/${groupId}/quizzes
GROUPS.ADD_QUIZ -> /groups/${groupId}/quizzes
GROUPS.UPDATE_QUIZ -> /groups/${groupId}/quizzes/${quizId}
GROUPS.REMOVE_QUIZ -> /groups/${groupId}/quizzes/${quizId}
GROUPS.IMPORT_QUESTIONS -> /groups/${groupId}/questions/import
GROUPS.ANNOUNCEMENTS -> /groups/${groupId}/announcements
GROUPS.ADD_ANNOUNCEMENT -> /groups/${groupId}/add-announcement
GROUPS.UPDATE_ANNOUNCEMENT -> /groups/${groupId}/announcements/${announcementId}
GROUPS.DELETE_ANNOUNCEMENT -> /groups/${groupId}/announcements/${announcementId}
GROUPS.LEAVE -> /groups/${groupId}/leave
ADMIN.BASE -> /tomzxyadmin
ADMIN.USERS -> /tomzxyadmin/users
ADMIN.GROUPS -> /tomzxyadmin/groups
ADMIN.QUIZZES -> /tomzxyadmin/quizzes
ADMIN.RESULTS -> /tomzxyadmin/results
ADMIN.SUBJECTS -> /tomzxyadmin/subjects
ADMIN.ROLES -> /tomzxyadmin/roles
ADMIN.NOTIFICATIONS -> /tomzxyadmin/notifications
ADMIN.QUESTION_BANKS -> /tomzxyadmin/question-banks
ADMIN.USER -> /tomzxyadmin/users/${userId}
ADMIN.GROUP -> /tomzxyadmin/groups/${groupId}
ADMIN.QUIZ -> /tomzxyadmin/quizzes/${quizId}
ADMIN.RESULT -> /tomzxyadmin/results/${resultId}
ADMIN.SUBJECT -> /tomzxyadmin/subjects/${subjectId}
ADMIN.ROLE -> /tomzxyadmin/roles/${roleId}
ADMIN.NOTIFICATION -> /tomzxyadmin/notifications/${notificationId}
ROLES.BASE -> /roles
ROLES.BY_ID -> /roles/${roleId}
NOTIFICATIONS.BASE -> /notifications
NOTIFICATIONS.BY_ID -> /notifications/${id}
Unused endpoints:
USERS.BASE -> /users
SUBJECTS.QUIZ_COUNT -> /subjects/quiz_count
QUIZZES.CREATE -> /quizzes
QUIZZES.UPDATE -> /quizzes/${id}
QUIZZES.DELETE -> /quizzes/${id}
QUESTIONS.BY_ID -> /quizzes/${quizId}/questions/${questionId}
ANSWERS.BASE -> /answers
ANSWERS.BY_ID -> /answers/${id}
QUIZ_USER_RESPONSES.BASE -> /quiz-user-responses
QUIZ_USER_RESPONSES.SUBMIT -> /quiz-user-responses/submit
QUIZ_USER_RESPONSES.SKIP -> /quiz-user-responses/skip
QUIZ_USER_RESPONSES.CORRECT -> /quiz-user-responses/correct
QUIZ_USER_RESPONSES.CORRECT_PAGE -> /quiz-user-responses/correct/page
QUIZ_USER_RESPONSES.ANSWERED -> /quiz-user-responses/answered
QUIZ_USER_RESPONSES.SKIPPED -> /quiz-user-responses/skipped
QUIZ_USER_RESPONSES.RECENT -> /quiz-user-responses/recent
QUIZ_USER_RESPONSES.DATE_RANGE -> /quiz-user-responses/date-range
QUIZ_USER_RESPONSES.TIME_RANGE -> /quiz-user-responses/time-range
QUIZ_USER_RESPONSES.BY_ID -> /quiz-user-responses/${id}
QUIZ_USER_RESPONSES.UPDATE_ANSWER -> /quiz-user-responses/${responseId}/answer
QUIZ_USER_RESPONSES.BY_USER -> /quiz-user-responses/user/${userId}
QUIZ_USER_RESPONSES.BY_USER_PAGE -> /quiz-user-responses/user/${userId}/page
QUIZ_USER_RESPONSES.BY_QUIZ_INSTANCE -> /quiz-user-responses/quiz-instance/${quizInstanceId}
QUIZ_USER_RESPONSES.BY_QUIZ_INSTANCE_USER -> /quiz-user-responses/quiz-instance/${quizInstanceId}/user/${userId}
