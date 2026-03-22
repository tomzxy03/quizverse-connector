package com.tomzxy.web_quiz.containts;

public abstract class ApiDefined {
    public static final String API_PREFIX = "/api";

    public static final class Auth {
        public static final String BASE = API_PREFIX + "/auth";
        public static final String LOGIN = "/login";
        public static final String SIGNUP = "/signup";
        public static final String LOGOUT = "/logout";
        public static final String TOKEN = "/token";
        public static final String FORGOT_PASSWORD = "/forgot_password";
        public static final String RESET_PASSWORD = "/reset_password";
        public static final String ME = "/me";
        public static final String REGISTER = "/register";
        public static final String REFRESH = "/refresh";
        public static final String REFRESH_TOKEN = "/refresh_token";
        public static final String UPDATE_INFO = "/{userId}/profile";
        public static final String CHANGE_PASSWORD = "/change_password";
        public static final String CHANGE_AVATAR = "/avatar";
        public static final String INTROSPECT = "/introspect";
    }

    public static final class User {
        public static final String BASE = API_PREFIX + "/users";
        public static final String ID = "{userId}";
        public static final String PROFILE = "{userId}/profile";
        public static final String DELETE_MANY = "/delete_many";
        public static final String QUIZZES = ID + "/quizzes_result";
    }

    public static final class Role {
        public static final String BASE = API_PREFIX + "/roles";
        public static final String ID = "{roleId}";
        public static final String DELETE_MANY = "/delete_many";
    }

    public static final class Subject {
        public static final String BASE = API_PREFIX + "/subjects";
        public static final String QUIZ = "/quiz_count";
        public static final String ID = "{subjectId}";
        public static final String DELETE_MANY = "/delete_many";
    }

    public static final class Question {
        public static final String BASE = API_PREFIX + "/questions";
        public static final String ID = "{questionId}";
        public static final String SUBJECT = "/subject_text";
        public static final String ADD_LIST = "/add_list";
        public static final String DELETE_MANY = "/delete_many";
        public static final String ADD_ANSWER = ID + "/add-answer";
        public static final String TEXT = "/question_text";
        public static final String CHAPTER = "/chapter_text";
        public static final String IMPORT = "/import";
        public static final String LEVEL = "/level";
    }

    public static final class Answer {
        public static final String BASE = API_PREFIX + "/answers";
        public static final String ID = "{answerId}";
        public static final String DELETE_MANY = "/delete_many";
    }

    public static final class Group {
        public static final String BASE = API_PREFIX + "/groups";
        public static final String ID = "{groupId}";
        public static final String OWNED = "/owned";
        public static final String JOINED = "/joined";
        public static final String DELETE_MANY = "/delete_many";
        public static final String MEMBER = ID + "/members";
        public static final String MEMBER_ID = ID + "/members/{userId}";
        public static final String MEMBER_ROLE = ID + "/members/{userId}/role";
        public static final String ADD_MEMBER = ID + "/add-member";
        public static final String LEAVE = ID + "/leave";
        public static final String NOTIFICATIONS = ID + "/announcements";
        public static final String NOTIFICATION = NOTIFICATIONS + "/{announcementId}";
        public static final String ADD_NOTIFICATION = ID + "/add-announcement";
        public static final String UPDATE_NOTIFICATION = ID + "/{announcementId}/update";
        public static final String DELETE_NOTIFICATION = ID + "/{announcementId}/delete";
        public static final String QUIZ = ID + "/quizzes";
        public static final String QUIZ_ID = QUIZ + "/{quizId}";
        public static final String UPDATE_QUIZ = QUIZ + "/{quizId}/update";
        public static final String DELETE_QUIZ = QUIZ + "/{quizId}/delete";
        public static final String RESOURCES = ID + "/resources";
        public static final String RESOURCE_ID = RESOURCES + "/{resourceId}";
        public static final String BY_USER = "/user/{userId}";
        public static final String RELOAD_CODE_INVITE = ID + "/reload-code-invite";
        public static final String FIND_LOBBY_BY_CODE = "/find-lobby-by-code/{codeInvite}";
        public static final String GET_CODE_INVITE = ID + "/get-code-invite";
        public static final String JOIN = "/join";
        public static final String IMPORT = ID + "/questions/import";
    }

