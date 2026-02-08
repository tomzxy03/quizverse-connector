import { apiClient, API_ENDPOINTS } from '@/core/api';
import { Subject } from '@/domains/subject/subject.types';
import { SubjectResDTO, SubjectReqDTO } from '@/domains/subject/subject.dto';
import { dtoToSubject } from '@/domains/subject/subject.mapper';

export const subjectRepository = {
  async getAll(): Promise<Subject[]> {
    const dtos = await apiClient.get<SubjectResDTO[]>(API_ENDPOINTS.SUBJECTS.BASE);
    return Array.isArray(dtos) ? dtos.map(dtoToSubject) : [];
  },

  async getById(id: number): Promise<Subject> {
    const dto = await apiClient.get<SubjectResDTO>(API_ENDPOINTS.SUBJECTS.BY_ID(id));
    return dtoToSubject(dto);
  },

  create(data: SubjectReqDTO): Promise<void> {
    return apiClient.post(API_ENDPOINTS.SUBJECTS.CREATE, data);
  },

  update(id: number, data: SubjectReqDTO): Promise<Subject> {
    return apiClient.put(API_ENDPOINTS.SUBJECTS.UPDATE(id), data);
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.SUBJECTS.DELETE(id));
  },
};
