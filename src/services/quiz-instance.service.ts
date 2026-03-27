import { quizInstanceRepository } from '@/repositories';
import {
    QuizInstanceReqDTO,
    QuizInstanceResDTO,
    QuizSubmissionReqDTO,
    QuizResultDetailResDTO,
    QuizAnswerReqDTO,
    QuizInstanceStateResDTO
} from '@/domains';

export class QuizInstanceService {
    /** Start a new quiz attempt or resume in-progress quiz */
    async startQuiz(data: QuizInstanceReqDTO): Promise<QuizInstanceResDTO> {
        return await quizInstanceRepository.start(data);
    }

    /** Get quiz instance by ID */
    async getById(instanceId: number, userId?: number): Promise<QuizInstanceResDTO> {
        return await quizInstanceRepository.getById(instanceId, userId);
    }

    /** Delete quiz instance */
    async deleteInstance(instanceId: number, userId: number): Promise<void> {
        return await quizInstanceRepository.delete(instanceId, userId);
    }

    /** Submit quiz (final submission) */
    async submitQuiz(instanceId: number, data: QuizSubmissionReqDTO): Promise<QuizResultDetailResDTO> {
        return await quizInstanceRepository.submit(instanceId, data);
    }

    /** Get quiz result after submission */
    async getResult(instanceId: number, userId?: number): Promise<QuizResultDetailResDTO> {
        return await quizInstanceRepository.getResult(instanceId, userId);
    }

    /** Check if user is eligible to take quiz */
    async checkEligibility(quizId: number, userId: number): Promise<boolean> {
        return await quizInstanceRepository.checkEligibility(quizId, userId);
    }

    /** Save a single answer to Redis (per-answer save) */
    async saveAnswer(instanceId: number, questionId: number, answer: number[]): Promise<void> {
        const data: QuizAnswerReqDTO = {
            questionId,
            answer
        };
        return await quizInstanceRepository.saveAnswer(instanceId, data);
    }

    /** Get current quiz state (for resume functionality)
     * Returns the saved answers and remaining time
     */
    async getQuizState(instanceId: number): Promise<QuizInstanceStateResDTO> {
        return await quizInstanceRepository.getState(instanceId);
    }
}

export const quizInstanceService = new QuizInstanceService();