    public static final class Notification {
        public static final String BASE = API_PREFIX + "/notifications";
        public static final String ID = "{notificationId}";
        public static final String DELETE_MANY = "/delete_many";
        public static final String CHANGE_STATUS = ID + "/status";
    }

    public static final class Quiz {
        public static final String BASE = API_PREFIX + "/quizzes";
        public static final String ID = "{quizId}";
        public static final String DELETE_MANY = "/delete_many";
        public static final String ADD_QUIZ = "/{chapterId}";
        public static final String QUESTION = ID + "/questions";
        public static final String ADD_QUESTION = ID + "/add_list";
        public static final String UPDATE_QUESTION = ID + "/update_list";
        public static final String DELETE_QUESTION = ID + "/{questionId}";
        public static final String DELETE_QUESTIONS = ID + DELETE_MANY;
        public static final String LATEST = "/latest";
        public static final String FILTER = "/filter";
        public static final String SUBJECT_FILTER = "/subject/{subjectId}";
        public static final String SUBJECTS_LIST = "/subjects";
        public static final String STATISTICS = ID + "/statistics";
        public static final String TRENDING = "/trending";
    }

    public static final class QuizInstance {
        public static final String BASE = API_PREFIX + "/quiz-instances";
        public static final String ID = "{instanceId}";
        public static final String DELETE = ID + "/delete";
        public static final String SUBMIT = ID + "/submit";
        public static final String RESULT = ID + "/result";
        public static final String START = "/start";
        public static final String STATE = ID + "/state";
        public static final String ANSWERS = ID + "/answer";
        public static final String CHECK_ELIGIBILITY = "/check-eligibility";
    }

    public static final class QuizUserResponse {
        public static final String BASE = API_PREFIX + "/quiz_user_responses";
        public static final String ID = "{responseId}";
        public static final String DELETE_MANY = "/delete_many";
        public static final String SUBMIT = "/submit";
        public static final String ANSWER = ID + "/answer";
        public static final String SKIP = ID + "/skip";
        public static final String USER = "/user/{userId}";
        public static final String USER_PAGE = USER + "/page";
        public static final String QUIZ_INSTANCE = "/quiz-instance/{quizInstanceId}";
        public static final String QUIZ_INSTANCE_USER = QUIZ_INSTANCE + "/user/{userId}";
        public static final String CORRECT = "/correct";
        public static final String CORRECT_PAGE = CORRECT + "/page";
        public static final String TIME_RANGE = "/time-range";
        public static final String DATE_RANGE = "/date-range";
        public static final String RECENT = "/recent";
        public static final String SKIPPED = "/skipped";
        public static final String ANSWERED = "/answered";

    }

    public static final class QuizResult {
        public static final String BASE = API_PREFIX + "/quizzes_result";
        public static final String ID = "{quiz_resultId}";
        public static final String DELETE_MANY = "/delete_many";
    }

    public static final class Dashboard {
        public static final String BASE = API_PREFIX + "/dashboard";
        public static final String BY_USER = "/{userId}";
        public static final String SUMMARY = "/summary";
    }

    public static final class Statistics {
        public static final String BASE = API_PREFIX + "/statistics";
        public static final String USER = "/user/{userId}";
        public static final String QUIZ = "/quiz/{quizId}";
        public static final String GLOBAL = "/dashboard";
    }

    public static final class Files {
        public static final String BASE = API_PREFIX + "/files";
        public static final String UPLOAD = "/upload";
    }

    public static final class QuestionBank {
        public static final String ROOT = API_PREFIX + "/question-banks";
        public static final String MY_BANK = "/my-bank";
        public static final String LIST = "";
        public static final String BY_OWNER_ID = "/{ownerId}";
        public static final String CREATE = "";
        public static final String UPDATE = "";
        public static final String DELETE = "";
    }

