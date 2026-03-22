import { questionRepository, quizRepository } from '@/repositories';
import type { QuestionResDTO, QuizQuestionReqDTO, QuestionFolderReqDTO, QuestionFolderResDTO, QuestionReqDTO, AnswerReqDTO } from '@/domains';
import type { FormQuestion } from '@/components/quiz/QuizForm';

/** Transform form questions into backend QuizQuestionReqDTO[] */
function toQuizQuestionReqDTOs(formQuestions: FormQuestion[]): QuizQuestionReqDTO[] {
    return formQuestions.map((q) => {
        const isNew = String(q.id).startsWith('q-') || String(q.id).startsWith('new-');

        return {
            questionId: !isNew && typeof q.id === 'number' ? q.id : undefined,
            points: q.points || 1,
            questionReqDTO: {
                questionName: q.text.trim(),
                questionType: 'text',
                answerType: 'single_choice',
                answers: (q.options || []).map((opt) => ({
                    answerName: opt.text.trim(),
                    answerType: 'text',
                    answerCorrect: opt.isCorrect,
                })),
            }
        };
    });
}

/** Transform FormQuestion[] into QuestionReqDTO[] for question bank */
function toQuestionReqDTOs(formQuestions: FormQuestion[]): QuestionReqDTO[] {
    return formQuestions.map((q) => ({
        questionName: q.text.trim(),
        questionType: 'text',
        answerType: 'single_choice',
        answers: (q.options || []).map((opt) => ({
            answerName: opt.text.trim(),
            answerType: 'text',
            answerCorrect: opt.isCorrect,
        })),
    }));
}

/** Transform QuestionReqDTO[] into individual requests for creating in folder */
function toQuestionFolderReqDTO(
    question: QuestionReqDTO,
    folderId?: number | null
): QuestionFolderReqDTO {
    return {
        folderId: folderId ?? undefined,
        questions: question,
    };
}

export class QuestionService {
    /** Fetch questions for a quiz (for edit mode) */
    async getByQuiz(quizId: number): Promise<QuestionResDTO[]> {
        return await questionRepository.getByQuiz(quizId);
    }

    /** Add form questions to a quiz (transforms FormQuestion[] → QuizQuestionReqDTO[]) */
    async addQuestionsToQuiz(quizId: number, formQuestions: FormQuestion[]): Promise<void> {
        const dtos = toQuizQuestionReqDTOs(formQuestions);
        return await quizRepository.addQuestionsToQuiz(quizId, dtos);
    }

    /** Update form questions for a quiz (transforms FormQuestion[] → QuizQuestionReqDTO[]) */
    async updateQuestionsToQuiz(quizId: number, formQuestions: FormQuestion[]): Promise<void> {
        const dtos = toQuizQuestionReqDTOs(formQuestions);
        return await quizRepository.updateQuestionsToQuiz(quizId, dtos);
    }

    /** Import questions from Excel for preview */
    async importQuestionsFromExcel(file: File): Promise<QuestionResDTO[]> {
        return await questionRepository.importQuestionsFromExcel(file);
    }
    /** Import questions from Excel for group quiz */
    async importQuestionsFromExcelForGroup(groupId: number, file: File): Promise<QuestionResDTO[]> {
        return await questionRepository.importQuestionsFromExcelForGroup(groupId, file);
    }

    // --- Question Folder / Question Bank Methods ---

    async getAllQuestionsByBank(page = 0, size = 20, sort = 'createdAt,desc', search?: string): Promise<any> {
        return await questionRepository.getAllQuestionsByBank(page, size, sort, search);
    }

    async getRootQuestions(page = 0, size = 20): Promise<any> {
        return await questionRepository.getRootQuestions(page, size);
    }

    async getQuestionsInFolder(folderId: number, page = 0, size = 20): Promise<any> {
        return await questionRepository.getQuestionsInFolder(folderId, page, size);
    }

    async getQuestionDetails(questionId: number): Promise<QuestionFolderResDTO> {
        return await questionRepository.getQuestionDetails(questionId);
    }

    async createQuestionInFolder(req: QuestionFolderReqDTO): Promise<QuestionFolderResDTO> {
        return await questionRepository.createQuestionInFolder(req);
    }

    /** Create multiple questions in specific folder or root level */
    async createQuestionsInFolder(
        questions: QuestionReqDTO[],
        folderId?: number | null
    ): Promise<QuestionFolderResDTO[]> {
        // Validate questions
        if (!questions || questions.length === 0) {
            throw new Error('Phải cung cấp ít nhất một câu hỏi.');
        }

        // Validate each question
        questions.forEach((q, index) => {
            if (!q.questionName?.trim()) {
                throw new Error(`Câu hỏi ${index + 1}: Nội dung không được để trống.`);
            }

            if (!q.questionType) {
                throw new Error(`Câu hỏi ${index + 1}: Loại câu hỏi không được để trống.`);
            }

            if (!q.answers || q.answers.length === 0) {
                throw new Error(`Câu hỏi ${index + 1}: Phải có ít nhất một đáp án.`);
            }

            const hasCorrectAnswer = q.answers.some((a) => a.answerCorrect);
            if (!hasCorrectAnswer) {
                throw new Error(`Câu hỏi ${index + 1}: Phải chọn ít nhất một đáp án đúng.`);
            }

            // Validate answers
            q.answers.forEach((a, answerIndex) => {
                if (!a.answerName?.trim()) {
                    throw new Error(`Câu hỏi ${index + 1}, đáp án ${answerIndex + 1}: Nội dung không được để trống.`);
                }

                if (!a.answerType) {
                    throw new Error(`Câu hỏi ${index + 1}, đáp án ${answerIndex + 1}: Loại đáp án không được để trống.`);
                }
            });
        });

        // Send each question individually (backend expects single question per request)
        const results: QuestionFolderResDTO[] = [];
        for (const question of questions) {
            const createReq = toQuestionFolderReqDTO(question, folderId);
            const result = await questionRepository.createQuestionInFolder(createReq);
            results.push(result);
        }
        return results;
    }

    /** Create questions in folder from FormQuestion[] */
    async createQuestionsInFolderFromForm(
        formQuestions: FormQuestion[],
        folderId?: number | null
    ): Promise<QuestionFolderResDTO[]> {
        const questionReqDTOs = toQuestionReqDTOs(formQuestions);
        return await this.createQuestionsInFolder(questionReqDTOs, folderId);
    }

    async updateQuestionInFolder(questionId: number, req: QuestionFolderReqDTO): Promise<QuestionFolderResDTO> {
        return await questionRepository.updateQuestionInFolder(questionId, req);
    }

    async deleteQuestion(questionId: number): Promise<void> {
        return await questionRepository.deleteQuestion(questionId);
    }

    async moveQuestionToFolder(questionId: number, folderId: number | null): Promise<QuestionFolderResDTO> {
        return await questionRepository.moveQuestionToFolder(questionId, folderId);
    }
}

export const questionService = new QuestionService();
