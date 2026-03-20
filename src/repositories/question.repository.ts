import { apiClient, API_ENDPOINTS } from '@/core/api';
import { QuestionReqDTO, QuestionResDTO, QuestionFolderResDTO, QuestionFolderReqDTO } from '@/domains';

export const questionRepository = {
    /** Fetch all questions belonging to a quiz */
    getByQuiz(quizId: number): Promise<QuestionResDTO[]> {
        return apiClient.get<QuestionResDTO[]>(API_ENDPOINTS.QUESTIONS.BY_QUIZ(quizId));
    },

    /** Add a list of questions to a quiz */
    addList(quizId: number, questions: QuestionReqDTO[]): Promise<QuestionResDTO[]> {
        return apiClient.post<QuestionResDTO[]>(API_ENDPOINTS.QUESTIONS.ADD_LIST(quizId), questions);
    },

    // --- Question Folder / Question Bank Methods ---

    /** Get paginated list of all questions in my bank */
    getAllQuestionsByBank(page = 0, size = 20, sort = 'createdAt,desc', search?: string): Promise<any> {
        const params: Record<string, any> = { page, size, sort };
        if (search) params.search = search;
        return apiClient.get<any>(API_ENDPOINTS.QUESTION_FOLDERS.BASE, { params });
    },

    /** Get root-level questions (not in any folder) */
    getRootQuestions(page = 0, size = 20): Promise<any> {
        return apiClient.get<any>(API_ENDPOINTS.QUESTION_FOLDERS.ROOT, { params: { page, size } });
    },

    /** Get all questions in specific folder */
    getQuestionsInFolder(folderId: number, page = 0, size = 20): Promise<any> {
        return apiClient.get<any>(API_ENDPOINTS.QUESTION_FOLDERS.BY_FOLDER(folderId), { params: { page, size } });
    },

    /** Get question details */
    getQuestionDetails(questionId: number): Promise<QuestionFolderResDTO> {
        return apiClient.get<QuestionFolderResDTO>(API_ENDPOINTS.QUESTION_FOLDERS.BY_ID(questionId));
    },

    /** Create new question in specific folder or root level */
    createQuestionInFolder(req: QuestionFolderReqDTO): Promise<QuestionFolderResDTO> {
        return apiClient.post<QuestionFolderResDTO>(API_ENDPOINTS.QUESTION_FOLDERS.BASE, req);
    },

    /** Update question in folder */
    updateQuestionInFolder(questionId: number, req: QuestionFolderReqDTO): Promise<QuestionFolderResDTO> {
        return apiClient.put<QuestionFolderResDTO>(API_ENDPOINTS.QUESTION_FOLDERS.BY_ID(questionId), req);
    },

    /** Delete question (soft delete) */
    deleteQuestion(questionId: number): Promise<void> {
        return apiClient.delete<void>(API_ENDPOINTS.QUESTION_FOLDERS.BY_ID(questionId));
    },

    /** Move question to different folder */
    moveQuestionToFolder(questionId: number, folderId: number | null): Promise<QuestionFolderResDTO> {
        return apiClient.put<QuestionFolderResDTO>(API_ENDPOINTS.QUESTION_FOLDERS.MOVE(questionId), { folderId });
    },
};