    public static final class Folder {
        public static final String ROOT = API_PREFIX + "/folders";
        public static final String LIST = "";
        public static final String CREATE = "";
        public static final String BY_ID = "/{folderId}";
        public static final String ROOT_FOLDERS = "/root";
        public static final String SUBFOLDERS = "/{parentFolderId}/subfolders";
        public static final String TREE = "/tree";
        public static final String MOVE = "/{folderId}/move";
    }

    public static final class QuestionFolder {
        public static final String ROOT = API_PREFIX + "/questions-folder";
        public static final String LIST = "";
        public static final String CREATE = "";
        public static final String BY_ID = "/{questionId}";
        public static final String BY_FOLDER = "/folder/{folderId}";
        public static final String ROOT_LEVEL = "/root";
        public static final String TREE = "/tree";
        public static final String MOVE_TO_FOLDER = "/{questionId}/move";
        public static final String MOVE_TO_ROOT = "/{questionId}/move-root";
    }

    public static final class Admin {
        public static final String BASE = API_PREFIX + "/tomzxyadmin";

        // Relative paths for use with @RequestMapping(BASE)
        public static final String USERS = "/users";
        public static final String USER_ID = "/users/{userId}";
        public static final String GROUPS = "/groups";
        public static final String GROUP_ID = "/groups/{groupId}";
        public static final String QUIZZES = "/quizzes";
        public static final String QUIZ_ID = "/quizzes/{quizId}";
        public static final String RESULTS = "/results";
        public static final String RESULT_ID = "/results/{resultId}";
        public static final String SUBJECTS = "/subjects";
        public static final String SUBJECT_ID = "/subjects/{subjectId}";
        public static final String ROLES = "/roles";
        public static final String ROLE_ID = "/roles/{roleId}";
        public static final String NOTIFICATIONS = "/notifications";
        public static final String NOTIFICATION_ID = "/notifications/{notificationId}";
        public static final String QUESTION_BANKS = "/question-banks";
        public static final String QUESTION_BANK_ID = "/question-banks/{questionBankId}";
    }
}


@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping(path = ApiDefined.Admin.BASE)
@Tag(name = "Admin", description = "Admin management APIs")
public class AdminController {

    private final AdminService adminService;

