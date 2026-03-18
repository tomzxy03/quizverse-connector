import { questionRepository, quizRepository } from '@/repositories';
import type { QuestionResDTO, QuizQuestionReqDTO } from '@/domains';
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
                answers: (q.options || []).map((opt) => ({
                    answerName: opt.text.trim(),
                    answerType: 'text',
                    answerCorrect: opt.isCorrect,
                })),
            }
        };
    });
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
}

export const questionService = new QuestionService();
