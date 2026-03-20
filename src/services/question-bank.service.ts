import { questionBankRepository } from '@/repositories';
import { QuestionBankReqDTO, QuestionBankResDTO } from '@/domains';

export class QuestionBankService {
    async getMyQuestionBank(): Promise<QuestionBankResDTO> {
        return await questionBankRepository.getMyQuestionBank();
    }

    async createQuestionBank(req: QuestionBankReqDTO): Promise<QuestionBankResDTO> {
        return await questionBankRepository.createQuestionBank(req);
    }

    async updateQuestionBank(req: QuestionBankReqDTO): Promise<QuestionBankResDTO> {
        return await questionBankRepository.updateQuestionBank(req);
    }

    async deleteQuestionBank(): Promise<void> {
        return await questionBankRepository.deleteQuestionBank();
    }
}

export const questionBankService = new QuestionBankService();