    // ─── Dashboard ──────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "Admin dashboard", description = "Get admin dashboard summary with counts, trends, and recent items")
    public ResponseEntity<DataResDTO<AdminDashboardResDTO>> getDashboard() {
        log.info("Admin: get dashboard");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getDashboard()));
    }

    // ─── Users ──────────────────────────────────────────────────────────

    @GetMapping(ApiDefined.Admin.USERS)
    @Operation(summary = "List users", description = "List all users with pagination, search, and filters")
    public ResponseEntity<DataResDTO<PageResDTO<AdminUserResDTO>>> getUsers(AdminListReqDTO req) {
        log.info("Admin: list users");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getUsers(req)));
    }

    @PutMapping(ApiDefined.Admin.USER_ID)
    @Operation(summary = "Update user", description = "Update user status and/or roles")
    public ResponseEntity<DataResDTO<AdminUserResDTO>> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody AdminUserUpdateReqDTO req) {
        log.info("Admin: update user {}", userId);
        return ResponseEntity.ok(DataResDTO.update(adminService.updateUser(userId, req)));
    }

    @GetMapping(ApiDefined.Admin.USER_ID)
    @Operation(summary = "Get user detail", description = "Get single user detail with roles, groups joined, quiz history")
    public ResponseEntity<DataResDTO<AdminUserDetailResDTO>> getUserDetail(@PathVariable Long userId) {
        log.info("Admin: get user detail {}", userId);
        return ResponseEntity.ok(DataResDTO.ok(adminService.getUserDetail(userId)));
    }

    @DeleteMapping(ApiDefined.Admin.USER_ID)
    @Operation(summary = "Delete user", description = "Soft-delete (deactivate) user")
    public ResponseEntity<DataResDTO<Void>> deleteUser(@PathVariable Long userId) {
        log.info("Admin: delete user {}", userId);
        adminService.deleteUser(userId);
        return ResponseEntity.ok(DataResDTO.delete());
    }

    // ─── Groups ─────────────────────────────────────────────────────────

    @GetMapping(ApiDefined.Admin.GROUPS)
    @Operation(summary = "List groups", description = "List all groups with pagination, search, and filters")
    public ResponseEntity<DataResDTO<PageResDTO<AdminGroupResDTO>>> getGroups(AdminListReqDTO req) {
        log.info("Admin: list groups");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getGroups(req)));
    }

    @PutMapping(ApiDefined.Admin.GROUP_ID)
    @Operation(summary = "Update group", description = "Update group status")
    public ResponseEntity<DataResDTO<AdminGroupResDTO>> updateGroup(
            @PathVariable Long groupId,
            @Valid @RequestBody AdminGroupUpdateReqDTO req) {
        log.info("Admin: update group {}", groupId);
        return ResponseEntity.ok(DataResDTO.update(adminService.updateGroup(groupId, req)));
    }

    @GetMapping(ApiDefined.Admin.GROUP_ID)
    @Operation(summary = "Get group detail", description = "Get single group detail with members, quizzes, announcements count")
    public ResponseEntity<DataResDTO<AdminGroupDetailResDTO>> getGroupDetail(@PathVariable Long groupId) {
        log.info("Admin: get group detail {}", groupId);
        return ResponseEntity.ok(DataResDTO.ok(adminService.getGroupDetail(groupId)));
    }

    @DeleteMapping(ApiDefined.Admin.GROUP_ID)
    @Operation(summary = "Delete group", description = "Soft-delete (deactivate) group")
    public ResponseEntity<DataResDTO<Void>> deleteGroup(@PathVariable Long groupId) {
        log.info("Admin: delete group {}", groupId);
        adminService.deleteGroup(groupId);
        return ResponseEntity.ok(DataResDTO.delete());
    }

    // ─── Quizzes ────────────────────────────────────────────────────────

    @GetMapping(ApiDefined.Admin.QUIZZES)
    @Operation(summary = "List quizzes", description = "List all quizzes with pagination, search, and filters")
    public ResponseEntity<DataResDTO<PageResDTO<AdminQuizResDTO>>> getQuizzes(AdminListReqDTO req) {
        log.info("Admin: list quizzes");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getQuizzes(req)));
    }

    @PutMapping(ApiDefined.Admin.QUIZ_ID)
    @Operation(summary = "Update quiz", description = "Update quiz status and/or visibility")
    public ResponseEntity<DataResDTO<AdminQuizResDTO>> updateQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody AdminQuizUpdateReqDTO req) {
        log.info("Admin: update quiz {}", quizId);
        return ResponseEntity.ok(DataResDTO.update(adminService.updateQuiz(quizId, req)));
    }

    @GetMapping(ApiDefined.Admin.QUIZ_ID)
    @Operation(summary = "Get quiz detail", description = "Get single quiz detail with questions count, attempts count, config")
    public ResponseEntity<DataResDTO<AdminQuizDetailResDTO>> getQuizDetail(@PathVariable Long quizId) {
        log.info("Admin: get quiz detail {}", quizId);
        return ResponseEntity.ok(DataResDTO.ok(adminService.getQuizDetail(quizId)));
    }

    @DeleteMapping(ApiDefined.Admin.QUIZ_ID)
    @Operation(summary = "Delete quiz", description = "Soft-delete (deactivate) quiz")
    public ResponseEntity<DataResDTO<Void>> deleteQuiz(@PathVariable Long quizId) {
        log.info("Admin: delete quiz {}", quizId);
        adminService.deleteQuiz(quizId);
        return ResponseEntity.ok(DataResDTO.delete());
    }

    // ─── Results ────────────────────────────────────────────────────────

    @GetMapping(ApiDefined.Admin.RESULTS)
    @Operation(summary = "List results", description = "List all quiz results with pagination, search, and filters")
    public ResponseEntity<DataResDTO<PageResDTO<AdminResultResDTO>>> getResults(AdminListReqDTO req) {
        log.info("Admin: list results");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getResults(req)));
    }

    @GetMapping(ApiDefined.Admin.RESULT_ID)
    @Operation(summary = "Get result detail", description = "Get single result detail with user responses and scoring breakdown")
    public ResponseEntity<DataResDTO<AdminResultDetailResDTO>> getResultDetail(@PathVariable Long resultId) {
        log.info("Admin: get result detail {}", resultId);
        return ResponseEntity.ok(DataResDTO.ok(adminService.getResultDetail(resultId)));
    }

    @DeleteMapping(ApiDefined.Admin.RESULT_ID)
    @Operation(summary = "Delete result", description = "Soft-delete quiz instance")
    public ResponseEntity<DataResDTO<Void>> deleteResult(@PathVariable Long resultId) {
        log.info("Admin: delete result {}", resultId);
        adminService.deleteResult(resultId);
        return ResponseEntity.ok(DataResDTO.delete());
    }

    // ─── Subjects ───────────────────────────────────────────────────────
    @GetMapping(ApiDefined.Admin.SUBJECTS)
    @Operation(summary = "List subjects", description = "Lists all subjects with quiz counts")
    public ResponseEntity<DataResDTO<java.util.List<AdminSubjectResDTO>>> getSubjects() {
        log.info("Admin: get subjects");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getSubjects()));
    }

    @PostMapping(ApiDefined.Admin.SUBJECTS)
    @Operation(summary = "Create subject", description = "Create a new subject")
    public ResponseEntity<DataResDTO<Void>> createSubject(@Valid @RequestBody AdminSubjectReqDTO req) {
        log.info("Admin: create subject");
        adminService.createSubject(req);
        return ResponseEntity.ok(DataResDTO.create());
    }

    @PutMapping(ApiDefined.Admin.SUBJECT_ID)
    @Operation(summary = "Update subject", description = "Update subject details")
    public ResponseEntity<DataResDTO<AdminSubjectResDTO>> updateSubject(
            @PathVariable Long subjectId,
            @Valid @RequestBody AdminSubjectReqDTO req) {
        log.info("Admin: update subject {}", subjectId);
        return ResponseEntity.ok(DataResDTO.update(adminService.updateSubject(subjectId, req)));
    }

    @DeleteMapping(ApiDefined.Admin.SUBJECT_ID)
    @Operation(summary = "Delete subject", description = "Soft-delete subject")
    public ResponseEntity<DataResDTO<Void>> deleteSubject(@PathVariable Long subjectId) {
        log.info("Admin: delete subject {}", subjectId);
        adminService.deleteSubject(subjectId);
        return ResponseEntity.ok(DataResDTO.delete());
    }

    // ─── Roles ──────────────────────────────────────────────────────────
    @GetMapping(ApiDefined.Admin.ROLES)
    @Operation(summary = "List roles", description = "Lists all roles with user counts and permissions")
    public ResponseEntity<DataResDTO<java.util.List<AdminRoleResDTO>>> getRoles() {
        log.info("Admin: get roles");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getRoles()));
    }

    @GetMapping(ApiDefined.Admin.ROLE_ID)
    @Operation(summary = "Get role detail", description = "Get single role detail with permissions and user count")
    public ResponseEntity<DataResDTO<AdminRoleResDTO>> getRole(@PathVariable Long roleId) {
        log.info("Admin: get role {}", roleId);
        return ResponseEntity.ok(DataResDTO.ok(adminService.getRole(roleId)));
    }

    @PostMapping(ApiDefined.Admin.ROLES)
    @Operation(summary = "Create role", description = "Create a new role with permissions")
    public ResponseEntity<DataResDTO<AdminRoleResDTO>> createRole(@Valid @RequestBody AdminRoleReqDTO req) {
        log.info("Admin: create role {}", req.getName());
        return ResponseEntity.ok(DataResDTO.create(adminService.createRole(req)));
    }

    @PutMapping(ApiDefined.Admin.ROLE_ID)
    @Operation(summary = "Update role", description = "Update an existing role's permissions or name")
    public ResponseEntity<DataResDTO<AdminRoleResDTO>> updateRole(
            @PathVariable Long roleId,
            @Valid @RequestBody AdminRoleReqDTO req) {
        log.info("Admin: update role {}", roleId);
        return ResponseEntity.ok(DataResDTO.update(adminService.updateRole(roleId, req)));
    }

    @DeleteMapping(ApiDefined.Admin.ROLE_ID)
    @Operation(summary = "Delete role", description = "Delete an existing role")
    public ResponseEntity<DataResDTO<Void>> deleteRole(@PathVariable Long roleId) {
        log.info("Admin: delete role {}", roleId);
        adminService.deleteRole(roleId);
        return ResponseEntity.ok(DataResDTO.delete());
    }

    // ─── Notifications ──────────────────────────────────────────────────
    @GetMapping(ApiDefined.Admin.NOTIFICATIONS)
    @Operation(summary = "List notifications", description = "Lists all notifications across groups")
    public ResponseEntity<DataResDTO<PageResDTO<AdminNotificationResDTO>>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Admin: get notifications");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getNotifications(page, size)));
    }

    @DeleteMapping(ApiDefined.Admin.NOTIFICATION_ID)
    @Operation(summary = "Delete notification", description = "Delete notification")
    public ResponseEntity<DataResDTO<Void>> deleteNotification(@PathVariable Long notificationId) {
        log.info("Admin: delete notification {}", notificationId);
        adminService.deleteNotification(notificationId);
        return ResponseEntity.ok(DataResDTO.delete());
    }

    // ─── Question Banks ─────────────────────────────────────────────────
    @GetMapping(ApiDefined.Admin.QUESTION_BANKS)
    @Operation(summary = "List question banks", description = "Lists all question banks with owner info")
    public ResponseEntity<DataResDTO<PageResDTO<AdminQuestionBankResDTO>>> getQuestionBanks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Admin: get question banks");
        return ResponseEntity.ok(DataResDTO.ok(adminService.getQuestionBanks(page, size)));
    }
}
public class AdminListReqDTO {
    private Integer page = 0;
    private Integer size = 10;
    private String sortBy;
    private String direction; // ASC | DESC
    private String search;
    private String status;
    private String visibility;
    private Long groupId;
    private Long quizId;
    private Long userId;
}
public class AdminGroupResDTO {
    private Long id;
    private String name;
    private String ownerName;
    private Integer memberCount;
    private Integer quizCount;
    private AdminGroupStatus status;
    private String createdAt;
}
public class AdminUserResDTO {
    private Long id;
    private String userName;
    private String email;
    private List<String> roles;
    private AdminUserStatus status;
    private String createdAt;
    private String lastLoginAt;
    private Integer quizTakenCount;
    private Integer groupCount;
}
public class AdminUserUpdateReqDTO {
    private AdminUserStatus status;
    private List<String> roles;
}
public class AdminUserDetailResDTO {
    private Long id;
    private String userName;
    private String email;
    private String profilePictureUrl;
    private List<String> roles;
    private AdminUserStatus status;
    private String createdAt;
    private String lastLoginAt;
    private Integer quizTakenCount;
    private Integer groupCount;
    private List<AdminGroupResDTO> groups;
    private List<AdminResultResDTO> recentResults;
}
public class AdminGroupResDTO {
    private Long id;
    private String name;
    private String ownerName;
    private Integer memberCount;
    private Integer quizCount;
    private AdminGroupStatus status;
    private String createdAt;
}
public class AdminGroupUpdateReqDTO {
    private AdminGroupStatus status;
}
public class AdminGroupDetailResDTO {
    private Long id;
    private String name;
    private String ownerName;
    private String codeInvite;
    private Integer memberCount;
    private Integer quizCount;
    private Integer announcementCount;
    private AdminGroupStatus status;
    private String createdAt;
    private List<AdminMemberResDTO> members;
    private List<AdminQuizResDTO> quizzes;
}
public class AdminQuizResDTO {
    private Long id;
    private String title;
    private String subject;
    private String ownerName;
    private String groupName;
    private AdminQuizStatus status;
    private AdminQuizVisibility visibility;
    private Integer questionCount;
    private Integer attemptsCount;
    private String createdAt;
}
public class AdminQuizUpdateReqDTO {
    private AdminQuizStatus status;
    private AdminQuizVisibility visibility;
}
